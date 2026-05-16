# Snoopy To-Do List

Aplicação full stack de lista de tarefas com tema do Snoopy, autenticação JWT, frontend em React + TypeScript + Vite e backend em Django 6 + Django Ninja.

O projeto é dividido em duas partes principais:

- `frontend/todolist`: interface web, telas de login/cadastro, dashboard de tarefas, componentes visuais e integração com API.
- `backend/api`: API RESTful, autenticação, usuários, tarefas, banco PostgreSQL e documentação Swagger.

## Visão Geral
<img width="1906" height="944" alt="image" src="https://github.com/user-attachments/assets/19bc959a-a1d7-45f8-8620-94affc364aaa" />
URL:https://to-do-list-phi-green-35.vercel.app/

O sistema permite que um usuário crie conta, faça login e gerencie suas próprias tarefas. Cada tarefa pertence ao usuário autenticado, e as rotas de tarefas são protegidas por JWT.

No frontend, a experiência visual segue uma temática do Snoopy:

- Login e cadastro com card giratório.
- Home com lista de tarefas.
- GIF do Snoopy reagindo ao progresso.
- Relógio temático.
- Barra de progresso.
- Background ilustrado.
- Confirmação antes de apagar dados.
- Filtro de tarefas por nome.
- Responsividade para telas menores.

No backend, a API expõe endpoints para:

- Criar, listar, buscar, atualizar e deletar usuários.
- Fazer login e gerar token JWT.
- Criar, listar, buscar, atualizar e deletar tarefas do usuário autenticado.

## Stack

### Frontend

| Tecnologia | Uso |
|---|---|
| React 19 | Interface e componentes |
| TypeScript | Tipagem da aplicação |
| Vite | Dev server e build |
| React Router | Rotas `/login` e `/home` |
| CSS modular por pasta | Estilos por componente/página |
| Fetch API | Comunicação com backend |
| LocalStorage | Armazenamento do token JWT |

### Backend

| Tecnologia | Uso |
|---|---|
| Python 3 | Linguagem do backend |
| Django 6.0.5 | Framework web |
| Django Ninja | API REST, schemas e Swagger |
| PyJWT | Geração e validação de JWT |
| PostgreSQL | Banco relacional |
| Neon | Hospedagem PostgreSQL em nuvem |
| dj-database-url | Parse da `DATABASE_URL` |
| python-dotenv | Carregamento de `.env` |
| django-cors-headers | CORS para frontend separado |
| gunicorn | Execução em produção |

## Estrutura do Projeto

Estrutura simplificada:

```txt
to_do_list/
├── backend/
│   └── api/
│       ├── manage.py
│       ├── requirements.txt
│       ├── Procfile
│       ├── .env
│       ├── .env.example
│       │
│       ├── api/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── routes.py
│       │   ├── auth.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       │
│       ├── usuarios/
│       │   ├── models.py
│       │   ├── schemas.py
│       │   ├── routes.py
│       │   ├── services.py
│       │   └── migrations/
│       │
│       └── tarefas/
│           ├── models.py
│           ├── schemas.py
│           ├── routes.py
│           ├── services.py
│           └── migrations/
│
└── frontend/
    └── todolist/
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        ├── api_documentation.md
        ├── todolist.md
        ├── README.md
        │
        ├── public/
        │
        └── src/
            ├── App.tsx
            ├── App.css
            ├── main.tsx
            ├── functions/
            ├── components/
            ├── pages/
            └── images/
```

## Frontend em Detalhes

O frontend fica em:

```txt
frontend/todolist
```

Ele é uma aplicação Vite com React e TypeScript. A entrada principal é:

```txt
src/main.tsx
```

O roteamento fica em:

```txt
src/App.tsx
```

Rotas atuais:

| Rota | Componente | Função |
|---|---|---|
| `/` | `Navigate` | Redireciona para `/login` |
| `/login` | `pages/login` | Login e cadastro |
| `/home` | `pages/home` | Dashboard de tarefas |

### Padrão de Pastas

O projeto segue o padrão de um componente por pasta:

```txt
components/nomeDoComponente/
├── index.tsx
└── index.css
```

Para componentes específicos da Home:

```txt
pages/home/components/nomeDoComponente/
├── index.tsx
└── index.css
```

Esse padrão deixa o JSX e o CSS do componente próximos, facilitando manutenção.

### Componentes Globais

#### `components/button`

Botão usado principalmente no login/cadastro.

Arquivos:

