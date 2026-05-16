from django.shortcuts import get_object_or_404

from .models import Tarefa
from .schemas import TarefaIn


def listar_tarefas(usuario):
    return Tarefa.objects.filter(usuario=usuario)


def buscar_tarefa(tarefa_id: int, usuario):
    return get_object_or_404(Tarefa, id=tarefa_id, usuario=usuario)


def criar_tarefa(dados: TarefaIn, usuario):
    tarefa = Tarefa.objects.create(
        usuario=usuario,
        titulo=dados.titulo,
        descricao=dados.descricao,
        concluida=dados.concluida,
    )

    return tarefa


def atualizar_tarefa(tarefa_id: int, dados: TarefaIn, usuario):
    tarefa = get_object_or_404(Tarefa, id=tarefa_id, usuario=usuario)

    tarefa.titulo = dados.titulo
    tarefa.descricao = dados.descricao
    tarefa.concluida = dados.concluida

    tarefa.save()

    return tarefa


def deletar_tarefa(tarefa_id: int, usuario):
    tarefa = get_object_or_404(Tarefa, id=tarefa_id, usuario=usuario)
    tarefa.delete()

    return {"mensagem": "Tarefa deletada com sucesso"}