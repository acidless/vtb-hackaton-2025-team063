from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import BankToken

class BankTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header[7:]  # Remove 'Bearer '
        
        try:
            bank_token = BankToken.objects.get(
                access_token=token, 
                expires_at__gt=timezone.now()
            )
            return (bank_token.bank, None)  # bank как user объект
        except BankToken.DoesNotExist:
            raise AuthenticationFailed('Invalid or expired token')