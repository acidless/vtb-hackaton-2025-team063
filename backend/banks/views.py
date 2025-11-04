from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from django.http import HttpRequest

from .models import Bank, UserBankProfile, AccountSharing, BankToken
from .serializers import (
    BankSerializer, UserBankProfileSerializer, AccountSharingSerializer,
    AccountSharingCreateSerializer, AccountSharingResponseSerializer,
    AddBankSerializer, BankAuthSerializer, UserAccountSerializer
)
from .services import BankManagementService, AccountSharingService, BankingService

class BankViewSet(ModelViewSet):
    """Управление банками"""
    queryset = Bank.objects.filter(is_active=True)
    serializer_class = BankSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def add_custom_bank(self, request):
        """Добавление кастомного банка"""
        serializer = AddBankSerializer(data=request.data)
        if serializer.is_valid():
            bank = BankManagementService.add_new_bank(
                name=serializer.validated_data['name'],
                base_url=serializer.validated_data['base_url'],
                client_id=serializer.validated_data['client_id'],
                client_secret=serializer.validated_data['client_secret'],
                custom_name=serializer.validated_data.get('custom_name')
            )
            return Response(BankSerializer(bank).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(ModelViewSet):
    """Управление профилем пользователя"""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserBankProfile.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        return UserBankProfileSerializer
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Получение профиля текущего пользователя"""
        profile = get_object_or_404(UserBankProfile, user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_tokens(self, request):
        """Получение токенов текущего пользователя"""
        profile = get_object_or_404(UserBankProfile, user=request.user)
        tokens = BankManagementService.get_user_tokens(profile)
        # Здесь нужно создать сериализатор для токенов
        return Response({'tokens': 'list of tokens'})

class AccountSharingViewSet(ModelViewSet):
    """Управление объединением учетных записей"""
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSharingSerializer
    
    def get_queryset(self):
        profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return AccountSharing.objects.filter(
            models.Q(sharer=profile) | models.Q(receiver=profile)
        )
    
    def create(self, request):
        """Создание запроса на объединение аккаунтов"""
        profile = get_object_or_404(UserBankProfile, user=request.user)
        serializer = AccountSharingCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                sharing = AccountSharingService.create_sharing_request(
                    sharer_profile=profile,
                    receiver_team_id=serializer.validated_data['receiver_team_id'],
                    permissions=serializer.validated_data['permissions'],
                    expires_in_days=serializer.validated_data['expires_in_days']
                )
                
                response_data = AccountSharingResponseSerializer({
                    'receiver_team_id': sharing.receiver.team_id,
                    'status': sharing.status,
                    'sharing_token': sharing.token,
                    'confirmation_url': f"/api/banking/sharing/confirm/{sharing.token}/"
                }).data
                
                return Response(response_data, status=status.HTTP_201_CREATED)
                
            except ValueError as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='confirm/(?P<token>[^/.]+)')
    def confirm_sharing(self, request, token=None):
        """Подтверждение объединения аккаунтов"""
        profile = get_object_or_404(UserBankProfile, user=request.user)
        
        try:
            sharing = AccountSharingService.accept_sharing_request(token, profile)
            serializer = self.get_serializer(sharing)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'], url_path='reject/(?P<token>[^/.]+)')
    def reject_sharing(self, request, token=None):
        """Отклонение объединения аккаунтов"""
        profile = get_object_or_404(UserBankProfile, user=request.user)
        
        try:
            sharing = AccountSharingService.reject_sharing_request(token, profile)
            serializer = self.get_serializer(sharing)
            return Response(serializer.data)
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def my_shared_accounts(self, request):
        """Получение всех общих аккаунтов"""
        profile = get_object_or_404(UserBankProfile, user=request.user)
        
        # Получаем данные об общих аккаунтах
        shared_data = AccountSharingService.get_shared_accounts(profile)
        
        # Получаем финансовые данные из общих аккаунтов
        banking_service = BankingService()
        shared_accounts_data = banking_service.get_shared_accounts_data(profile)
        
        response_data = {
            'shared_out': AccountSharingSerializer(
                shared_data['shared_out'], many=True
            ).data,
            'shared_in': AccountSharingSerializer(
                shared_data['shared_in'], many=True
            ).data,
            'shared_accounts_data': shared_accounts_data
        }
        
        return Response(response_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def authenticate_bank(request):
    """Аутентификация в банке и сохранение токена"""
    profile = get_object_or_404(UserBankProfile, user=request.user)
    serializer = BankAuthSerializer(data=request.data)
    
    if serializer.is_valid():
        bank_name = serializer.validated_data['bank_name']
        
        try:
            # Получаем банк
            bank = Bank.objects.get(name=bank_name)
            
            # Используем client_id пользователя или банка
            client_id = serializer.validated_data.get('client_id') or profile.team_id
            client_secret = serializer.validated_data.get('client_secret') or bank.client_secret
            
            # Получаем токен через банковский клиент
            client = BankClientFactory.get_client(bank_name)
            token_data = client._request_token()  # Используем внутренний метод
            
            # Сохраняем токен
            bank_token = BankManagementService.store_bank_token(
                user_profile=profile,
                bank=bank,
                access_token=token_data['access_token'],
                token_type='CLIENT',  # или 'BANK' в зависимости от контекста
                expires_in=token_data['expires_in'],
                scope=token_data.get('scope', '')
            )
            
            return Response({
                'status': 'success',
                'token_id': bank_token.id,
                'expires_at': bank_token.expires_at,
                'bank': bank.name
            })
            
        except Bank.DoesNotExist:
            return Response(
                {'error': f'Банк {bank_name} не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Ошибка аутентификации: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)