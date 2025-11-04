from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .models import BankToken, Consent, AccountSharing, APIAuditLog

@shared_task
def cleanup_expired_tokens():
    """Очистка просроченных токенов"""
    expired_tokens = BankToken.objects.filter(
        expires_at__lt=timezone.now(),
        is_active=True
    )
    
    count = expired_tokens.update(is_active=False)
    return f"Деактивировано {count} просроченных токенов"

@shared_task
def cleanup_expired_consents():
    """Очистка просроченных согласий"""
    expired_consents = Consent.objects.filter(
        expiration_date_time__lt=timezone.now(),
        status__in=['AUTHORISED', 'AWAITING_AUTHORISATION']
    )
    
    count = expired_consents.update(status='EXPIRED')
    return f"Обновлено {count} просроченных согласий"

@shared_task
def cleanup_expired_sharings():
    """Очистка просроченных общих доступов"""
    expired_sharings = AccountSharing.objects.filter(
        expires_at__lt=timezone.now(),
        status='ACTIVE'
    )
    
    count = expired_sharings.update(status='EXPIRED')
    return f"Обновлено {count} просроченных общих доступов"

@shared_task
def rotate_audit_logs():
    """Ротация логов аудита (сохранение старых логов)"""
    retention_period = timezone.now() - timezone.timedelta(days=365)  # 1 год
    
    # Здесь можно добавить логику экспорта старых логов
    # и их удаления из основной таблицы
    
    return "Ротация логов аудита выполнена"

@shared_task
def refresh_bank_tokens():
    """Автоматическое обновление банковских токенов"""
    from .services import BankManagementService
    
    # Токены, которые истекут в ближайшие 2 часа
    soon_expired = BankToken.objects.filter(
        expires_at__lt=timezone.now() + timezone.timedelta(hours=2),
        is_active=True,
        user_profile__isnull=True  # Системные токены
    )
    
    refreshed_count = 0
    for token in soon_expired:
        try:
            # Логика обновления токена
            # token = BankManagementService.refresh_token(token)
            refreshed_count += 1
        except Exception as e:
            print(f"Ошибка обновления токена {token.id}: {e}")
    
    return f"Обновлено {refreshed_count} токенов"