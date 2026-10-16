# Colectivos reales

Pinturas y sonidos de los colectivos sacados de los mods de Proton Bus Simulator que
Nicolás tiene en `Escritorio/Modelos 3d para gta` (con permiso de uso):

- **MB Metalpar Tronador II OF-1519** (Taller Benca): pinturas Diadema 18 y 19, y todos los sonidos.
- **La Favorita GR-1 MB OF-1418**: pintura Diadema 12.
- **La Favorita GR-2 OF-1621/1519** (Uriel Lescano): pinturas Diadema 04 y Patagonia Argentina 55, 68 y 92.

El juego no carga los modelos 3D (.3ds, unos 430.000 triángulos con el interior): las pinturas
se pegan sobre la carrocería del colectivo del juego, que pesa mucho menos y anda en celulares.

## Volver a generarlos

```
pip install pillow numpy scipy
python3 tools/colectivos/skins.py "ruta/a/Modelos 3d para gta" src/render/real
python3 tools/colectivos/sonidos.py "ruta/a/Modelos 3d para gta/MB Metalpar Tronador II OF-1519-BP 2" src/audio
```

`skins.py` recorta de cada skin los dos costados, la cola y el frente, pinta los vidrios
polarizados y deja transparente lo que no es carrocería (`colectivo_*.webp`).
`sonidos.py` recorta, normaliza y hace loops sin cortes del motor y arma `colectivo.bin` + `colectivo.json`
(se necesita ffmpeg). El código está en `src/entities/colectivos.js` y `src/audio/colectivo.js`.
