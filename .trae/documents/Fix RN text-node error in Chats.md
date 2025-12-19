## Causa
- En `components/chats/ChatRow.tsx` la condición `{item.unreadCount && item.unreadCount > 0 && (...)}` puede devolver `0` cuando `unreadCount` es 0. React Native intenta renderizar ese número como nodo de texto fuera de `<Text>`, disparando “Text strings must be rendered within a <Text> component.”.

## Cambios propuestos
1. `components/chats/ChatRow.tsx`
   - Reemplazar la condición por `{item.unreadCount > 0 && (...)}` para garantizar un booleano y evitar que se renderice `0`.
   - Mantener el contenido del badge sin cambios.

## Verificación
- Recargar la pantalla de Chats con un item que tenga `unreadCount: 0` (ya existe en datos de ejemplo) y confirmar que no aparece el error.
- Validar que el badge se muestre solo cuando `unreadCount > 0`.

¿Confirmas que aplique este ajuste en `ChatRow.tsx`?