from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from banks.models import UserBankProfile, Bank
from django.utils import timezone

class Product(models.Model):
    PRODUCT_TYPES = [
        ('DEPOSIT', 'Вклад'),
        ('LOAN', 'Кредит'),
        ('CARD', 'Карта'),
        ('ACCOUNT', 'Счет'),
        ('INVESTMENT', 'Инвестиционный продукт'),
        ('INSURANCE', 'Страхование'),
    ]
    
    PRODUCT_STATUS = [
        ('ACTIVE', 'Активный'),
        ('INACTIVE', 'Неактивный'),
        ('COMING_SOON', 'Скоро будет'),
        ('ARCHIVED', 'В архиве'),
    ]
    
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, db_index=True)
    product_id = models.CharField(max_length=100, db_index=True)  # ID из банковского API
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    
    # Основные параметры
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    min_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    max_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    term_months = models.IntegerField(null=True, blank=True)
    currency = models.CharField(max_length=3, default='RUB')
    
    # Дополнительные характеристики
    features = ArrayField(
        models.CharField(max_length=200),
        default=list,
        blank=True
    )
    requirements = JSONField(default=dict)  # Требования к клиенту
    documents_required = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    
    status = models.CharField(max_length=20, choices=PRODUCT_STATUS, default='ACTIVE')
    is_featured = models.BooleanField(default=False)
    promotion_end = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    raw_data = JSONField(default=dict)
    
    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['bank', 'product_type']),
            models.Index(fields=['product_type', 'status']),
            models.Index(fields=['is_featured', 'status']),
            models.Index(fields=['promotion_end']),
        ]
        unique_together = ['bank', 'product_id']
    
    def __str__(self):
        return f"{self.bank.name} - {self.name}"

class ProductAgreement(models.Model):
    AGREEMENT_STATUS = [
        ('ACTIVE', 'Активный'),
        ('CLOSED', 'Закрыт'),
        ('PENDING', 'Ожидает активации'),
        ('SUSPENDED', 'Приостановлен'),
        ('EXPIRED', 'Истек'),
    ]
    
    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_index=True)
    agreement_id = models.CharField(max_length=100, db_index=True)  # ID из банковского API
    status = models.CharField(max_length=20, choices=AGREEMENT_STATUS, default='ACTIVE')
    
    # Параметры договора
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    term_months = models.IntegerField(null=True, blank=True)
    opened_date = models.DateTimeField(default=timezone.now)
    closed_date = models.DateTimeField(null=True, blank=True)
    maturity_date = models.DateTimeField(null=True, blank=True)
    
    # Связанный счет (для депозитов, кредитов)
    linked_account = models.ForeignKey(
        'accounts.Account', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        db_index=True
    )
    
    # Текущие показатели
    current_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    interest_accrued = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    next_payment_date = models.DateTimeField(null=True, blank=True)
    next_payment_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    raw_data = JSONField(default=dict)
    
    class Meta:
        db_table = 'product_agreements'
        indexes = [
            models.Index(fields=['user_profile', 'status']),
            models.Index(fields=['product', 'status']),
            models.Index(fields=['opened_date']),
            models.Index(fields=['maturity_date']),
            models.Index(fields=['next_payment_date']),
        ]
    
    def __str__(self):
        return f"{self.user_profile.team_id} - {self.product.name}"

class ProductApplication(models.Model):
    APPLICATION_STATUS = [
        ('DRAFT', 'Черновик'),
        ('SUBMITTED', 'Подана'),
        ('UNDER_REVIEW', 'На рассмотрении'),
        ('APPROVED', 'Одобрена'),
        ('REJECTED', 'Отклонена'),
        ('CANCELLED', 'Отменена'),
        ('ADDITIONAL_INFO_REQUIRED', 'Требуется дополнительная информация'),
    ]
    
    user_profile = models.ForeignKey(UserBankProfile, on_delete=models.CASCADE, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, db_index=True)
    application_id = models.CharField(max_length=100, db_index=True)
    status = models.CharField(max_length=30, choices=APPLICATION_STATUS, default='DRAFT')
    
    # Данные заявки
    requested_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    requested_term = models.IntegerField(null=True, blank=True)
    purpose = models.TextField(blank=True)
    
    # Персональные данные (могут отличаться от профиля)
    application_data = JSONField(default=dict)
    
    # Результат рассмотрения
    approved_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    approved_term = models.IntegerField(null=True, blank=True)
    approved_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Даты
    submitted_at = models.DateTimeField(null=True, blank=True)
    decided_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'product_applications'
        indexes = [
            models.Index(fields=['user_profile', 'status']),
            models.Index(fields=['product', 'status']),
            models.Index(fields=['submitted_at']),
        ]
    
    def __str__(self):
        return f"{self.user_profile.team_id} - {self.product.name} - {self.get_status_display()}"

class ProductCategory(models.Model):
    """Категории продуктов для навигации"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Название иконки
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'product_categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name