# 🚀 API NestJS - Usuarios, Proyectos y Tareas

Backend desarrollado con **NestJS** para la gestión de usuarios, autenticación, proyectos y tareas.

---

## 🧰 Tecnologías

* ⚡ NestJS
* 🗄️ TypeORM
* 🐘 PostgreSQL
* 🔐 JWT (Autenticación)
* 🐳 Docker

---

## 📌 Descripción

Esta API permite:

* Registro y autenticación de usuarios
* Creación y gestión de proyectos
* Administración de tareas por proyecto
* Relación entre usuarios y proyectos

---

## 📁 Estructura del proyecto

```
src/
├── auth/
├── users/
├── projects/
├── tasks/
├── providers/
├── config/
```

---

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone https://github.com/DantonSoftware/Nest-usuarios-proyectos-tareas.git
cd Nest-usuarios-proyectos-tareas
```

Instalar dependencias:

```bash
npm install
```

---

## 🔐 Variables de entorno

Crear archivo `.develop.env` basado en `.env.example`:

```bash
copy .env.example .develop.env
```

Ejemplo de configuración:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db

HASH_SALT=10
JWT_SECRET=your_secret
```

---

## ▶️ Ejecutar el proyecto

Modo desarrollo:

```bash
npm run start:dev
```

Modo producción:

```bash
npm run build
npm run start:prod
```

---

## 🐳 Docker

```bash
docker-compose up -d
```

---

## 📡 Endpoints principales

### 🔐 Auth

* `POST /auth/register`
* `POST /auth/login`

### 👤 Users

* `GET /users`
* `GET /users/:id`

### 📁 Projects

* `POST /projects`
* `GET /projects`

### ✅ Tasks

* `POST /tasks`
* `GET /tasks`

---

## 🧪 Testing

```bash
npm run test
```

---

## 📦 Build

```bash
npm run build
```

---

## 🧠 Autor

**DantonSoftware** 🚀

---

## ⭐ Notas

Proyecto backend desarrollado como práctica avanzada con NestJS siguiendo buenas prácticas de arquitectura.
