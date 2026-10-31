# Matriz de pruebas multiplataforma

Marca cada celda con ✅ / ❌ y anota el modelo y la versión. Ejecutar sobre la URL **desplegada con HTTPS** (varias funciones no funcionan en `http://` por LAN).

## Dispositivos / navegadores

| # | Plataforma | Navegador | Persona | Modelo / versión |
| --- | --- | --- | --- | --- |
| 1 | Android reciente | Chrome | | |
| 2 | Android antiguo (8–10) | Chrome | | |
| 3 | iPhone / iPad | Safari | | |
| 4 | iPhone / iPad | Chrome (usa el motor de Safari) | | |
| 5 | Windows / Linux | Chrome | | |
| 6 | Windows / Linux | Firefox | | |
| 7 | Mac | Safari | | |
| 8 | Meta Quest | Navegador del visor | | |

## Casos de prueba

| Caso | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| La página carga y no hay scroll horizontal | | | | | | | | |
| Se ven los 6+ lugares en el mapa y en la lista | | | | | | | | |
| Tocar un punto del mapa muestra el lugar | | | | | | | | |
| «Cómo llegar» abre Google Maps en el punto correcto | | | | | | | | |
| La ficha abre y cierra (botón, fondo, «atrás» del teléfono) | | | | | | | | |
| Vista 360°: se mueve arrastrando | | | | | | | | |
| Vista 360°: se mueve con el teléfono (pide permiso en iPhone) | | | | | | | | |
| Se puede instalar (Android/escritorio: botón; iPhone: Agregar a inicio) | | | | | | | | |
| Abre como app (sin barra del navegador) y con el ícono correcto | | | | | | | | |
| Modo avión tras la primera visita: abre y muestra lugares | | | | | | | | |
| Modo avión: aviso «Sin conexión» visible | | | | | | | | |
| Con «reducir movimiento» activado no hay animaciones bruscas | | | | | | | | |

## Cómo probar sin conexión

1. Abre la app con internet y espera ~10 s (el service worker guarda todo).
2. Activa modo avión (o DevTools → Network → *Offline*).
3. Recarga: debe abrir y mostrar los lugares con el aviso de «Sin conexión».

## Probar en el teléfono durante el desarrollo

El 360° con movimiento y la instalación requieren HTTPS. Con el servidor de desarrollo corriendo, usa un túnel (por ejemplo `cloudflared tunnel --url http://localhost:5173` o ngrok) y abre la URL https en el teléfono.

## Registro de fallas

| Fecha | Dispositivo | Qué pasó | Responsable | Estado |
| --- | --- | --- | --- | --- |
| | | | | |
