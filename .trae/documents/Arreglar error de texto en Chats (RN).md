## Diagnóstico
- El error “Text strings must be rendered within a <Text> component.” ocurre cuando hay texto crudo fuera de `<Text>`.
- Revisé el código y el único uso del símbolo de búsqueda es `app/chats.tsx:40` dentro de `<Text style={styles.searchIcon}>🔎</Text>`, lo cual es correcto.
- Es probable que el error provenga de una renderización condicional que devuelve un texto crudo en otro lugar de la misma pantalla (por ejemplo, un string en un `Pressable`/`View`) o de un carácter especial que no se parsea bien.

## Cambios propuestos
1. `app/chats.tsx`
   - Sustituir el icono de búsqueda por un contenedor accesible que garantice texto dentro de `<Text>`:
     - Reemplazar `<Text style={styles.searchIcon}>🔎</Text>` por:
       - `<Pressable accessibilityRole="button" style={styles.searchIconBtn}><Text style={styles.searchIconText}>{"\u{1F50D}"}</Text></Pressable>`
     - Añadir estilos `searchIconBtn` y `searchIconText`.
   - Asegurar que todos los textos condicionales (Fecha ↓/↑, vacíos) están dentro de `<Text>` (ya lo están); no se tocarán salvo que el error persista.

2. `components/chats/ChatRow.tsx`
   - Confirmar que todos los textos (emoji 🗑️, hora, badge) se renderizan dentro de `<Text>` (ya es así); sin cambios.

3. Verificación
- Ejecutar en Android/web y comprobar que no aparece el error.
- Si persistiera, haré un barrido rápido para encontrar cualquier string crudo que se esté devolviendo en un ternario o en un `&&` fuera de `<Text>` y lo envolveré en `<Text>`.

¿Confirmas que aplique estos ajustes en `app/chats.tsx` para eliminar el error? 