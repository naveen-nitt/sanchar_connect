from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Sanchar Connect"
    env: str = "development"
    secret_key: str
    database_url: str
    frontend_origin: str = "http://localhost:3000"
    session_cookie_secure: bool = False
    session_minutes: int = 30
    whatsapp_api_base: str = "https://graph.facebook.com/v20.0"
    domain_url: str = "http://localhost:3000"
    rate_limit_per_minute: int = 20


settings = Settings()
