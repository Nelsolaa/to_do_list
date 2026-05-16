from ninja import Router
from ninja.errors import HttpError

from .schemas import UsuarioIn, UsuarioOut, LoginIn, TokenOut
from .services import (
    listar_usuarios,
    buscar_usuario,
    criar_usuario,
    login_usuario,
    atualizar_usuario,
    deletar_usuario,
)

router = Router(tags=["Usuários"])


@router.get("/", response=list[UsuarioOut])
def get_usuarios(request):
    return listar_usuarios()

@router.post("/login", response=TokenOut)
def login(request, dados: LoginIn):
    resultado = login_usuario(dados)

    if resultado is None:
        raise HttpError(401, "Usuário ou senha inválidos.")

    return resultado

@router.get("/{usuario_id}", response=UsuarioOut)
def get_usuario(request, usuario_id: int):
    return buscar_usuario(usuario_id)


@router.post("/", response=UsuarioOut)
def post_usuario(request, dados: UsuarioIn):
    try:
        return criar_usuario(dados)
    except ValueError as erro:
        raise HttpError(400, str(erro))





@router.put("/{usuario_id}", response=UsuarioOut)
def put_usuario(request, usuario_id: int, dados: UsuarioIn):
    return atualizar_usuario(usuario_id, dados)


@router.delete("/{usuario_id}")
def delete_usuario(request, usuario_id: int):
    return deletar_usuario(usuario_id)