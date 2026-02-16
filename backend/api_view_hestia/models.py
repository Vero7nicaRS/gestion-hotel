from django.db import models

class tipohabitacion(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(max_length=250)
    

    def __str__(self):
        return f"{self.nombre} - ${self.precio}"
    
    class Meta:
        ordering = ['nombre']
    
    
class habitacion(models.Model):
    numero = models.CharField(max_length=10, unique=True)
    idtipo_habitacion = models.ForeignKey(tipohabitacion, on_delete=models.CASCADE)
    class Estado(models.TextChoices):
        DISPONIBLE = "DISPONIBLE", "Disponible"
        OCUPADA = "OCUPADA", "Ocupada"
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.DISPONIBLE)

    def __str__(self):
        return f"Habitación {self.numero} - {self.idtipo_habitacion.nombre}"
    class Meta:
        ordering = ['numero']
    

class tiposala(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(max_length=250)
    
    def __str__(self):
        return f"{self.nombre} - ${self.precio}"
    class Meta:
        ordering = ['nombre']
    
class sala(models.Model):
    numero = models.CharField(max_length=10, unique=True)
    idtipo_sala = models.ForeignKey(tiposala, on_delete=models.CASCADE)
    class Estado(models.TextChoices):
        DISPONIBLE = "DISPONIBLE", "Disponible"
        OCUPADA = "OCUPADA", "Ocupada"
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.DISPONIBLE)

    def __str__(self):
        return f"Sala {self.numero} - {self.idtipo_sala.nombre}"
    class Meta:
        ordering = ['numero', 'estado']
    
class cliente(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=65, unique=True)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']
    
class reserva(models.Model):
    idcliente = models.ForeignKey(cliente, on_delete=models.CASCADE)
    class TipoReserva(models.TextChoices):
        HABITACION = "HABITACION", "Habitación"
        SALA = "SALA", "Sala"
    class Estado(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        CONFIRMADA = "CONFIRMADA", "Confirmada"
        CANCELADA = "CANCELADA", "Cancelada"
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    tipo_reserva = models.CharField(max_length=20, choices=TipoReserva.choices)
    fecha_reserva = models.DateField()

    def __str__(self):
        if self.tipo_reserva == self.TipoReserva.HABITACION:
            return f"Reserva de {self.idcliente} para habitación {self.idhabitacion}"
        elif self.tipo_reserva == self.TipoReserva.SALA:
            return f"Reserva de {self.idcliente} para sala {self.idsala}"
        
    class Meta:
        ordering = ['fecha_reserva', 'estado']
        
class reserva_habitacion(models.Model):
    idhabitacion = models.ForeignKey(habitacion, on_delete=models.CASCADE)
    idreserva=models.OneToOneField(reserva, on_delete=models.CASCADE)
    numero_personas = models.PositiveIntegerField()
    fecha_entrada = models.DateField()
    fecha_salida = models.DateField()

    def __str__(self):
        return f"Reserva de {self.idcliente} para habitación {self.idhabitacion}"
    class Meta:
        ordering = ['fecha_entrada', 'fecha_salida']

class reserva_sala(models.Model):
    idsala = models.ForeignKey(sala, on_delete=models.CASCADE)
    idreserva=models.ForeignKey(reserva, on_delete=models.CASCADE)
    numero_personas = models.PositiveIntegerField()
    fecha_uso = models.DateField() #fecha en la que se usará la sala
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    def __str__(self):  
        return f"Reserva de {self.idcliente} para sala {self.idsala}"
    class Meta:
        ordering = ['fecha_uso', 'hora_inicio']


        