```txt
src/components/button/index.tsx
src/components/button/index.css
```

### Página de Login

Arquivos:

```txt
src/pages/login/index.tsx
src/pages/login/index.css
```

Responsabilidades:

- Renderizar formulário de login.
- Renderizar formulário de cadastro.
- Usar card com animação de giro.
- Chamar `loginUser`.
- Chamar `createUser`.
- Salvar token retornado pela API.
- Navegar para `/home` após autenticação.

Campos usados pela API:

```json
{
  "username": "usuario",
  "password": "senha"
}
```

Importante: a API usa `username`, não `email`.

### Página Home

Arquivos:

```txt
src/pages/home/index.tsx
src/pages/home/index.css
```

Responsabilidades:

- Validar se existe token.
- Redirecionar para `/login` se não existir token.
- Carregar tarefas via `GET /api/tarefas/`.
- Criar tarefa via `POST /api/tarefas/`.
- Atualizar tarefa via `PUT /api/tarefas/{id}`.
- Deletar tarefa via `DELETE /api/tarefas/{id}`.
- Controlar filtro por nome.
- Controlar modal de criação/edição.
- Controlar modal de confirmação antes de apagar.
- Calcular progresso.
- Atualizar GIF do Snoopy conforme progresso.

### Componentes da Home

#### `TaskBoard`

Arquivos:

```txt
src/pages/home/components/taskBoard/index.tsx
src/pages/home/components/taskBoard/index.css
```

Renderiza:

- Cabeçalho da lista.
- Botão de nova lista visual.
- Filtro por nome.
- Lista de tarefas.
- Botões de adicionar, editar, deletar.
- Estado concluído com riscado e cor diferente.
- Mensagem quando não há tarefa pendente ou quando todas foram concluídas.

Observação: a API atual não possui entidade de lista. Por isso, a lista funciona como agrupamento visual no frontend. As tarefas reais vêm de `/api/tarefas/`.

#### `TaskModal`

Arquivos:

```txt
src/pages/home/components/taskModal/index.tsx
src/pages/home/components/taskModal/index.css
```

Modal reutilizável para:

- Criar tarefa.
- Editar tarefa.
- Criar lista visual.
- Editar lista visual.

Ele recebe:

- `title`
- `placeholder`
- `submitLabel`
- `initialValue`
- `onSubmit`
- `onClose`

#### `ConfirmModal`

Arquivos:

```txt
src/pages/home/components/confirmModal/index.tsx
src/pages/home/components/confirmModal/index.css
```

Modal de confirmação usado antes de apagar:

- Tarefa.
- Lista visual e suas tarefas.

Evita exclusão acidental.

#### `ProgressBar`

Arquivos:

```txt
src/pages/home/components/progressBar/index.tsx
src/pages/home/components/progressBar/index.css
```

Mostra:

- Percentual concluído.
- Quantidade de tarefas concluídas.
- Quantidade de tarefas pendentes.

Cálculo:

```ts
progress = Math.round((completedTasks / totalTasks) * 100)
```

Quando `totalTasks` é `0`, o progresso é `0%`.

#### `SnoopyStatus`

Arquivos:

```txt
src/pages/home/components/snoopyStatus/index.tsx
src/pages/home/components/snoopyStatus/index.css
```

Mostra um GIF conforme o estado das tarefas:

| Condição | GIF |
|---|---|
| Nenhuma tarefa concluída | `snoopy_triste.gif` |
| Algumas tarefas concluídas | `snoopy_normal.gif` |
| Todas concluídas | `snoopy_feliz.gif` |

#### `SnoopyClock`

Arquivos:

```txt
src/pages/home/components/snoopyClock/index.tsx
src/pages/home/components/snoopyClock/index.css
```

Mostra:

- Imagem `snoopy_deitado.jpg`.
- Relógio em tempo real.

O horário é atualizado a cada segundo com `setInterval`.

#### `SnoopyFooter`

Arquivos:

```txt
src/pages/home/components/snoopyFooter/index.tsx
src/pages/home/components/snoopyFooter/index.css
```

Componente de rodapé visual com imagem temática. Ele existe no projeto e pode ser reativado na Home quando necessário.

### Camada de Integração com API no Frontend

A pasta criada para chamadas HTTP é:

```txt
src/functions/
```

Arquivos:

```txt
src/functions/api.ts
src/functions/auth.ts
src/functions/tasks.ts
```

#### `api.ts`

Responsável por:

