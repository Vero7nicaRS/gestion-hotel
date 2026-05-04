# 🏨 Hestia: Hotel Management System (HMS)

## 👥 Integrantes del equipo
- Meyerson Stiven Alvarez Castro.
- Nicolle Vanessa Pérez Cardozo.
- Verónica Rodríguez Sánchez.
- Javier Eduardo Santos Chevez


## 📌 Descripción del proyecto
Proyecto para el desarrollo de una aplicación web para la gestión y reserva de habitaciones y salas de eventos de un hotel. La plataforma permitirá centralizar todas las operaciones del hotel, ofreciendo información pública sobre servicios, instalaciones y tipos de habitaciones, un módulo de reservas para los clientes y un panel administrativo para la gestión interna.

### 👤 Usuarios: Cliente y Administrador 
El sistema está pensado para que los clientes puedan solicitar reservas de habitaciones por días o salas por horas, proporcionando solo los datos necesarios para el contacto. Por su parte, el personal administrativo podrá gestionar habitaciones, salas, precios, horarios y disponibilidad, así como validar reservas y notificar a los clientes sobre su estado.

## 🎯 Objetivo
Crear una solución tecnológica moderna, escalable y eficiente, orientada a mejorar la organización interna del hotel, optimizar los procesos operativos y ofrecer una experiencia digital intuitiva y accesible para clientes y personal.


## ⚙ Instalación y ejecución

1. Clonar el repositorio

git clone https://github.com/Vero7nicaRS/gestion-hotel-hestia.git

cd gestion-hotel-hestia

2. Crear y activar entorno virtual
```bash
python -m venv venv
venv\Scripts\activate
```

3. Instalar dependencias
```bash
pip install -r requirements.txt
```

4. Backend (Django)

```bash
cd backend
```
4.1 Configuración de variables de entorno.
Crear archivo ".env" a partir ".env.estructura" y completar los datos necesarios para la conexión a la base de datos MySQL.

4.2 Ejecutar backend
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

El backend se encuentra en la siguiente ruta: http://127.0.0.1:8000/

5. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
El frontend se encuentra en la siguiente ruta: http://localhost:5173/
