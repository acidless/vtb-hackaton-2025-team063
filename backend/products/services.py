from decimal import Decimal
from django.utils import timezone
from banks.clients import BankClientFactory
from banks.models import UserBankProfile, Bank
from accounts.models import Account
from .models import Product, ProductAgreement, ProductApplication

class ProductService:
    """Сервис для работы с продуктами"""
    
    def __init__(self, user_profile):
        self.user_profile = user_profile
    
    def sync_products_from_bank(self, bank_name):
        """Синхронизация продуктов из банка"""
        client = BankClientFactory.get_client(bank_name)
        
        try:
            products_data = client.get_products()
            
            synced_products = []
            for product_data in products_data.get('products', []):
                product = self._update_or_create_product(bank_name, product_data)
                synced_products.append(product)
            
            return synced_products
            
        except Exception as e:
            raise Exception(f"Ошибка синхронизации продуктов из {bank_name}: {str(e)}")
    
    def _update_or_create_product(self, bank_name, product_data):
        """Обновление или создание продукта"""
        bank = Bank.objects.get(name=bank_name)
        
        product, created = Product.objects.update_or_create(
            bank=bank,
            product_id=product_data['product_id'],
            defaults={
                'product_type': product_data.get('product_type', 'ACCOUNT').upper(),
                'name': product_data.get('name', ''),
                'description': product_data.get('description', ''),
                'short_description': product_data.get('short_description', ''),
                'interest_rate': product_data.get('interest_rate'),
                'min_amount': product_data.get('min_amount'),
                'max_amount': product_data.get('max_amount'),
                'term_months': product_data.get('term_months'),
                'currency': product_data.get('currency', 'RUB'),
                'features': product_data.get('features', []),
                'requirements': product_data.get('requirements', {}),
                'documents_required': product_data.get('documents_required', []),
                'status': product_data.get('status', 'ACTIVE').upper(),
                'is_featured': product_data.get('is_featured', False),
                'promotion_end': product_data.get('promotion_end'),
                'raw_data': product_data
            }
        )
        
        return product
    
    def create_application(self, product, application_data):
        """Создание заявки на продукт"""
        try:
            application = ProductApplication.objects.create(
                user_profile=self.user_profile,
                product=product,
                application_id=f"app_{self.user_profile.team_id}_{product.id}_{timezone.now().timestamp()}",
                requested_amount=application_data.get('requested_amount'),
                requested_term=application_data.get('requested_term'),
                purpose=application_data.get('purpose', ''),
                application_data=application_data.get('application_data', {})
            )
            
            return application
            
        except Exception as e:
            raise Exception(f"Ошибка создания заявки: {str(e)}")
    
    def submit_application(self, application):
        """Отправка заявки в банк"""
        client = BankClientFactory.get_client(application.product.bank.name)
        
        try:
            application_data = {
                "product_id": application.product.product_id,
                "client_id": self.user_profile.team_id,
            }
            
            if application.requested_amount:
                application_data["amount"] = str(application.requested_amount)
            if application.requested_term:
                application_data["term_months"] = application.requested_term
            if application.purpose:
                application_data["purpose"] = application.purpose
            
            # Добавляем данные заявки
            application_data.update(application.application_data)
            
            # Отправляем заявку в банк
            result = client.submit_product_application(application_data)
            
            # Обновляем заявку
            application.application_id = result.get('application_id', application.application_id)
            application.status = result.get('status', 'SUBMITTED')
            application.submitted_at = timezone.now()
            application.save()
            
            return application
            
        except Exception as e:
            raise Exception(f"Ошибка отправки заявки: {str(e)}")

class ProductAgreementService:
    """Сервис для работы с договорами продуктов"""
    
    def __init__(self, user_profile):
        self.user_profile = user_profile
    
    def open_agreement(self, product, agreement_data):
        """Открытие договора по продукту"""
        client = BankClientFactory.get_client(product.bank.name)
        
        try:
            # Подготавливаем данные для открытия договора
            api_data = {
                "product_id": product.product_id,
                "client_id": self.user_profile.team_id,
                "amount": str(agreement_data['amount']),
            }
            
            if agreement_data.get('term_months'):
                api_data["term_months"] = agreement_data['term_months']
            if agreement_data.get('source_account_id'):
                api_data["source_account_id"] = agreement_data['source_account_id']
            
            # Открываем договор через API банка
            result = client.open_product_agreement(api_data)
            
            # Создаем запись договора
            agreement = ProductAgreement.objects.create(
                user_profile=self.user_profile,
                product=product,
                agreement_id=result['agreement_id'],
                amount=agreement_data['amount'],
                interest_rate=result.get('interest_rate'),
                term_months=agreement_data.get('term_months'),
                maturity_date=result.get('maturity_date'),
                linked_account=self._get_linked_account(result),
                raw_data=result
            )
            
            return agreement
            
        except Exception as e:
            raise Exception(f"Ошибка открытия договора: {str(e)}")
    
    def _get_linked_account(self, agreement_data):
        """Получение или создание связанного счета"""
        if 'linked_account_id' in agreement_data:
            try:
                return Account.objects.get(account_id=agreement_data['linked_account_id'])
            except Account.DoesNotExist:
                pass
        return None
    
    def close_agreement(self, agreement, close_data):
        """Закрытие договора"""
        client = BankClientFactory.get_client(agreement.product.bank.name)
        
        try:
            api_data = {}
            if close_data.get('repayment_account_id'):
                api_data["repayment_account_id"] = close_data['repayment_account_id']
            if close_data.get('repayment_amount'):
                api_data["repayment_amount"] = str(close_data['repayment_amount'])
            
            result = client.close_product_agreement(
                agreement_id=agreement.agreement_id,
                close_data=api_data
            )
            
            # Обновляем статус договора
            agreement.status = 'CLOSED'
            agreement.closed_date = timezone.now()
            agreement.save()
            
            return agreement
            
        except Exception as e:
            raise Exception(f"Ошибка закрытия договора: {str(e)}")