- Definir `API_BASE_URL`.
- Executar `fetch`.
- Serializar JSON.
- Incluir header `Content-Type: application/json`.
- Incluir token JWT quando `auth: true`.
- Salvar token.
- Buscar token.
- Limpar token.
- Lançar `ApiError`.

Token no navegador:

```txt
localStorage["todolist_access_token"]
```

URL padrão da API:

```txt
http://127.0.0.1:8000/api
```

Pode ser sobrescrita com:

```txt
VITE_API_BASE_URL
```

Exemplo:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

#### `auth.ts`

Funções:

```ts
createUser({ username, password })
loginUser({ username, password })
```

`loginUser` chama:

```txt
POST /api/usuarios/login
```

E salva:

```txt
access_token
```

#### `tasks.ts`

Funções:

```ts
listTasks()
createTask(payload)
updateTask(taskId, payload)
deleteTask(taskId)
```

Todas usam `auth: true`, então enviam:

```txt
Authorization: Bearer <token>
```

### Scripts do Frontend

Dentro de `frontend/todolist`:

```bash
npm install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

Em PowerShell no Windows, usar `npm.cmd` evita bloqueio de execução do `npm.ps1`.

Servidor de desenvolvimento:

```txt
http://127.0.0.1:5173
```

## Backend em Detalhes

O backend fica em:

```txt
backend/api
```

Ele é uma API RESTful construída com Django 6 e Django Ninja.

### Arquivos Principais

```txt
backend/api/manage.py
backend/api/api/settings.py
backend/api/api/urls.py
backend/api/api/routes.py
backend/api/api/auth.py
backend/api/usuarios/
backend/api/tarefas/
```

### Apps

#### `usuarios`

Responsável por:

- Modelo de usuário.
- Cadastro.
- Login.
- Geração de token.
- CRUD de usuários.

Arquivos principais:

```txt
usuarios/models.py
usuarios/schemas.py
usuarios/routes.py
usuarios/services.py
```

#### `tarefas`

Responsável por:

- Modelo de tarefa.
- CRUD de tarefas.
- Isolamento por usuário autenticado.

Arquivos principais:

```txt
tarefas/models.py
tarefas/schemas.py
tarefas/routes.py
tarefas/services.py
```

## Modelo de Dados

### Usuário

Arquivo:

```txt
backend/api/usuarios/models.py
```

O modelo `Usuario` herda de `AbstractUser`.

Tabela:

```txt
usuarios
```

Campos herdados importantes:

- `id`
- `username`
- `password`
- `email`
- `first_name`
- `last_name`
- `is_staff`
- `is_active`
- `is_superuser`
- `date_joined`
- `last_login`

Configuração:

```py
AUTH_USER_MODEL = "usuarios.Usuario"
```

### Tarefa

Arquivo:

```txt
backend/api/tarefas/models.py
```

Campos:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | int | Chave primária |
| `usuario` | FK | Dono da tarefa |
| `titulo` | string | Título da tarefa |
| `descricao` | text/null | Descrição opcional |
| `concluida` | boolean | Estado da tarefa |
| `criada_em` | datetime | Data de criação |

Relacionamento:

```txt
Usuario 1:N Tarefa
```

Cada usuário só acessa as próprias tarefas.

## Schemas da API

### Usuários

Arquivo:

```txt
backend/api/usuarios/schemas.py
```

| Schema | Uso | Campos |
|---|---|---|
| `UsuarioIn` | Criar/atualizar usuário | `username`, `password` |
| `UsuarioOut` | Resposta pública | `id`, `username` |
| `LoginIn` | Login | `username`, `password` |
| `TokenOut` | Resposta de login | `access_token`, `token_type` |

### Tarefas

Arquivo:

```txt
backend/api/tarefas/schemas.py
```

| Schema | Uso | Campos |
|---|---|---|
| `TarefaIn` | Criar/atualizar tarefa | `titulo`, `descricao`, `concluida` |
| `TarefaOut` | Resposta da API | `id`, `usuario_id`, `titulo`, `descricao`, `concluida`, `criada_em` |

## Autenticação JWT

O login funciona assim:

1. Frontend envia `username` e `password`.
2. Backend valida credenciais.
3. Backend gera JWT.
4. Frontend salva `access_token` no `localStorage`.
5. Frontend envia o token nas rotas protegidas.

Header usado:

```txt
Authorization: Bearer <access_token>
```

Payload do token:

| Campo | Descrição |
|---|---|
| `usuario_id` | ID do usuário |
| `username` | Username |
| `iat` | Emitido em |
| `exp` | Expiração |

Configurações JWT em `settings.py`:

```py
JWT_SECRET_KEY = SECRET_KEY
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 60
```

Validação do token:

```txt
backend/api/api/auth.py
```

A classe `JWTAuth`:

- Lê o token Bearer.
- Decodifica com `PyJWT`.
- Busca o usuário pelo `usuario_id`.
- Retorna o usuário em `request.auth`.

Se o token for inválido, expirado ou o usuário não existir, a API retorna `401`.

## Endpoints da API

Base URL:

```txt
/api/
```

Em desenvolvimento:

```txt
http://127.0.0.1:8000/api
```

### Usuários

#### Listar usuários

```http
GET /api/usuarios/
```

Resposta:

```json
[
  { "id": 1, "username": "nelson" }
]
```

#### Buscar usuário

```http
GET /api/usuarios/{usuario_id}
```

Resposta:

```json
{ "id": 1, "username": "nelson" }
```

#### Criar usuário

```http
POST /api/usuarios/
Content-Type: application/json
```

Body:

```json
{
  "username": "nelson",
  "password": "minha_senha"
}
```

Resposta:

```json
{
  "id": 1,
  "username": "nelson"
}
```

#### Login

```http
POST /api/usuarios/login
Content-Type: application/json
```

Body:

```json
{
  "username": "nelson",
  "password": "minha_senha"
}
```

Resposta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

#### Atualizar usuário

```http
PUT /api/usuarios/{usuario_id}
Content-Type: application/json
```

Body:

```json
{
  "username": "nelson_updated",
  "password": "nova_senha"
}
```

#### Deletar usuário

```http
DELETE /api/usuarios/{usuario_id}
```

Resposta:

```json
{
  "mensagem": "Usuário deletado com sucesso"
}
```

### Tarefas

Todas as rotas de tarefas exigem:

```txt
Authorization: Bearer <access_token>
```

#### Listar tarefas

```http
GET /api/tarefas/
Authorization: Bearer <token>
```

Resposta:

```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "titulo": "Comprar leite",
    "descricao": "Ir ao mercado",
    "concluida": false,
    "criada_em": "2026-05-16T01:00:00Z"
  }
]
```

#### Buscar tarefa

```http
GET /api/tarefas/{tarefa_id}
Authorization: Bearer <token>
```

#### Criar tarefa

```http
POST /api/tarefas/
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "titulo": "Comprar leite",
  "descricao": "Ir ao mercado",
  "concluida": false
}
```

#### Atualizar tarefa

```http
PUT /api/tarefas/{tarefa_id}
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "titulo": "Comprar leite",
  "descricao": "Ir ao mercado",
  "concluida": true
}
```

#### Deletar tarefa

```http
DELETE /api/tarefas/{tarefa_id}
Authorization: Bearer <token>
```

Resposta:

```json
{
  "mensagem": "Tarefa deletada com sucesso"
}
```

## Swagger

O Django Ninja gera documentação interativa automaticamente.

URL local:

```txt
http://127.0.0.1:8000/api/docs
```

Nela é possível:

- Ver todos os endpoints.
- Testar requests.
- Ver schemas.
- Enviar token Bearer para rotas protegidas.

## Banco de Dados

O backend usa PostgreSQL.

A conexão é lida da variável:

```env
DATABASE_URL=
```

O projeto está preparado para usar Neon com SSL.

Exemplo:

```env
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require
```

Configuração no Django:

```py
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=0,
        ssl_require=True,
    )
}
```

## Variáveis de Ambiente

### Backend

Arquivo:

```txt
backend/api/.env
```

Variável principal:

```env
DATABASE_URL=postgresql://...
```

### Frontend

Opcional:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Se não for definida, o frontend usa:

```txt
http://127.0.0.1:8000/api
```

## CORS

Como o frontend e o backend rodam em portas diferentes durante o desenvolvimento, é necessário configurar CORS no backend.

Frontend:

```txt
http://127.0.0.1:5173
```

Backend:

```txt
http://127.0.0.1:8000
```

Sem CORS, o navegador pode fazer um `OPTIONS` preflight e a API retornar `405 Method Not Allowed`.

Dependência já presente em `requirements.txt`:

```txt
django-cors-headers==4.9.0
```

Configuração esperada no `settings.py`:

```py
INSTALLED_APPS = [
    "corsheaders",
    ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## Como Rodar o Projeto

### 1. Rodar o Backend

Entrar na pasta:

```bash
cd backend/api
```

Criar/ativar ambiente virtual, se necessário:

```bash
python -m venv ../venv
```

Windows PowerShell:

```powershell
..\venv\Scripts\Activate.ps1
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Configurar `.env`:

```env
DATABASE_URL=postgresql://...
```

Rodar migrações:

```bash
python manage.py migrate
```

Subir servidor:

```bash
python manage.py runserver
```

API:

```txt
http://127.0.0.1:8000/api
```

Swagger:

```txt
http://127.0.0.1:8000/api/docs
```

### 2. Rodar o Frontend

Entrar na pasta:

```bash
cd frontend/todolist
```

Instalar dependências:

```bash
npm install
```

Subir Vite:

```bash
npm.cmd run dev
```

Aplicação:

```txt
http://127.0.0.1:5173
```

Build:

```bash
npm.cmd run build
```

Lint:

```bash
npm.cmd run lint
```

## Fluxo Completo da Aplicação

1. Usuário acessa `/login`.
2. Usuário cria conta ou faz login.
3. Frontend chama `/api/usuarios/` ou `/api/usuarios/login`.
4. Backend retorna JWT.
5. Frontend salva o token em `localStorage`.
6. Usuário é enviado para `/home`.
7. Home chama `GET /api/tarefas/` com token.
8. Backend retorna apenas as tarefas daquele usuário.
9. Usuário cria, edita, conclui, filtra ou deleta tarefas.
10. Cada alteração chama a API.
11. UI recalcula progresso e muda o GIF do Snoopy.

## Detalhes Importantes da Integração

### Frontend usa nomes amigáveis

Na UI:

```ts
Task {
  id
  title
  description
  completed
}
```

Na API:

```ts
ApiTask {
  id
  usuario_id
  titulo
  descricao
  concluida
  criada_em
}
```

Por isso existe um mapper na Home:

```ts
function mapApiTask(apiTask: ApiTask): Task
```

### Listas são visuais

A API só possui tarefas. Ela não possui CRUD de listas.

Portanto:

- Criar lista no frontend é um agrupamento visual local.
- As tarefas persistidas são sempre tarefas da API.
- Deletar uma lista visual apaga as tarefas dentro dela chamando `DELETE /api/tarefas/{id}` para cada tarefa.

### Token expirado

Quando a API retorna `401`, o frontend limpa o token:

```ts
clearAccessToken()
```

E redireciona para:

```txt
/login
```

## Design e UX

O frontend não é só CRUD seco. A Home usa elementos visuais para dar feedback:

- GIF triste quando nada foi concluído.
- GIF normal quando existe progresso parcial.
- GIF feliz quando tudo foi concluído.
- Barra de progresso com percentual.
- Tarefas concluídas aparecem riscadas.
- Confirmação antes de apagar.
- Filtro por nome.
- Layout responsivo para reduzir sobreposição em telas menores.

## Arquivos de Documentação

Além deste README:

```txt
api_documentation.md
```

Contém uma documentação detalhada da API, arquitetura, schemas, endpoints e fluxo JWT.

```txt
todolist.md
```

Contém o briefing inicial da Home e dos componentes visuais.

## Problemas Comuns

### Login retorna 405

Provável causa: CORS/preflight.

O navegador envia:

```http
OPTIONS /api/usuarios/login
```

Se o backend não estiver configurado para CORS, ele pode responder `405`.

Solução: configurar `django-cors-headers` no backend.

### Login retorna 401

Credenciais inválidas.

Verifique:

- `username`
- `password`
- se o usuário foi criado corretamente

### Home volta para Login

Provável causa:

- token ausente
- token expirado
- token inválido
- API retornando `401`

### Tarefas não carregam

Verifique:

- backend rodando em `http://127.0.0.1:8000`
- `VITE_API_BASE_URL`
- token salvo no navegador
- CORS
- banco de dados conectado

## Scripts Rápidos

Frontend:

```bash
cd frontend/todolist
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Backend:

```bash
cd backend/api
python manage.py migrate
python manage.py runserver
```

## Estado Atual

O projeto já possui:

- Frontend com login/cadastro.
- Integração JWT.
- Home integrada com tarefas da API.
- CRUD de tarefas.
- Confirmação antes de apagar.
- Filtro por nome.
- Layout responsivo.
- Feedback visual com Snoopy.
- Documentação da API.
- Build e lint funcionando no frontend.

