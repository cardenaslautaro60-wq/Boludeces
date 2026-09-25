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

Versión libre y comprimida de Comodoro Rivadavia: Cerro Chenque con sus antenas y la Ruta 3 por la costa, el Centro con la Catedral, la Terminal y la Torre Crudo, la Costanera, el Puerto con el Muelle de Ultramar, Km 3 (con el Museo del Petróleo y la torre del Pozo N°2), Km 5, Km 8, Caleta Córdova, el Aeropuerto, los barrios Pietrobelli, Juan XXIII, 9 de Julio (con **La Madriguera**, que en 2004 todavía era de tierra), 30 de Octubre, Industrial y Pueyrredón, Rada Tilly, Punta del Marqués con la lobería, y la meseta de Pampa del Castillo con cigüeñas por todos lados y el parque eólico.

## Lo que tiene de San Andreas

- Caminar, correr, saltar, nadar, pelear y disparar (puños, clavas de malabar, bate, pistola, escopeta, Uzi), con apuntado libre y autoapuntado.
- 15 vehículos: Fitito 600, Renó 12, Falcón, Pijó 504, Gool, Fiaz Duna, Toyoda Jilux, chata de empresa (con el banderín naranja), Forz F-100, remís, patrullero, colectivo, camión cisterna, BMX y moto enduro. Se rompen, echan humo, se prenden fuego y explotan.
- Tránsito que circula por la derecha y respeta el semáforo, peatones que reaccionan, pandillas (chetos de Rada Tilly, caletas en el Km 8, los pibes del Lobo en el barrio).
- Nivel de búsqueda de 1 a 6 estrellas, patrulleros que persiguen, arrestos y helicóptero.
- HUD como el original: reloj, plata en verde, vida, chaleco, arma, estrellas, radar redondo que rota, nombre de la zona y del vehículo.
- Ciclo de día y noche (1 segundo = 1 minuto), clima y el **viento de Comodoro**: polvo, bolsas volando y temporales que empujan los autos.
- 7 radios con música procedural: cumbia villera, rock nacional, boliche, chacarera, tango, radio AM de charla y apagada.
- Actividades: malabares en el semáforo (minijuego de ritmo), remisero (subite a un remís y apretá 2), comida, gimnasio, armería, Chapa y Pintura de Don Tito, 24 bolsitas de La Anómala para juntar y 6 saltos únicos.
- Guardado en la Casa de la Abuela, estadísticas, mapa con destino marcable y filtro "PS2" con estela.

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
```
