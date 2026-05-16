from django.db import models
from django.conf import settings


class Tarefa(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tarefas"
    )
    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    concluida = models.BooleanField(default=False)
    criada_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

    class Meta:
        db_table = "tarefas"