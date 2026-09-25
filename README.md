# GTA: San Jorge

**Un GTA San Andreas en Comodoro Rivadavia, año 2004.** Protagonizado por el **Gordopin** y el **Petroca**.

Mundo abierto en 3D que corre en el navegador. Mapa de Comodoro estilizado, estética de la PS2, radios con música generada en el momento, misiones con cinemáticas y todo lo que tenía San Andreas, pasado por el viento patagónico.

## Cómo jugar

- **Rápido:** abrí `dist/gta-san-jorge.html` con doble clic. Es un solo archivo con todo adentro.
- **Desde el repo:** abrí `index.html` (usa `build/game.js`, que ya viene compilado).
- **Para desarrollar:**

  ```bash
  npm install
  npm run build     # compila build/game.js y dist/gta-san-jorge.html
  npm run dev       # recompila al guardar
  npm run serve     # servidor local en http://localhost:8080
  ```

Funciona en Chrome, Firefox, Edge y Safari con WebGL. En el celular aparecen controles táctiles.

## Los protagonistas

- **El Gordopin**: malabarista del semáforo de San Martín y Rivadavia y fanático del Lobo (Club Atlético Jorge Newbery). Tiene su propia frase: *"A mí no me van a sacar nunca de la calle"*. Como CJ, engorda si come choripanes y adelgaza en el gimnasio.
- **El Petroca**: petrolero con guita, camisa de jean, botas y anteojos negros. *"¡Buena petroca!"*. Te acompaña, tira desde el auto y podés jugar con él apretando **TAB**.

## La historia (7 misiones)

1. **No me van a sacar de la calle**: el comisario Tenpesos te afana la recaudación y te deja arriba del Chenque. Volvé en bici al barrio.
2. **La chata del Petroca**: unos chetos de Rada Tilly se afanaron la Jilux roja. Está en el Puerto.
3. **Choripán Drive-Thru**: el pedido más largo de la historia del Chori del Viento... y un tiroteo en la Costanera.
4. **Cobrar el bono**: llevá al Petroca al yacimiento de Pampa del Castillo en pleno temporal de viento.
5. **El trapo del Lobo**: recuperá la bandera de la hinchada de Newbery antes del clásico con Huracán.
6. **La cisterna de Don Crudo**: robá el camión con los permisos truchos para perforar en La Madriguera y tiralo al mar.
7. **Tenpesos, final del recorrido**: la persecución final.

## El mapa

Comodoro Rivadavia de verdad: **las calles, la costa, los barrios, las plazas, las canchas y los lugares conocidos salen de OpenStreetMap**, y el relieve (el Chenque, las lomas de los barrios, la meseta) sale de un modelo de elevación real. Para que se pueda recorrer, el mapa está comprimido en los tramos vacíos entre barrios (sobre todo por la Ruta 3), pero dentro de cada barrio las cuadras mantienen su forma y sus nombres.

Están el Centro con la Catedral, la plaza San Martín, la Terminal y los edificios altos; la Costanera y el Puerto con el Muelle; el Cerro Chenque con las antenas; Km 3 con el Museo del Petróleo; Km 5, Km 8 y Caleta Córdova hacia el norte; Pietrobelli, Jorge Newbery con **La Madriguera** (en 2004 todavía de tierra), Juan XXIII, 9 de Julio y los demás barrios; Rada Tilly con la playa; Punta del Marqués con la lobería; el Aeropuerto, el parque eólico y los yacimientos de la meseta.

**Cada casa y cada edificio está en su lugar real**: son unas 40.000 huellas de edificios (el relevamiento satelital de Microsoft, más los edificios cargados en OpenStreetMap), cada una orientada con el frente a su calle. En los barrios son casas de una o dos plantas con techo de chapa o losa (y las casas blancas de techo rojo de los kilómetros de YPF); en el Centro, edificación entre medianeras con locales en planta baja (kioscos, farmacias, locutorios, videoclubs...) y torres de hasta 19 pisos; en los parques industriales, galpones. Donde OSM tiene cargados los pisos o el tipo de edificio (escuelas, iglesias, depósitos), se respetan.

El radar y el mapa de pausa se dibujan con las mismas calles y las huellas reales de los edificios, y muestran el nombre del barrio en el que estás.

## Lo que tiene de San Andreas

- Caminar, correr, saltar, nadar, pelear y disparar (puños, clavas de malabar, bate, pistola, escopeta, Uzi), con apuntado libre y autoapuntado.
- 15 vehículos: Fitito 600, Renó 12, Falcón, Pijó 504, Gool, Fiaz Duna, Toyoda Jilux, chata de empresa (con el banderín naranja), Forz F-100, remís, patrullero, colectivo, camión cisterna, BMX y moto enduro. Se rompen, echan humo, se prenden fuego y explotan.
- Tránsito que circula por la derecha y respeta el semáforo, peatones que reaccionan, pandillas (chetos de Rada Tilly, caletas en el Km 8, los pibes del Lobo en el barrio).
- Nivel de búsqueda de 1 a 6 estrellas, patrulleros que persiguen, arrestos y helicóptero.
- HUD como el original: reloj, plata en verde, vida, chaleco, arma, estrellas, radar redondo que rota, nombre de la zona y del vehículo.
- Ciclo de día y noche (1 segundo = 1 minuto), clima y el **viento de Comodoro**: polvo, bolsas volando y temporales que empujan los autos.
- 7 radios con música procedural: cumbia villera, rock nacional, boliche, chacarera, tango, radio AM de charla y apagada. La AM es un homenaje a **La Ciudad Perdida**, el programa de **Santiago Sánchez** (los textos son ficción escrita en homenaje).
- Con 4 estrellas o más suena **Novishok** en la persecución (ver *Intro y música*).
- Actividades: malabares en el semáforo (minijuego de ritmo), remisero (subite a un remís y apretá 2), comida, gimnasio, armería, Chapa y Pintura de Don Tito, 24 bolsitas de La Anómala para juntar y 6 saltos únicos.
- Guardado en la Casa de la Abuela, estadísticas, mapa con destino marcable y filtro "PS2" con estela.

