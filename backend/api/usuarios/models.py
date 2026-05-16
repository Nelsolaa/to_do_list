from django.contrib.auth.models import AbstractUser

#Abstrair a tabela que o django já cria por padrão de usuários para no projeto não ter duas tabelas usuarios

class Usuario(AbstractUser):
    class Meta:
        db_table = "usuarios"