class ProductRecommendationService:
    """Сервис рекомендаций продуктов"""
    
    def __init__(self, user_profile):
        self.user_profile = user_profile
    
    def get_personalized_offers(self):
        """Получение персональных предложений"""
        # Анализируем профиль пользователя и его поведение
        user_analysis = self._analyze_user_profile()
        
        # Получаем подходящие продукты
        suitable_products = self._find_suitable_products(user_analysis)
        
        # Формируем персональные предложения
        offers = []
        for product in suitable_products:
            offer = self._create_personal_offer(product, user_analysis)
            if offer:
                offers.append(offer)
        
        return offers
    
    def _analyze_user_profile(self):
        """Анализ профиля пользователя"""
        from accounts.models import Transaction, Account
        
        # Базовая информация
        analysis = {
            'total_balance': 0,
            'average_monthly_income': 0,
            'average_monthly_spending': 0,
            'savings_ratio': 0,
            'risk_tolerance': 'LOW',  # LOW, MEDIUM, HIGH
            'product_preferences': [],
        }
        
        # Анализ счетов и транзакций
        accounts = Account.objects.filter(user_profile=self.user_profile, status='ACTIVE')
        for account in accounts:
            analysis['total_balance'] += float(account.balance)
        
        # Здесь можно добавить более сложную логику анализа
        # ...
        
        return analysis
    
    def _find_suitable_products(self, user_analysis):
        """Поиск подходящих продуктов"""
        products = Product.objects.filter(status='ACTIVE')
        
        suitable_products = []
        for product in products:
            if self._is_product_suitable(product, user_analysis):
                suitable_products.append(product)
        
        return suitable_products
    
    def _is_product_suitable(self, product, user_analysis):
        """Проверка подходит ли продукт пользователю"""
        # Простая логика подбора
        if product.min_amount and user_analysis['total_balance'] < float(product.min_amount):
            return False
        
        # Дополнительные проверки в зависимости от типа продукта
        if product.product_type == 'DEPOSIT':
            return user_analysis['savings_ratio'] > 0.1  # Минимум 10% сбережений
        
        elif product.product_type == 'LOAN':
            return user_analysis['average_monthly_income'] > 50000  # Достаточный доход
        
        return True
    
    def _create_personal_offer(self, product, user_analysis):
        """Создание персонального предложения"""
        # Расчет персональной ставки/условий
        personalized_rate = self._calculate_personalized_rate(product, user_analysis)
        personalized_amount = self._calculate_personalized_amount(product, user_analysis)
        
        if personalized_rate and personalized_amount:
            return {
                'product': product,
                'personalized_rate': personalized_rate,
                'personalized_amount': personalized_amount,
                'reason': self._get_offer_reason(product, user_analysis),
                'expiration_date': timezone.now() + timezone.timedelta(days=30)
            }
        
        return None
    
    def _calculate_personalized_rate(self, product, user_analysis):
        """Расчет персональной ставки"""
        base_rate = product.interest_rate
        if not base_rate:
            return None
        
        # Простая логика корректировки ставки
        if user_analysis['total_balance'] > 1000000:  # VIP клиент
            return base_rate * Decimal('0.9')  # Скидка 10%
        
        return base_rate
    
    def _calculate_personalized_amount(self, product, user_analysis):
        """Расчет персональной суммы"""
        if product.max_amount:
            return min(float(product.max_amount), user_analysis['total_balance'] * 0.8)
        return user_analysis['total_balance'] * 0.8
    
    def _get_offer_reason(self, product, user_analysis):
        """Формирование обоснования предложения"""
        reasons = {
            'DEPOSIT': 'На основе ваших сберегательных привычек',
            'LOAN': 'Идеально подходит для ваших финансовых целей',
            'CARD': 'Соответствует вашим расходным паттернам',
        }
        return reasons.get(product.product_type, 'Персональное предложение')