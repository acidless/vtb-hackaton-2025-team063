import requests
import jwt
import json
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
from .models import Bank, BankToken, Consent

class BaseBankClient:
    def __init__(self, bank_name):
        self.bank_name = bank_name
        self.config = settings.BANK_API_CONFIG[bank_name]
        self.base_url = self.config['base_url']
        self.session = requests.Session()
    
    def _get_token(self):
        """Получение токена банка (кэширование в БД)"""
        try:
            bank = Bank.objects.get(name=self.bank_name)
            token_obj = BankToken.objects.filter(
                bank=bank, 
                expires_at__gt=timezone.now()
            ).first()
            
            if token_obj:
                return token_obj.access_token
            
            # Получение нового токена
            token_data = self._request_token()
            expires_at = timezone.now() + timedelta(seconds=token_data['expires_in'])
            
            token_obj = BankToken.objects.create(
                bank=bank,
                access_token=token_data['access_token'],
                token_type=token_data['token_type'],
                expires_at=expires_at
            )
            return token_obj.access_token
            
        except Bank.DoesNotExist:
            raise Exception(f"Bank {self.bank_name} not configured")
    
    def _request_token(self):
        """Запрос токена у банка"""
        url = f"{self.base_url}/auth/bank-token"
        params = {
            'client_id': self.config['client_id'],
            'client_secret': self.config['client_secret']
        }
        
        response = self.session.post(url, params=params)
        response.raise_for_status()
        return response.json()
    
    def _make_request(self, method, endpoint, **kwargs):
        """Базовый метод для выполнения запросов"""
        token = self._get_token()
        url = f"{self.base_url}{endpoint}"
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Добавляем заголовки для межбанковых запросов
        if 'requesting_bank' in kwargs:
            headers['X-Requesting-Bank'] = kwargs.pop('requesting_bank')
        if 'consent_id' in kwargs:
            headers['X-Consent-Id'] = kwargs.pop('consent_id')
        
        headers.update(kwargs.pop('headers', {}))
        
        response = self.session.request(method, url, headers=headers, **kwargs)
        response.raise_for_status()
        return response.json()

class VBankClient(BaseBankClient):
    def __init__(self):
        super().__init__('VBANK')
    
    def get_accounts(self, client_id=None, consent_id=None, requesting_bank=None):
        """Получение списка счетов"""
        params = {}
        if client_id:
            params['client_id'] = client_id
            
        return self._make_request(
            'GET', '/accounts',
            params=params,
            consent_id=consent_id,
            requesting_bank=requesting_bank
        )
    
    def get_account_details(self, account_id, consent_id=None, requesting_bank=None):
        """Получение деталей счета"""
        return self._make_request(
            'GET', f'/accounts/{account_id}',
            consent_id=consent_id,
            requesting_bank=requesting_bank
        )
    
    def get_account_balance(self, account_id, consent_id=None, requesting_bank=None):
        """Получение баланса счета"""
        return self._make_request(
            'GET', f'/accounts/{account_id}/balances',
            consent_id=consent_id,
            requesting_bank=requesting_bank
        )
    
    def get_account_transactions(self, account_id, page=1, limit=50, 
                               from_date=None, to_date=None, 
                               consent_id=None, requesting_bank=None):
        """Получение транзакций счета"""
        params = {'page': page, 'limit': limit}
        if from_date:
            params['from_booking_date_time'] = from_date
        if to_date:
            params['to_booking_date_time'] = to_date
            
        return self._make_request(
            'GET', f'/accounts/{account_id}/transactions',
            params=params,
            consent_id=consent_id,
            requesting_bank=requesting_bank
        )
    
    def create_consent(self, client_id, permissions, reason, requesting_bank):
        """Создание согласия"""
        data = {
            "client_id": client_id,
            "permissions": permissions,
            "reason": reason,
            "requesting_bank": requesting_bank,
            "requesting_bank_name": "Open Banking App"
        }
        
        return self._make_request(
            'POST', '/account-consents/request',
            json=data,
            requesting_bank=requesting_bank
        )
    
    def create_payment(self, payment_data, client_id=None, consent_id=None):
        """Создание платежа"""
        params = {}
        if client_id:
            params['client_id'] = client_id
            
        return self._make_request(
            'POST', '/payments',
            json=payment_data,
            params=params,
            consent_id=consent_id
        )

class BankClientFactory:
    @staticmethod
    def get_client(bank_name):
        clients = {
            'VBANK': VBankClient,
            'ABANK': VBankClient,  # Аналогичная реализация
            'SBANK': VBankClient,  # Аналогичная реализация
        }
        
        client_class = clients.get(bank_name)
        if not client_class:
            raise ValueError(f"Unsupported bank: {bank_name}")
        
        return client_class()