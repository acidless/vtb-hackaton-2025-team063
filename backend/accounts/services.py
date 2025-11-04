from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction
from banks.clients import BankClientFactory
from banks.models import UserBankProfile, Consent
from .models import Account, Transaction, Balance, AccountSyncLog


class AccountService:
    """Сервис для работы со счетами"""

    def __init__(self, user_profile):
        self.user_profile = user_profile

    def sync_accounts_from_bank(self, bank_name, consent_id=None):
        """Синхронизация счетов из банка"""
        client = BankClientFactory.get_client(bank_name)

        try:
            # Получаем счета из API банка
            accounts_data = client.get_accounts(
                client_id=self.user_profile.team_id,
                consent_id=consent_id,
                requesting_bank=self.user_profile.team_id.split('-')[0]  # team200 из team200-1
            )

            synced_accounts = []
            for account_data in accounts_data.get('accounts', []):
                account = self._update_or_create_account(bank_name, account_data)
                synced_accounts.append(account)

            return synced_accounts

        except Exception as e:
            raise Exception(f"Ошибка синхронизации счетов из {bank_name}: {str(e)}")

    def _update_or_create_account(self, bank_name, account_data):
        """Обновление или создание счета"""
        from banks.models import Bank

        bank = Bank.objects.get(name=bank_name)

        account, created = Account.objects.update_or_create(
            user_profile=self.user_profile,
            bank=bank,
            account_id=account_data['account_id'],
            defaults={
                'account_type': account_data.get('account_type', 'CHECKING').upper(),
                'currency': account_data.get('currency', 'RUB'),
                'balance': account_data.get('balance', 0),
                'available_balance': account_data.get('available_balance', 0),
                'status': account_data.get('status', 'ACTIVE').upper(),
                'nickname': account_data.get('nickname', ''),
                'iban': account_data.get('iban', ''),
                'raw_data': account_data
            }
        )

        # Сохраняем балансы
        if 'balances' in account_data:
            for balance_data in account_data['balances']:
                Balance.objects.update_or_create(
                    account=account,
                    balance_type=balance_data.get('balance_type', 'CLOSING_BOOKED'),
                    defaults={
                        'amount': balance_data.get('amount', 0),
                        'currency': balance_data.get('currency', 'RUB'),
                        'credit_limit': balance_data.get('credit_limit'),
                        'credit_used': balance_data.get('credit_used'),
                    }
                )

        return account

    def get_account_transactions(self, account, page=1, limit=50, from_date=None, to_date=None):
        """Получение транзакций счета"""
        client = BankClientFactory.get_client(account.bank.name)

        try:
            transactions_data = client.get_account_transactions(
                account_id=account.account_id,
                page=page,
                limit=limit,
                from_date=from_date,
                to_date=to_date,
                client_id=self.user_profile.team_id,
                consent_id=self._get_consent_id(account.bank),
                requesting_bank=self.user_profile.team_id.split('-')[0]
            )

            return self._process_transactions(account, transactions_data)

        except Exception as e:
            raise Exception(f"Ошибка получения транзакций: {str(e)}")

    def _process_transactions(self, account, transactions_data):
        """Обработка и сохранение транзакций"""
        transactions = []
        for tx_data in transactions_data.get('transactions', []):
            transaction, created = Transaction.objects.update_or_create(
                account=account,
                transaction_id=tx_data['transaction_id'],
                defaults={
                    'bank_transaction_id': tx_data.get('bank_transaction_id', ''),
                    'amount': tx_data.get('amount', 0),
                    'currency': tx_data.get('currency', 'RUB'),
                    'type': tx_data.get('type', 'DEBIT').upper(),
                    'status': tx_data.get('status', 'BOOKED').upper(),
                    'description': tx_data.get('description', ''),
                    'merchant_name': tx_data.get('merchant_name', ''),
                    'merchant_account': tx_data.get('merchant_account', ''),
                    'booking_date': tx_data.get('booking_date'),
                    'value_date': tx_data.get('value_date'),
                    'category': tx_data.get('category', ''),
                    'transaction_code': tx_data.get('transaction_code', ''),
                    'reference': tx_data.get('reference', ''),
                    'raw_data': tx_data
                }
            )
            transactions.append(transaction)

        return transactions

    def _get_consent_id(self, bank):
        """Получение consent_id для банка"""
        consent = Consent.objects.filter(
            user_profile=self.user_profile,
            bank=bank,
            status='AUTHORISED'
        ).first()

        return consent.consent_id if consent else None

    def create_account(self, bank_name, account_type, nickname='', initial_balance=0):
        """Создание нового счета"""
        client = BankClientFactory.get_client(bank_name)

        try:
            account_data = {
                'account_type': account_type,
                'initial_balance': float(initial_balance)
            }
            if nickname:
                account_data['nickname'] = nickname

            result = client.create_account(account_data, client_id=self.user_profile.team_id)

            # Сохраняем созданный счет
            return self._update_or_create_account(bank_name, result)

        except Exception as e:
            raise Exception(f"Ошибка создания счета: {str(e)}")

    def close_account(self, account, action, destination_account_id=None):
        """Закрытие счета"""
        client = BankClientFactory.get_client(account.bank.name)

        try:
            close_data = {
                'action': action
            }
            if destination_account_id:
                close_data['destination_account_id'] = destination_account_id

            result = client.close_account(
                account_id=account.account_id,
                close_data=close_data,
                client_id=self.user_profile.team_id
            )

            # Обновляем статус счета
            account.status = 'CLOSED'
            account.closed_date = timezone.now()
            account.save()

            return result

        except Exception as e:
            raise Exception(f"Ошибка закрытия счета: {str(e)}")


class TransactionService:
    """Сервис для работы с транзакциями"""

    @staticmethod
    def get_transaction_categories():
        """Получение категорий транзакций"""
        return {
            'FOOD': 'Еда и рестораны',
            'TRANSPORT': 'Транспорт',
            'UTILITIES': 'Коммунальные услуги',
            'SHOPPING': 'Покупки',
            'ENTERTAINMENT': 'Развлечения',
            'HEALTHCARE': 'Здоровье',
            'TRANSFER': 'Переводы',
            'SALARY': 'Зарплата',
            'OTHER': 'Прочее'
        }

    @staticmethod
    def analyze_spending_patterns(user_profile, days=30):
        """Анализ паттернов расходов"""
        from_date = timezone.now() - timedelta(days=days)

        transactions = Transaction.objects.filter(
            account__user_profile=user_profile,
            type='DEBIT',
            status='BOOKED',
            booking_date__gte=from_date
        )

        # Группировка по категориям
        spending_by_category = {}
        for tx in transactions:
            category = tx.category or 'OTHER'
            if category not in spending_by_category:
                spending_by_category[category] = 0
            spending_by_category[category] += float(tx.amount)

        return spending_by_category
