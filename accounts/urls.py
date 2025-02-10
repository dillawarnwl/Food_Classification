from django.urls import path
from accounts.views import UserProfileUpdateView, UserProfileDetailView, GoogleLoginView, FacebookLoginView

urlpatterns = [
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile_update'),
    path('profile/', UserProfileDetailView.as_view(), name='profile_detail'),
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('facebook-login/', FacebookLoginView.as_view(), name='facebook_login'),
]
