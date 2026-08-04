# MicroBase - Herramienta No-Code para PYMES 📦🚀

**Diseño y Prototipado de una herramienta no-code para la digitalización de la gestión de inventario y ventas en Pymes.**

MicroBase es una plataforma SaaS (Software as a Service) modular y dinámica, diseñada específicamente para dueños de microempresas y pymes. Su objetivo principal es cerrar la brecha digital al permitir a "desarrolladores ciudadanos" (usuarios sin experiencia técnica) crear y gestionar bases de datos estructuradas de manera intuitiva, rápida y accesible.

---

## 🌟 Características Principales

*   **Creador de Recursos Dinámicos (No-Code) y Plantillas:** Permite a los administradores crear sus propias tablas y columnas personalizadas (ej. Inventario, Clientes, Proveedores) sin escribir código.
    *   **Gestión Visual de Columnas (Drag & Drop):** Interfaz para reorganizar, crear, editar y definir tipos de datos, con preservación del orden (`order_index`).
    *   **Generación Automática de IDs:** Inyección automatizada de identificadores (UUIDs) y códigos (`COD`) para registros clave.
    *   **Sistema de Plantillas por Industria:** Inicialización de módulos pre-configurados para Restaurantes, Tiendas, Gimnasios, Farmacias, Ferreterías, Talleres y Salones de Belleza.
    *   **Modo Edición vs Modo Visual:** Switch de protección de interfaz que bloquea la modificación accidental en producción.
*   **Módulo POS (Point of Sale) e Inteligencia de UI**: 
    *   **Autocompletado Inteligente (Sugerencias API):** Búsqueda predictiva dinámica para clientes, proveedores y tickets (`/api/clients/suggest`).
    *   **Auto-llenado Cruzado y Enforzamiento:** Autocompleta automáticamente la cédula cuando se selecciona un nombre. Restringe el hardware para forzar 10 dígitos (Cédula) o 13 dígitos (RUC).
    *   **Consumidor Final Fast-Checkout**: Checkbox integrado que bloquea y autocompleta instantáneamente la venta con "Consumidor Final".
*   **Gestión Avanzada de Empleados (RRHH):**
    *   **Flujo de Altas y Bajas:** Los empleados se unen mediante Códigos de Empresa (estado `pending`) requiriendo aprobación.
    *   **Despidos y Recontrataciones:** Los administradores pueden suspender (`fired`) o recontratar (`rehire`) al personal.
*   **Sistema de Notificaciones por Correo (SMTP):** Envío automático de emails (aprobaciones, rechazos, creación de negocios), con seguimiento de errores de red y reintentos manuales.
*   **Facturación y Auditoría Extendida**: 
    *   **Tickets Térmicos y Exportaciones:** Generación de rollo térmico (58mm), CSV y PDF.
    *   **Sistema de Modificación y Anulación:** Flujos de aprobación para alterar transacciones (`pending_change`), anulación directa y **recálculo matemático automático del stock/inventario** al procesar devoluciones.
    *   **Cierre de Filas (`readOnly`):** Previene sobreescritura accidental del historial fiscal.
*   **Dashboard Analítico y KPIs (Tiempo Real)**: 
    *   **Cálculo de Ganancia Neta:** Matemática precisa de (Ventas - Compras).
    *   **Alertas y Ranking:** Alertas inteligentes de inventario bajo (Stock <= 3) y tableros interactivos del Top 3 de productos más y menos vendidos.
    *   **Filtros Cruzados:** Gráficas Chart.js adaptables por rango de fechas personalizadas y aislamiento de productos específicos.
*   **Herramientas CLI y Mantenimiento:** Set de scripts backend para exportar bases de datos completas (`backup_script.py`), restaurar backups, inyectar datos falsos para testing y un borrado seguro en cascada de Tenants completos (`delete_business.py`).
*   **Diseño de Alta Fidelidad (Glassmorphism UI)**: Interfaz fluida, moderna y responsiva (Dark/Light Mode).
*   **Micro-interacciones y UX Avanzada (Protección de Datos):**
    *   **Gamificación de Llenado:** Los formularios de creación revelan los campos uno por uno (llenado progresivo) para no abrumar al usuario.
    *   **Sugerencias Inteligentes (Builder):** Al nombrar una columna como "Rol" o "Cargo", el sistema autocompleta sugerencias de opciones (Ej: Admin, Empleado).
    *   **Auto-Scroll en Drag & Drop:** Al arrastrar elementos hacia los bordes de la pantalla, el contenedor se desplaza automáticamente.
    *   **Interceptación de Navegación (`appIsDirty`):** Evita la pérdida accidental de datos bloqueando la salida de la página si existen cambios sin guardar.
*   **Seguridad y Acceso Basado en Roles (RBAC):** Aislamiento jerárquico estricto (Admin, Gerente, Cajero). Las compras / inyecciones de stock solo están permitidas a perfiles administrativos.
*   **Soporte Multitenancy (Múltiples Negocios):** Arquitectura robusta que soporta múltiples sucursales u organizaciones independientes operando en simultáneo, garantizando un aislamiento total y seguro de su información (tablas, inventario, auditorías y usuarios).

## 🛠️ Stack Tecnológico y Arquitectura Cloud

El desarrollo y despliegue de esta propuesta tecnológica se basa en el siguiente ecosistema moderno y serverless:

*   **Backend:** Python con [FastAPI](https://fastapi.tiangolo.com/) garantizando un rendimiento ágil y escalable.
*   **Base de Datos (Cloud):** PostgreSQL Serverless alojado en **[Neon](https://neon.tech/)**, integrado con SQLAlchemy y diseño de ORM para el manejo estructurado y seguro de datos en la nube.
*   **Despliegue / Hosting:** La plataforma está desplegada en **[Vercel](https://vercel.com/)**, aprovechando su infraestructura Serverless Edge para una entrega rápida, integración continua (CI/CD) y alta disponibilidad sin necesidad de gestionar servidores tradicionales.
*   **Renderizado de Vistas:** Jinja2.
*   **Frontend:** HTML5, CSS3 Vanilla y JavaScript Vanilla, aplicando principios rigurosos de usabilidad y diseño (Glassmorphism) para facilitar la adopción por parte del usuario final.

## ⚙️ Instalación y Configuración   

### 1. Preparar Entorno
```bash
python -m venv venv
# Activar (Windows): venv\Scripts\activate
# Activar (Linux/Mac): source venv/bin/activate
pip install -r requirements.txt
```

### 2. Base de Datos
Crea una base de datos en PostgreSQL y configura tu URL en un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/microbase
```

### 3. Ejecución
Inicia el servidor local para entorno de desarrollo:
```bash
uvicorn main:app --reload
```
Navega a `http://127.0.0.1:8000/` para comenzar.

## 🗺️ Roadmap (Próximas Fases del Prototipo)

*   **Gestión Avanzada:** Integración con más herramientas de análisis en tiempo real orientadas al ecosistema Low-Code y No-Code.

---
*Desarrollado como Proyecto de Titulación - Ingeniería en Sistemas de la Información UTM*
**Autores:** Castillo Mina Williams Johao & Molina Balseca Geanella Valentina (2026)
