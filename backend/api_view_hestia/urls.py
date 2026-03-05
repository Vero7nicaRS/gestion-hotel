from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TipoSalaList, SalaList, ReservaHabitacionView

# ROUTER VIEWSET
router = DefaultRouter() 

urlpatterns = router.urls


#------ API VIEWS URLS -------
urlpatterns = [
    path('tipos-sala/', TipoSalaList.as_view(), name='tipos-sala'),
    path('salas/', SalaList.as_view(), name='salas'),
    path('reserva-habitacion/', ReservaHabitacionView.as_view()),
]