## Intro y música

Desde el menú, **Intro y música**:

- **Video de intro**: subí el video (MP4 o WebM, hasta 20 MB), por ejemplo el de "GTA Comodoro Rivadavia", y se reproduce con audio cada vez que abrís el juego.
- **Novishok**: subí los temas y suenan cuando la cana te persigue con 4 estrellas o más. Si no hay temas cargados, suena un thrash generado por el juego.

En la versión publicada en claude.ai los archivos quedan guardados en el artifact y los ve todo el que abre el link (solo quien lo edita puede subirlos). Abriendo el juego desde el repo, se usa `media/intro.mp4` si existe, y lo que subas queda guardado en tu navegador.

## Rendimiento

El mapa entero tiene unas 18.000 casas, miles de postes, árboles y bombas de petróleo, así que el juego dibuja solo lo que se ve:

- casas, postes, árboles y props agrupados por sector (el navegador descarta los que quedan fuera de cámara) y apagados más allá de la niebla;
- terreno en mosaicos con dos niveles de detalle;
- agua detallada solo en la orilla;
- resolución dinámica: si la máquina no llega a ~30 cuadros por segundo, baja la resolución de a poco y la vuelve a subir cuando sobra.

En una vista típica se dibujan entre 250.000 y 450.000 triángulos. Si anda lento, bajá **Calidad de imagen** en Opciones o apagá las sombras.

## Controles

| Acción | Teclado y mouse |
|---|---|
| Moverse / manejar | W A S D o flechas |
| Cámara | Mouse (clic para capturarlo) |
| Correr / freno de mano | Espacio |
| Saltar | Shift |
| Subir / bajar | F o Enter |
| Golpear / disparar | Clic izquierdo o Ctrl |
| Apuntar | Clic derecho |
| Cambiar arma | Q / E o ruedita |
| Bocina / sirena | H |
| Radio | R o ruedita manejando |
| Cambiar de personaje | TAB |
| Pausa y mapa | Esc |

También anda con joystick y con pantalla táctil.

## Trucos

Se escriben durante el juego: `HESOYAM`, `AEZAKMI`, `ASNAEB`, `OSRBLHH`, `LXGIWYL`, `BTCDBCB` (Gordopin XXL), `KVGYZQK`, `JYSDSOD`, `XJVSNAJ`, `CPKTNWT`, y los locales `BUENAPETROCA`, `VIENTOBLANCO`, `AGUANTENEWBERY`, `CHORIPAN`, `REMISERO`, `PATRULLERO`, `CISTERNA`, `ENDURO` y `FITITO`.

## Aclaración

Es un juego de fans, gratis y sin fines de lucro, inspirado en *Grand Theft Auto: San Andreas* (Rockstar Games, 2004). No está afiliado a Rockstar. Los personajes, empresas y situaciones son ficticios o paródicos, y el Gordopin y el Petroca aparecen como homenaje cariñoso a dos personajes de la cultura comodorense. Todo el arte y el sonido se generan con código.

Datos del mapa © colaboradores de [OpenStreetMap](https://www.openstreetmap.org/copyright), bajo licencia ODbL. Huellas de edificios: [Microsoft Global ML Building Footprints](https://github.com/microsoft/GlobalMLBuildingFootprints), bajo licencia ODbL. Relieve: Terrain Tiles de Mapzen en AWS (SRTM y otras fuentes).

## Estructura del código

```
src/
  main.js            arranque y pantalla de carga
  game/              bucle principal, jugador, cámara, IA, tránsito, policía, misiones, actividades
  world/             datos del mapa, terreno, calles, ciudad, props, cielo y clima
  entities/          personajes y vehículos
  render/            texturas procedurales, partículas y filtro PS2
  audio/             efectos y radios sintetizadas con WebAudio
  ui/                HUD, menús, controles táctiles y entrada
scripts/build.mjs    compilación con esbuild
tools/mapa/          descarga de OpenStreetMap y del relieve, y armado de src/world/comodoro-data.js
```

## Regenerar el mapa

Hace falta Python 3 con `shapely`, `numpy` y `pillow`.

```bash
bash tools/mapa/descargar.sh                      # baja OSM (Overpass) y el relieve a tools/mapa/cache/
python3 tools/mapa/build_map.py tools/mapa/cache src/world/comodoro-data.js
python3 tools/mapa/preview.py src/world/comodoro-data.js mapa.png   # vista previa en PNG
npm run build
```

`build_map.py` endereza la costa, comprime los tramos vacíos, une las avenidas de doble mano, simplifica las rotondas, arma los barrios y guarda todo comprimido (unos 420 KB).
