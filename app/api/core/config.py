from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv() 

class Settings(BaseSettings):
    app_name: str = "My App"
    database_url: str = "sqlite:///./test.db"  
    secret_key: str = "default-secret-key"     
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()