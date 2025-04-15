from .base import *

# Debug mode ON for development
DEBUG = env.bool('DEBUG', default=True)

# Development-specific secret key
SECRET_KEY = env('SECRET_KEY', default='dev-secret-key')

# Allowed hosts for development
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['127.0.0.1', 'localhost'])

# SQLite for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email settings for development (Console Backend)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
