from datetime import timedelta

import jwt
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Usuario
from .schemas import UsuarioIn, LoginIn


def gerar_token(usuario: Usuario):
    agora = timezone.now()

    payload = {
        "usuario_id": usuario.id,
        "username": usuario.username,
        "iat": int(agora.timestamp()),
        "exp": int(
            (agora + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp()
        ),
    }

    token = jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return token


def listar_usuarios():
    return Usuario.objects.all()


def buscar_usuario(usuario_id: int):
    return get_object_or_404(Usuario, id=usuario_id)


def criar_usuario(dados: UsuarioIn):
    usuario_existente = Usuario.objects.filter(username=dados.username).first()

    if usuario_existente:
        raise ValueError("Esse username já está em uso.")

    usuario = Usuario.objects.create(
        username=dados.username,
        password=make_password(dados.password),
    )

    return usuario


def login_usuario(dados: LoginIn):
    usuario = Usuario.objects.filter(username=dados.username).first()

    if not usuario:
        return None

    senha_valida = check_password(dados.password, usuario.password)

    if not senha_valida:
        return None

    token = gerar_token(usuario)

    return {
        "access_token": token,
        "token_type": "Bearer",
    }


def atualizar_usuario(usuario_id: int, dados: UsuarioIn):
    usuario = get_object_or_404(Usuario, id=usuario_id)

    usuario.username = dados.username
    usuario.password = make_password(dados.password)

    usuario.save()

    return usuario


def deletar_usuario(usuario_id: int):
    usuario = get_object_or_404(Usuario, id=usuario_id)
    usuario.delete()

    return {"mensagem": "Usuário deletado com sucesso"}