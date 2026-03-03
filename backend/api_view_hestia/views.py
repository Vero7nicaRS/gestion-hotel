from rest_framework import viewsets
from .models import Habitacion, TipoHabitacion, Sala, TipoSala, Cliente
from .serializer import HabitacionSerializer, TipoHabitacionSerializer, SalaSerializer, TipoSalaSerializer, ClienteSerializer
from rest_framework.response import Response
from rest_framework import status

#----------- HABITACION API VIEWS -----------




#----------- SALA API VIEWS -----------
class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    lookup_field = 'id'

class TipoSalaViewSet(viewsets.ModelViewSet):
    queryset = TipoSala.objects.all()
    serializer_class = TipoSalaSerializer
    lookup_field = 'id'