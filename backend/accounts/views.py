from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from banks.models import UserBankProfile
from .models import Account, Transaction
from .serializers import (
    AccountSerializer, TransactionSerializer, AccountCreateSerializer,
    AccountStatusUpdateSerializer, AccountCloseSerializer
)
from .services import AccountService, TransactionService


class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return Account.objects.filter(user_profile=user_profile).prefetch_related('balances')

    @action(detail=False, methods=['post'])
    def sync(self, request):
        """Синхронизация счетов со всеми банками"""
        user_profile = get_object_or_404(UserBankProfile, user=request.user)
        account_service = AccountService(user_profile)

        bank_name = request.data.get('bank_name')
        if bank_name:
            # Синхронизация с конкретным банком
            try:
                accounts = account_service.sync_accounts_from_bank(bank_name)
                return Response({
                    'status': 'success',
                    'synced_accounts': len(accounts),
                    'bank': bank_name
                })
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Синхронизация со всеми банками
            from banks.models import Consent
            consents = Consent.objects.filter(
                user_profile=user_profile,
                status='AUTHORISED'
            )

            total_synced = 0
            errors = []

            for consent in consents:
                try:
                    accounts = account_service.sync_accounts_from_bank(
                        consent.bank.name,
                        consent.consent_id
                    )
                    total_synced += len(accounts)
                except Exception as e:
                    errors.append(f"{consent.bank.name}: {str(e)}")

            response_data = {
                'status': 'partial_success' if errors else 'success',
                'total_synced_accounts': total_synced,
            }
            if errors:
                response_data['errors'] = errors

            return Response(response_data)

    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Получение транзакций счета"""
        account = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)

        # Проверяем, что счет принадлежит пользователю
        if account.user_profile != user_profile:
            return Response(
                {'error': 'Доступ запрещен'},
                status=status.HTTP_403_FORBIDDEN
            )

        account_service = AccountService(user_profile)

        page = int(request.query_params.get('page', 1))
        limit = min(int(request.query_params.get('limit', 50)), 500)
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        try:
            transactions = account_service.get_account_transactions(
                account, page, limit, from_date, to_date
            )
            serializer = TransactionSerializer(transactions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Закрытие счета"""
        account = self.get_object()
        user_profile = get_object_or_404(UserBankProfile, user=request.user)

        if account.user_profile != user_profile:
            return Response(
                {'error': 'Доступ запрещен'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AccountCloseSerializer(data=request.data)
        if serializer.is_valid():
            account_service = AccountService(user_profile)

            try:
                result = account_service.close_account(
                    account,
                    serializer.validated_data['action'],
                    serializer.validated_data.get('destination_account_id')
                )
                return Response(result)
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(UserBankProfile, user=self.request.user)
        return Transaction.objects.filter(account__user_profile=user_profile).select_related('account', 'account__bank')

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Аналитика по транзакциям"""
        user_profile = get_object_or_404(UserBankProfile, user=request.user)

        days = int(request.query_params.get('days', 30))
        spending_patterns = TransactionService.analyze_spending_patterns(user_profile, days)

        return Response({
            'period_days': days,
            'spending_by_category': spending_patterns,
            'categories': TransactionService.get_transaction_categories()
        })
