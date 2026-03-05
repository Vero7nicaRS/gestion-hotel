from rest_framework.views import APIView
from .models import Habitacion, TipoHabitacion, Sala, TipoSala, Cliente, Reserva, ReservaHabitacion
from .serializer import HabitacionSerializer, TipoHabitacionSerializer, SalaSerializer, TipoSalaSerializer, ClienteSerializer, ReservaHabitacionSerializer,ReservaSalaSerializer
from datetime import date
from rest_framework.response import Response
from rest_framework import status
#from rest_framework.generic import ListAPIView

#----------- OBTENER DATOS DEL CLIENTE -----------
def obtener_o_crear_cliente(request):
    datos_cliente = request.data.get("cliente")
    if not datos_cliente:
        return None, Response(
            {"error": "Nombre y correo son necesarios"},
            status=400
        )
    clientes, _ = Cliente.objects.get_or_create(
        email=datos_cliente["email"],
        defaults={"nombre": datos_cliente["nombre"]}
    )
    return clientes,  None
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
    

#----------- RESERVA API VIEWS -----------
#Habitacion
class ReservaHabitacionView(APIView):
    def get(self, request):
        reservas = Reserva.objects.all()
        if not reservas:
            print("Hasta el momento no hay reservas disponibles")
            return Response({"mensaje": "No hay reservas disponibles"}, status=status.HTTP_200_OK)
        return Response({"reservas": [r.id for r in reservas]})
    
    def post(self,request):
        clientes,error = obtener_o_crear_cliente(request)
        if error:
            return error
        nueva_reserva = Reserva.objects.create(
            cliente=clientes,
            tipo_reserva="HABITACION",
            fecha_reserva=date.today()
        )
        serializer = ReservaHabitacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(reserva=nueva_reserva)
            return Response({
                "mensaje": "Reserva pendiente por confirmar",
                "numero_de_reserva": nueva_reserva.id,
                "confirmacion": clientes.email
            },status=201)
        return Response(serializer.errors, status=400)

#Sala
