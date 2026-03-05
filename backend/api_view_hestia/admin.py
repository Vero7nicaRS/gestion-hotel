from django.contrib import admin
from .models import Cliente,Habitacion,Sala,Reserva,ReservaHabitacion,ReservaSala,TipoHabitacion,TipoSala
# Register your models here.
admin.site.register(Cliente)
admin.site.register(Habitacion)
admin.site.register(TipoHabitacion)
admin.site.register(Sala)
admin.site.register(TipoSala)
admin.site.register(Reserva)
admin.site.register(ReservaHabitacion)
admin.site.register(ReservaSala)

