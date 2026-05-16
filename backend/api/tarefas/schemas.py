from ninja import Schema
from datetime import datetime


class TarefaIn(Schema):
    titulo: str
    descricao: str | None = None
    concluida: bool = False


class TarefaOut(Schema):
    id: int
    usuario_id: int
    titulo: str
    descricao: str | None
    concluida: bool
    criada_em: datetime