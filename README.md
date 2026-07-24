# ⛽ CosmosGas - Sistema de Gestión de Estación de Combustible

Aplicación profesional y multiplataforma desarrollada bajo arquitectura MVC para la gestión integral de surtidores, ventas y alertas en estaciones de servicio.

## 🚀 Tecnologías y Arquitectura
* **Frontend/Multiplataforma:** Next.js (React), TailwindCSS (Material Design UI), Responsive Design.
* **Backend & DB:** Supabase (PostgreSQL).
* **Arquitectura:** Clean Architecture, MVC (Models, Views, Controllers, Services).
* **Calidad:** ESLint (0 errores), Jest Testing.

## 📐 Patrones de Diseño Implementados
1. **Factory Pattern:** Ubicado en `models/SurtidorFactory.ts`. Permite instanciar Surtidores de Gasolina, Diesel o GNV dinámicamente.
2. **Adapter Pattern:** Ubicado en `services/DatabaseAdapter.ts`. Permite cambiar la base de datos (Ej. de Supabase a SQLite) sin alterar la lógica de los controladores.
3. **Observer Pattern:** Sistema de notificaciones reactivo que escucha eventos de nivel bajo de combustible para disparar alertas en tiempo real.

## 📘 Manual Técnico
### Prerrequisitos
* Node.js v18+
* Cuenta en Supabase con el esquema SQL ejecutado.

### Instalación y Ejecución
1. Clonar el repositorio: `git clone [url-del-repo]`
2. Instalar dependencias: `npm install`
3. Validar métricas de código limpio: `npm run lint`
4. Ejecutar pruebas unitarias (>80% cobertura): `npm run test -- --coverage`
5. Iniciar servidor local: `npm run dev`

### Aritmética Binaria y APIs Nativas
* **Módulo Binario:** El sistema procesa los reportes financieros convirtiendo los totales a base binaria como mecanismo de auditoría interna (`utils/binaryLogic.ts`).
* **Web Speech API:** Interfaz de ventas controlada por voz. Soporta comandos como *"Registrar Venta"* o *"Mostrar Alertas"*.
* **Clipboard API:** Exportación rápida de métricas al portapapeles.

## 📗 Manual de Usuario
1. **Inicio de Sesión:** Ingrese con credenciales asignadas (Ej. Administrador o Cajero). El sistema enrutará la vista según los permisos (JWT simulado).
2. **Dashboard:** Visualice los ingresos del día, métricas en tiempo real y gráficos de consumo.
3. **Gestión de Surtidores:** Permite dar de alta nuevo hardware, indicando su capacidad límite.
4. **Módulo de Ventas:** Seleccione el surtidor e ingrese los litros. El sistema calculará el total y descontará automáticamente el stock del surtidor. Si el nivel cae a estado crítico, el sistema generará una Alerta.
5. **Reportes:** Exporte la data histórica a formato Excel (CSV) o PDF con un solo clic.

---
**Proyecto listo para Producción (Deploy en Vercel).**