from decimal import Decimal
from django.utils import timezone
from banks.clients import BankClientFactory
from banks.models import UserBankProfile, Bank
from .models import Payment, PaymentConsent, PaymentLimit

class PaymentService:
    """Сервис для работы с платежами"""
    
    def __init__(self, user_profile):
        self.user_profile = user_profile
    
    def create_payment(self, payment_data):
        """Создание платежа"""
        bank_name = payment_data['bank_name']
        client = BankClientFactory.get_client(bank_name)
        
        # Проверяем лимиты
        limit_check = self._check_payment_limits(payment_data['amount'])
        if not limit_check['allowed']:
            raise Exception(limit_check['reason'])
        
        try:
            # Подготавливаем данные для API банка
            api_payment_data = {
                "data": {
                    "initiation": {
                        "instructedAmount": {
                            "amount": str(payment_data['amount']),
                            "currency": payment_data.get('currency', 'RUB')
                        },
                        "debtorAccount": {
                            "schemeName": "RU.CBR.PAN",
                            "identification": payment_data['debtor_account']
                        },
                        "creditorAccount": {
                            "schemeName": "RU.CBR.PAN",
                            "identification": payment_data['creditor_account']
                        },
                        "creditorName": payment_data['creditor_name']
                    }
                }
            }
            
            # Добавляем банк получателя для межбанковских переводов
            if payment_data.get('creditor_bank_code'):
                api_payment_data['data']['initiation']['creditorAccount']['bank_code'] = \
                    payment_data['creditor_bank_code']
            
            if payment_data.get('description'):
                api_payment_data['data']['initiation']['remittanceInformation'] = {
                    "unstructured": payment_data['description']
                }
            
            # Выполняем платеж
            result = client.create_payment(
                payment_data=api_payment_data,
                client_id=self.user_profile.team_id,
                consent_id=payment_data.get('consent_id')
            )
            
            # Сохраняем платеж в БД
            bank = Bank.objects.get(name=bank_name)
            
            # Определяем банки для дебета и кредита
            debtor_bank = bank
            creditor_bank = Bank.objects.filter(name=payment_data.get('creditor_bank_code')).first()
            
            payment = Payment.objects.create(
                user_profile=self.user_profile,
                bank=bank,
                payment_id=result['data']['paymentId'],
                consent_id=payment_data.get('consent_id', ''),
                payment_type='EXTERNAL' if creditor_bank else 'INTERNAL',
                amount=payment_data['amount'],
                currency=payment_data.get('currency', 'RUB'),
                debtor_account=payment_data['debtor_account'],
                debtor_bank=debtor_bank,
                creditor_account=payment_data['creditor_account'],
                creditor_name=payment_data['creditor_name'],
                creditor_bank=creditor_bank,
                description=payment_data.get('description', ''),
                reference=payment_data.get('reference', ''),
                status=result['data']['status'],
                raw_data=result
            )
            
            # Обновляем использованные лимиты
            self._update_payment_limits(payment_data['amount'])
            
            return payment
            
        except Exception as e:
            raise Exception(f"Ошибка создания платежа: {str(e)}")
    
    def _check_payment_limits(self, amount):
        """Проверка лимитов на платежи"""
        limit, created = PaymentLimit.objects.get_or_create(user_profile=self.user_profile)
        limit.reset_if_needed()
        
        if amount > limit.per_transaction_limit:
            return {
                'allowed': False,
                'reason': f'Превышен лимит на одну операцию: {limit.per_transaction_limit}'
            }
        
        if (limit.daily_used + amount) > limit.daily_limit:
            return {
                'allowed': False,
                'reason': f'Превышен дневной лимит: {limit.daily_limit}'
            }
        
        if (limit.weekly_used + amount) > limit.weekly_limit:
            return {
                'allowed': False,
                'reason': f'Превышен недельный лимит: {limit.weekly_limit}'
            }
        
        if (limit.monthly_used + amount) > limit.monthly_limit:
            return {
                'allowed': False,
                'reason': f'Превышен месячный лимит: {limit.monthly_limit}'
            }
        
        return {'allowed': True}
    
    def _update_payment_limits(self, amount):
        """Обновление использованных лимитов"""
        limit = PaymentLimit.objects.get(user_profile=self.user_profile)
        limit.daily_used += Decimal(amount)
        limit.weekly_used += Decimal(amount)
        limit.monthly_used += Decimal(amount)
        limit.save()
    
    def get_payment_status(self, payment):
        """Получение статуса платежа из банка"""
        client = BankClientFactory.get_client(payment.bank.name)
        
        try:
            status_data = client.get_payment_status(payment.payment_id)
            
            # Обновляем статус платежа
            payment.status = status_data['data']['status']
            if payment.status == 'COMPLETED' and not payment.executed_at:
                payment.executed_at = timezone.now()
            payment.raw_data = status_data
            payment.save()
            
            return payment
            
        except Exception as e:
            raise Exception(f"Ошибка получения статуса платежа: {str(e)}")

class PaymentConsentService:
    """Сервис для работы с согласиями на платежи"""
    
    def __init__(self, user_profile):
        self.user_profile = user_profile
    
    def create_consent(self, consent_data):
        """Создание согласия на платеж"""
        bank_name = consent_data['bank_name']
        client = BankClientFactory.get_client(bank_name)
        
        try:
            # Подготавливаем данные для API банка
            api_consent_data = {
                "requesting_bank": self.user_profile.team_id.split('-')[0],
                "client_id": self.user_profile.team_id,
                "consent_type": consent_data['consent_type'],
                "debtor_account": consent_data['debtor_account'],
            }
            
            # Добавляем дополнительные параметры в зависимости от типа согласия
            if consent_data['consent_type'] == 'SINGLE_USE':
                api_consent_data['amount'] = str(consent_data['amount'])
            elif consent_data['consent_type'] == 'MULTI_USE':
                if consent_data.get('max_amount_per_payment'):
                    api_consent_data['max_amount_per_payment'] = str(consent_data['max_amount_per_payment'])
                if consent_data.get('max_total_amount'):
                    api_consent_data['max_total_amount'] = str(consent_data['max_total_amount'])
                if consent_data.get('max_uses'):
                    api_consent_data['max_uses'] = consent_data['max_uses']
            
            if consent_data.get('valid_until'):
                api_consent_data['valid_until'] = consent_data['valid_until'].isoformat()
            
            # Создаем согласие через API банка
            result = client.create_payment_consent(api_consent_data)
            
            # Сохраняем согласие в БД
            bank = Bank.objects.get(name=bank_name)
            consent = PaymentConsent.objects.create(
                user_profile=self.user_profile,
                bank=bank,
                consent_id=result['consent_id'],
                consent_type=consent_data['consent_type'],
                status=result['status'],
                debtor_account=consent_data['debtor_account'],
                max_amount_per_payment=consent_data.get('max_amount_per_payment'),
                max_total_amount=consent_data.get('max_total_amount'),
                max_uses=consent_data.get('max_uses'),
                valid_until=consent_data.get('valid_until'),
                raw_data=result
            )
            
            return consent
            
        except Exception as e:
            raise Exception(f"Ошибка создания согласия: {str(e)}")