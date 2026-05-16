import jwt
from django.conf import settings
from ninja.security import HttpBearer

from usuarios.models import Usuario


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )

            usuario_id = payload.get("usuario_id")

            if not usuario_id:
                return None

            usuario = Usuario.objects.get(id=usuario_id)

            return usuario

        except jwt.ExpiredSignatureError:
            return None

        except jwt.InvalidTokenError:
            return None

        except Usuario.DoesNotExist:
            return None