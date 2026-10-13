# Paquete de escritorio (.exe) y de Android (.apk)

Los dos paquetes usan el mismo HTML que la versión web compacta. No incluyen canciones de la radio, ni la música de Escampar en este build, ni los sonidos ESC-50 (son solo del tráiler), ni a Charly Amado (todavía no está en el juego).

## Antes de empaquetar

    cd ..                                   # raíz del repo
    npm ci
    node scripts/build.mjs --solo=compacto  # genera dist/gta-san-jorge-compacto.html

## Windows (.exe portable)

    cd paquete/escritorio
    npm ci
    cp ../../dist/gta-san-jorge-compacto.html index.html
    npx electron-builder --win portable --x64

El .exe queda en `paquete/escritorio/release/`. Pesa unos 100 MB porque lleva Chromium adentro.

## Android (.apk)

    cd paquete/apk
    npm ci
    mkdir -p www && cp ../../dist/gta-san-jorge-compacto.html www/index.html
    npx cap sync android

Después abrí la carpeta `paquete/apk/android` con Android Studio (trae el SDK) y usá Build > Build APK(s). Hace falta JDK 17 o superior. El APK queda en `android/app/build/outputs/apk/`.

Para publicar en la tienda hay que firmar el APK con una clave de release, que no va en el repo.
