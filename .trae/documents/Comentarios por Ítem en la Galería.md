## Objetivo
Integrar comentarios por cada ítem de la galería (mínimo 10 por ítem), eliminar `buildComments` y consumir esos comentarios estáticos desde los datos del servicio, mostrándolos en la sección de comentarios del visor.

## Cambios de Tipos
- Añadir a `GalleryItem` un nuevo campo: `commentsList?: PlaceReview[]` para no romper el uso actual de `comments: number`.
- Mantener `comments` como contador (se puede sincronizar con `commentsList.length`).

## Datos (Servicio simulado)
- En `data/placeService.ts`:
  - Completar `galleryItems` con `commentsList` (≥10 comentarios) por cada ítem, usando `PlaceReview`.
  - Opcional: establecer `comments = commentsList.length` para consistencia.

## UI: GalleryViewer
- En `components/place/GalleryViewer.tsx`:
  - Eliminar `buildComments` y `useMemo` asociados.
  - Usar `currentItem.commentsList || []` para renderizar la sección de comentarios.
  - Actualizar el contador lateral de comentarios a `currentItem.commentsList?.length ?? currentItem.comments`.
  - Mantener el overlay de comentarios debajo del bloque de información (sin solaparse).

## Compatibilidad
- `PlaceGallery.tsx` sigue mostrando el número con `item.comments`; no se rompe.
- Si algún ítem no trae `commentsList`, mostrar vacío con un mensaje breve (sin errores).

## Verificación
- Build sin errores de tipos.
- Cambiar entre ítems en `GalleryViewer` actualiza los comentarios (provenientes del servicio).
- Confirmar que el contador lateral corresponde al tamaño de `commentsList`.

¿Confirmo y aplico estos cambios ahora?