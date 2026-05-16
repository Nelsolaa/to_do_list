from ninja import Schema


class UsuarioIn(Schema):
    username: str
    password: str


class UsuarioOut(Schema):
    id: int
    username: str


class LoginIn(Schema):
    username: str
    password: str


class TokenOut(Schema):
    access_token: str
    token_type: str