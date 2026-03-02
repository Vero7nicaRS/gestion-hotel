from rest_framework.views import APIView
from .models import Habitacion, TipoHabitacion, Sala, TipoSala, Cliente
from .serializer import HabitacionSerializer, TipoHabitacionSerializer, SalaSerializer, TipoSalaSerializer, ClienteSerializer
from rest_framework.response import Response
from rest_framework import status

#----------- HABITACION API VIEWS -----------




#----------- SALA API VIEWS -----------
class TipoSalaList(APIView):
    def get(self, request):
        tipos_sala = TipoSala.objects.all()
        if not tipos_sala.exists():
            return Response(
                {"message": "No hay tipos de sala disponibles en este momento"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = TipoSalaSerializer(tipos_sala, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SalaList(APIView):
    def get(self, request):
        salas = Sala.objects.filter(estado='disponible')
        
        if not salas.exists():
            return Response(
                {"message": "No hay salas disponibles en este momento"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = SalaSerializer(salas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)