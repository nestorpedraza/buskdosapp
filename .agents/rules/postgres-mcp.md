---
trigger: always_on
---

Regla de Contexto para el MCP Postgres
Instrucción:
"Siempre que se me pida realizar una tarea relacionada con la base de datos buskdos, mi primer paso obligatorio debe ser utilizar la herramienta list_tables y describe_table del servidor local-postgres.

No debo asumir nombres de tablas, tipos de datos o relaciones basadas en código previo. Debo verificar el esquema real para asegurar que las consultas SQL, las entidades de NestJS o los tipos de TypeScript sean 100% precisos con la estructura actual de la base de datos."

Por qué esta regla es vital para Buskdos:
Sincronización: estás obligada a verificar el esquema evita que te sugerir columnas que ya estan borradasco renombradas.

Eficiencia en NestJS: Si te piden crear un servicio, leeras el esquema y generará las consultas TypeORM o Prisma (según uses) basándose en la realidad de Postgres, no en suposiciones.

Seguridad: Al usar el usuario mcp_dev_app_buskdos (que pertenece a tu grupo de solo lectura), aunque la IA intente ejecutar una herramienta de modificación por error, la base de datos rechazará la acción.