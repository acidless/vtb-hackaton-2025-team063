from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid

class Bank(models.Model):
    BANK_CHOICES = [
        ('VBANK', 'Virtual Bank'),
        ('ABANK', 'Alpha Bank'), 
        ('SBANK', 'Secure Bank'),
        ('CUSTOM', 'Custom Bank'),  # Для добавления новых банков
    ]
    
    name = models.CharField(max_length=10, choices=BANK_CHOICES)
    custom_name = models.CharField(max_length=100, blank=True, null=True)  # Для кастомных банков
    base_url = models.URLField()
    client_id = models.CharField(max_length=100)
    client_secret = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['name', 'custom_name']
    
    def __str__(self):
        if self.name == 'CUSTOM' and self.custom_name:
            return self.custom_name
        return self.get_name_display()
    
    def save(self, *args, **kwargs):
        if self.name != 'CUSTOM':
            self.custom_name = None
        super().save(*args, **kwargs)

class UserBankProfile(models.Model):
    """Профиль пользователя для хранения банковских данных"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bank_profile')
    team_id = models.CharField(max_length=50, unique=True)  # team200-1, team200-2 и т.д.
    shared_accounts = models.ManyToManyField('self', through='AccountSharing', symmetrical=False, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.team_id})"

class AccountSharing(models.Model):
    """Модель для объединения учетных записей пользователей"""
    SHARING_STATUS = [
        ('PENDING', 'Ожидает подтверждения'),
        ('ACTIVE', 'Активно'),
        ('REJECTED', 'Отклонено'),
        ('EXPIRED', 'Истекло'),
    ]
    
    sharer = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE, related_name='shared_out')
    receiver = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE, related_name='shared_in')
    status = models.CharField(max_length=20, choices=SHARING_STATUS, default='PENDING')
    permissions = models.JSONField(default=list)  # ['ReadAccounts', 'ReadTransactions']
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    token = models.UUIDField(default=uuid.uuid4, unique=True)  # Для подтверждения
    
    class Meta:
        unique_together = ['sharer', 'receiver']
    
    def is_expired(self):
        if self.expires_at:
            return timezone.now() >= self.expires_at
        return False
    
    def clean(self):
        if self.sharer == self.receiver:
            raise ValidationError("Нельзя делиться аккаунтом с самим собой")

class BankToken(models.Model):
    TOKEN_TYPE = [
        ('CLIENT', 'Client Token'),
        ('BANK', 'Bank Token'),
    ]
    
    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE, null=True, blank=True)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    access_token = models.TextField()
    token_type = models.CharField(max_length=50, default='bearer')
    scope = models.CharField(max_length=200, blank=True)  # Разрешения токена
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user_profile', 'bank', 'token_type']
    
    def is_expired(self):
        return timezone.now() >= self.expires_at
    
    def __str__(self):
        user_info = self.user_profile.team_id if self.user_profile else "System"
        return f"{user_info} - {self.bank} Token"

class Consent(models.Model):
    CONSENT_STATUS = [
        ('AWAITING_AUTHORISATION', 'Ожидает авторизации'),
        ('AUTHORISED', 'Авторизовано'),
        ('REJECTED', 'Отклонено'),
        ('REVOKED', 'Отозвано'),
        ('EXPIRED', 'Истекло'),
    ]
    
    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    consent_id = models.CharField(max_length=100, unique=True)
    client_id = models.CharField(max_length=100)  # team200-1 и т.д.
    status = models.CharField(max_length=30, choices=CONSENT_STATUS)
    permissions = models.JSONField(default=list)
    expiration_date_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.consent_id} - {self.get_status_display()}"

class UserAccount(models.Model):
    """Модель для хранения счетов пользователей"""
    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE)
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    account_id = models.CharField(max_length=100)
    account_data = models.JSONField()  # Полные данные счета из API
    last_sync = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user_profile', 'bank', 'account_id']
    
    def __str__(self):
        return f"{self.user_profile.team_id} - {self.account_id}"