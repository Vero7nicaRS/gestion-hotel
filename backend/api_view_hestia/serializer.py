from rest_framework import serializers
from .models import tipohabitacion, habitacion, tiposala, sala, cliente, reserva, reserva_sala, reserva_habitacion

class tipohabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = tipohabitacion
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']

class habitacionSerializer(serializers.ModelSerializer):
    idtipo_habitacion = tipohabitacionSerializer(read_only=True)
    class Meta:
        model = habitacion
        fields = ['id', 'numero', 'idtipo_habitacion', 'estado']
        read_only_fields = ['id']

class tiposalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = tiposala
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']

class salaSerializer(serializers.ModelSerializer):
    idtipo_sala = tiposalaSerializer(read_only=True)
    class Meta:
        model = sala
        fields = ['id', 'numero', 'idtipo_sala', 'estado']
        read_only_fields = ['id']

class clienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = cliente
        fields = ['id', 'nombre', 'email']
        read_only_fields = ['id']

class reservaSerializer(serializers.ModelSerializer):
    idcliente = clienteSerializer(read_only=True)
    estado = serializers.CharField(source='get_estado_display', read_only=True)
    tipo_reserva = serializers.CharField(source='get_tipo_reserva_display', read_only=True)
    class Meta:
        model = reserva
        fields = ['id', 'idcliente','estado','tipo_reserva','fecha_reserva']
        read_only_fields = ['id']

class reserva_salaSerializer(serializers.ModelSerializer):
    idreserva = reservaSerializer(read_only=True)
    idsala = salaSerializer(read_only=True)
    class Meta:
        model = reserva_sala
        fields = ['id', 'idreserva', 'idsala','numero_personas','fecha_uso', 'hora_inicio', 'hora_fin']
        read_only_fields = ['id']

class reserva_habitacionSerializer(serializers.ModelSerializer):
    idreserva = reservaSerializer(read_only=True)
    idhabitacion = habitacionSerializer(read_only=True)
    class Meta:
        model = reserva_habitacion
        fields = ['id', 'idreserva', 'idhabitacion','numero_personas','fecha_entrada', 'fecha_salida']
        read_only_fields = ['id']