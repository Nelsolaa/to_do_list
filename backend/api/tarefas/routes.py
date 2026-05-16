from ninja import Router

from api.auth import JWTAuth
from .schemas import TarefaIn, TarefaOut
from .services import (
    listar_tarefas,
    buscar_tarefa,
    criar_tarefa,
    atualizar_tarefa,
    deletar_tarefa,
)

router = Router(tags=["Tarefas"], auth=JWTAuth())


@router.get("/", response=list[TarefaOut])
def get_tarefas(request):
    return listar_tarefas(request.auth)


@router.get("/{tarefa_id}", response=TarefaOut)
def get_tarefa(request, tarefa_id: int):
    return buscar_tarefa(tarefa_id, request.auth)


@router.post("/", response=TarefaOut)
def post_tarefa(request, dados: TarefaIn):
    return criar_tarefa(dados, request.auth)


@router.put("/{tarefa_id}", response=TarefaOut)
def put_tarefa(request, tarefa_id: int, dados: TarefaIn):
    return atualizar_tarefa(tarefa_id, dados, request.auth)


@router.delete("/{tarefa_id}")
def delete_tarefa(request, tarefa_id: int):
    return deletar_tarefa(tarefa_id, request.auth)