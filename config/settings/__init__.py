import environ
from pathlib import Path

# Initialize environment variables
BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(env_file=BASE_DIR / ".env")

# Get the environment from the .env file (default to 'dev')
environment = env("DJANGO_ENV", default="dev")

if environment == "prod":
    from .prod import *
else:
    from .dev import *
