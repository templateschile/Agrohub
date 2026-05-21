---

alwaysApply: true
---

Despues de cada cambio en archivos (crear, editar, mover), ejecuta SIEMPRE un commit git:

1. Verifica si existe .git en el directorio raiz del proyecto:
   - SI existe .git: ejecuta git add -A && git commit -m "descripcion breve del cambio"
   - SI NO existe .git: ejecuta git init && git add -A && git commit -m "init: descripcion breve"
     Luego pregunta al usuario si tiene repo remoto para hacer git remote add origin <url> && git push -u origin main

2. Mensaje del commit: en minusculas, sin tildes, maximo 72 caracteres, formato imperativo (ej: "add tienda page with commune filter")

3. Si hay multiples archivos cambiados en una sola tarea, hacer UN solo commit agrupado con todos.

4. Nunca hacer commit de: node_modules/, .env, .env.local, dist/, build/, *.secret, carpetas de cache.

5. Nunca borrar archivos sin confirmacion explicita del usuario.

6. Si el commit falla por conflictos o errores de git, reportarlo antes de continuar.