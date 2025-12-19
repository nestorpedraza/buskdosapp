## Objetivo
Implementar una TabBar desplazable horizontal que muestre más de 6 ítems, con resaltado del activo y opción de suprimir el botón central.

## Cambios propuestos
1. `components/TabBar.tsx`
- Reemplazar el contenedor de ítems por `ScrollView` horizontal (`showsHorizontalScrollIndicator={false}`) y renderizar toda la lista `allTabs` en orden.
- Suprimir el “botón central flotante” o reducirlo a un estilo de resaltado del ítem activo (background circular con gradiente en el propio ítem).
- Cada ítem:
  - `Pressable` con icono y label opcional; navegación `router.push(tab.path)`.
  - Resaltado del activo: aplicar gradiente de `getGradientColors()` al contenedor del ícono.
- Estilos:
  - Altura fija, `paddingHorizontal` moderado, ítems con `minWidth` (p.ej. 68–80) para buena accesibilidad.
  - `gap` entre ítems (8–12) y `contentContainerStyle` con `alignItems: 'center'`.

2. Lógica
- Mantener `activeRoute` para decidir el resaltado.
- Eliminar el `slice(0,2)`/`slice(2,4)`; renderizar todos.

3. Verificación
- Probar en Android/iOS/Web con 6+ ítems; validar desplazamiento suave y que el activo se vea destacado.
- Confirmar que el safe-area y superposición con contenido inferior funciona.

¿Procedo a implementar esta TabBar desplazable y suprimir el botón central flotante en favor del resaltado del ítem activo?