from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Bank, BankToken, Consent, UserBankProfile, 
    AccountSharing, UserAccount
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserBankProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserBankProfile
        fields = ['id', 'user', 'team_id', 'created_at']

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'name', 'custom_name', 'base_url', 'is_active', 'created_at']

class BankTokenSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source='bank.name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = BankToken
        fields = [
            'id', 'bank', 'bank_name', 'token_type', 'scope', 
            'expires_at', 'is_expired', 'is_active', 'created_at'
        ]

class ConsentSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source='bank.name', read_only=True)
    team_id = serializers.CharField(source='user_profile.team_id', read_only=True)
    
    class Meta:
        model = Consent
        fields = [
            'id', 'bank', 'bank_name', 'team_id', 'consent_id', 'client_id',
            'status', 'permissions', 'expiration_date_time', 'created_at', 'updated_at'
        ]

class AccountSharingSerializer(serializers.ModelSerializer):
    sharer_team_id = serializers.CharField(source='sharer.team_id', read_only=True)
    receiver_team_id = serializers.CharField(source='receiver.team_id', read_only=True)
    sharer_username = serializers.CharField(source='sharer.user.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.user.username', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = AccountSharing
        fields = [
            'id', 'sharer', 'receiver', 'sharer_team_id', 'receiver_team_id',
            'sharer_username', 'receiver_username', 'status', 'permissions',
            'created_at', 'expires_at', 'is_expired', 'token'
        ]
        read_only_fields = ['token']

class AccountSharingCreateSerializer(serializers.Serializer):
    receiver_team_id = serializers.CharField(max_length=50)
    permissions = serializers.ListField(
        child=serializers.CharField(max_length=50),
        default=['ReadAccountsDetail', 'ReadBalances']
    )
    expires_in_days = serializers.IntegerField(default=30, min_value=1, max_value=365)

class AccountSharingResponseSerializer(serializers.Serializer):
    receiver_team_id = serializers.CharField(max_length=50)
    status = serializers.CharField(max_length=20)
    sharing_token = serializers.UUIDField()
    confirmation_url = serializers.URLField()

class UserAccountSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source='bank.name', read_only=True)
    team_id = serializers.CharField(source='user_profile.team_id', read_only=True)
    
    class Meta:
        model = UserAccount
        fields = [
            'id', 'user_profile', 'team_id', 'bank', 'bank_name', 
            'account_id', 'account_data', 'last_sync', 'is_active'
        ]

class AddBankSerializer(serializers.Serializer):
    name = serializers.ChoiceField(choices=Bank.BANK_CHOICES)
    custom_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    base_url = serializers.URLField()
    client_id = serializers.CharField(max_length=100)
    client_secret = serializers.CharField(max_length=255)

class BankAuthSerializer(serializers.Serializer):
    bank_name = serializers.CharField(max_length=10)
    client_id = serializers.CharField(max_length=100, required=False)
    client_secret = serializers.CharField(max_length=100, required=False)