from ninja import NinjaAPI

from tarefas.routes import router as tarefas_router
from usuarios.routes import router as usuarios_router

api = NinjaAPI()

api.add_router("/usuarios/", usuarios_router)
api.add_router("/tarefas/", tarefas_router)