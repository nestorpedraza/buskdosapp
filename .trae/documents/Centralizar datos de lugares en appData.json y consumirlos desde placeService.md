## Objetivo
- Mover toda la data estática usada por `app/place/[id].tsx` desde `data/placeService.ts` a `data/appData.json` y consumirla desde el servicio.
- Mantener las firmas de `fetchPlaceDetails(id)` y `fetchRelatedPlaces()` para no tocar la vista.

## Cambios en `data/appData.json`
- Añadir una sección `placeDetails` (array) con los campos necesarios (basados en `PlaceDetails`), usando claves de assets en formato string en lugar de `require`:
  - Campos: `id`, `name`, `description`, `logo`, `coverImage`, `isVerified`, `rating`, `reviews`, `category`, `subcategory`, `organization`, `price`, `address`, `coordinates{latitude,longitude}`, `phone`, `phones[]`, `whatsapp`, `whatsapps[]`, `schedule` (string u objeto), `isOpen`, `website`, `emails[]`, `socialMedia{...}`, `deliveryApps{...}`, `promotions[]` (con `image` como clave de asset), `gallery[]` (ver abajo), `reviewsList[]` (con `userAvatar` como clave de asset).
- Representación de imágenes en JSON:
  - Guardar como rutas relativas tipo `"assets/images/city.png"` y resolverlas en el servicio con `require('../' + path)`.
- Estructura de `gallery` dentro de cada lugar:
  - Ítems con `id`, `title`, `type` (`image|video`), `url` (clave de asset), `likes`, `commentsCount`, `shares`, `description`.
  - El servicio generará `comments[]` a partir de `commentsCount` para evitar JSON masivo.
- Añadir `relatedPlaces` (array) con `{ id, name, image, category }` (imagen como clave de asset). Opcionalmente, luego se puede hacer dependiente del `id` con `relatedPlaceIds` dentro del lugar.

## Cambios en `data/placeService.ts`
- Importar `appData.json`: `import appData from './appData.json'`.
- Añadir util `resolveAsset(path: string)` que haga `require('../' + path)` de forma segura.
- Reemplazar los datos hardcodeados:
  - `relatedPlacesData` → mapear `appData.relatedPlaces` y resolver `image`.
  - `rawGalleryItems` → dejar de usarlo; consumir `place.gallery` del JSON y generar `comments[]` con el generador existente usando `commentsCount`.
  - `fetchPlaceDetails(id)`:
    - Buscar en `appData.placeDetails` por `id`.
    - Resolver claves de assets (`logo`, `coverImage`, `promotions[].image`, `reviewsList[].userAvatar`, `gallery[].url`).
    - Generar `comments[]` para cada item de galería usando `commentsCount`.
    - Retornar el objeto `PlaceDetails` listo para la UI.
  - `fetchRelatedPlaces()`:
    - Mapear `appData.relatedPlaces` a `{ id, name, image: resolveAsset(image), category }`.
- Mantener el generador de comentarios como está para `gallery.comments`.

## Cambios en la vista
- No se modifican `app/place/[id].tsx` ni componentes; las firmas y formatos permanecen.

## Validación
- Abrir `place/[id]` (por ejemplo `id=p-4`) y confirmar:
  - Carga de `logo`, `coverImage`, promociones y galería desde JSON.
  - `RelatedPlacesCarousel` muestra los lugares desde `relatedPlaces` del JSON.
  - Información de contacto, redes y apps se renderiza con los datos trasladados.

## Consideraciones técnicas
- Tipo de imágenes: como se usan assets locales, `require` es obligatorio en tiempo de ejecución; por eso las claves en JSON deben ser rutas relativas bajo `assets/`.
- Si en el futuro hay imágenes remotas, se puede permitir `imageUri` además del `image` con clave.

¿Procedo a crear la nueva sección en `appData.json` y a refactorizar `placeService.ts` para leer desde ese JSON?