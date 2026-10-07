# 🎣 Isla Anzuelo

Juego de pesca **3D de mundo abierto**, con jefes, casino, un segundo nivel con armas y **multijugador cooperativo**.
Es un proyecto aparte: vive entero dentro de `pesca/` y no comparte código ni dependencias con el resto del repositorio
(el juego GTA de la raíz). No hace falta instalar nada para jugarlo.

Naufragás en una isla chica. Pescás, vendés, mejorás la caña, comprás un bote, te animás a los jefes, cruzás el mar hasta la
**Isla Arsenal** (Nivel 2) y, si te sobra plata, la tirás en el casino.

## Cómo jugarlo

| Cómo | Qué hacer |
|---|---|
| Solo, sin servidor | Abrí `pesca/dist/isla-anzuelo.html` en el navegador (es una sola página con todo adentro). |
| Con amigos | `node pesca/servidor.mjs` y entrá a `http://localhost:8787` (ver [Multijugador](#multijugador)). |
| Publicado como Artifact | La misma página se publica en Claude: el multijugador usa el canal `room` de la plataforma. |

La partida se guarda sola en el navegador (`localStorage`, clave `isla-anzuelo-v1`). En el menú de pausa podés guardar a mano
y desde el título podés empezar de nuevo (pide un segundo clic para confirmar).

### Controles

| Teclado y mouse | Acción |
|---|---|
| `W A S D` · mouse | moverse · mirar (también para navegar el bote) |
| clic | usar la herramienta en mano: lanzar, clavar, recoger, disparar |
| `Espacio` | saltar · mantener para recoger la línea |
| `Shift` · `V` | correr · rodar para esquivar |
| clic derecho · `Q` | arpón · dinamita |
| `1`–`5` | caña · arpón · red · dinamita · arma (el 5 aparece en el Nivel 2) |
| `R` | recargar |
| `E` | entrar a los lugares, subir y bajar del bote, hablar |
| `F` · `H` · `B` | comer · curarse · armar carnada de jefe |
| `I` · `C` · `M` | mochila · bitácora · mapa |
| `T` · `G` · `Tab` | chat · emotes · lista de jugadores |
| `Esc` | menú de pausa y ayuda |

En el celular hay joystick, arrastre para mirar y botones grandes (lanzar/clavar/recoger, arpón, dinamita, arma, saltar, rodar, `E`).

## De qué va

- **Pesca:** apuntás al agua, lanzás, esperás el pique, clavás y peleás con la tensión de la línea. Los peces se ven como
  **sombras** bajo el agua; cuanto más hondo, más tenues. Hay 4 zonas según la distancia a la costa (Orilla, Arrecife, Mar
  Abierto y Abismo), 35 especies de peces y criaturas, además de basura, botellas con mensaje y cofres con tesoro.
- **Plata:** cada pez y criatura se vende en la pescadería. Los precios cambian cada día y bajan si vendés mucho de lo mismo.
- **Mejoras:** 7 cañas (de Bambú a La Leviatana), partes (carretel, línea, anzuelo, señuelo), arpones, redes, mochilas, ropa y
  3 botes. Con el bote el mundo se abre: islotes, un naufragio, cofres y mar profundo (cada bote aguanta hasta cierta distancia).
- **Herramientas:** comer y curarte (el hambre baja y la vida también), cazar peces con arpón y red, y dinamita.
- **Jefes marinos:** Don Pinza, El Matungo, La Relámpago, Doña Tentácula y El Leviatán (solo de noche). Se atraen con carnada de
  jefe, atacan con **zonas rojas telegrafiadas** que hay que esquivar, se aturden y entran en fases. Los vencés con arpón y
  dinamita, los remolcás hasta la pescadería y los **vendés**.
- **Casino «El Anzuelo de Oro»:** tragamonedas con pozo progresivo, ruleta europea, veintiuno, doble o nada y carreras de
  peces. Es plata de mentira y la casa siempre gana un poquito más seguido.
- **Misiones y bitácora:** una cadena de misiones guía el progreso; la bitácora lleva la cuenta de lo pescado y de los jefes.

### Nivel 2: Isla Arsenal

Una isla más allá del mar abierto, **solo se llega en lancha o en pesquero** (el bote a remo no aguanta tanta distancia).
Ahí encontrás:

- La **armería del Sargento Roca**: rifle de caza y escopeta de caño, con su munición.
- **Jefes de tierra** que se pelean con armas, arpón y dinamita: **Don Gorila** (la selva), **La Reina Escorpión** (el pedregal)
  y **Draco**, el dragón del volcán. Cada uno suelta botín y se vende.
- Dos armas que **solo se consiguen venciendo** a un jefe: el subfusil Ráfaga (Escorpión) y el lanzacohetes Ballena (Draco).
- Cofres con munición y un volcán para explorar.

## Multijugador

Cooperativo y en línea: el mundo es el mismo para todos (está generado de forma determinista), así que **se ven, se oyen y pelean
juntos**.

- **Se ven:** avatares con nombre y color de camisa, bote, caña, arma y animaciones; aparecen en el mapa y en el minimapa.
- **Chat y emotes:** `T` abre el chat (burbujas sobre la cabeza) y `G` los emotes.
- **Hora y clima compartidos:** manda el anfitrión; dormir no cambia la hora en una sala compartida.
- **Jefes compartidos:** el jugador de id más bajo es el **anfitrión** y simula a los jefes; los demás aplican lo que publica,
  ven los mismos ataques y cada uno **esquiva los suyos**. Cualquiera puede cebar, pescar y atacar al mismo jefe. Los jefes
  tienen más vida cuanta más gente pelea (+65 % por jugador extra cerca) y **cada jugador que aportó al menos el 3 % del daño cobra
  su propio botín**. Quien no peleó, no cobra.
- **Si el anfitrión se va**, el siguiente toma el mando sin cortar la pelea; quien entra tarde recibe el estado actual.
- Las partidas siguen siendo **individuales**: plata, mochila y progreso son de cada uno y se guardan en su navegador.

### Tres formas de conectarse

1. **Artifact de Claude (canal `room`).** Es lo que usa la página publicada. Al publicarla hay que declarar
   `capabilities: { room: { topics: { chat: 'interact', emo: 'interact' } } }`. Solo entran los miembros con sesión iniciada de la
   organización o los invitados con acceso a la página; quien la abre por un enlace público juega solo. La posición, los
   jefes y el resto viajan como *presencia* (tolera cortes); solo el chat y los emotes son eventos.
2. **Servidor propio (WebSocket).** `node pesca/servidor.mjs` sirve el juego y reenvía los mensajes de cada sala. No tiene
   dependencias y no decide nada del juego.

   ```
   node pesca/servidor.mjs                  # http://localhost:8787 (sirve pesca/index.html)
   node pesca/servidor.mjs --dist           # sirve el juego ya armado (pesca/dist/isla-anzuelo.html)
   node pesca/servidor.mjs -p 9000 --host 0.0.0.0
   ```

   Para jugar por internet el puerto tiene que ser alcanzable (reenvío de puertos o un túnel tipo cloudflared / ngrok). Todos los
   que entren a la misma dirección y el mismo código de sala comparten la isla. Hasta 16 jugadores por sala.
3. **Pestañas del mismo navegador (BroadcastChannel).** Sirve para probar: abrí el juego en dos pestañas con el mismo código de
   sala (`?red=bc&sala=prueba`).

En el título, el bloque «En línea» elige el nombre, el color de la camisa y un **código de sala** opcional (con código jugás solo con
quien lo conozca). Se puede entrar y salir de la sala desde el menú de pausa.

## Para desarrollar

```
node pesca/build.mjs                       # arma pesca/dist/isla-anzuelo.html (Three.js + código + estilos en una sola página)
node pesca/build.mjs --artifact=ruta.html  # además, un fragmento sin <html>/<head> para publicar como Artifact
node pesca/servidor.mjs                    # servidor de desarrollo con multijugador
```

`build.mjs` empaqueta Three.js (r186) con esbuild como global `THREE`; el resto son scripts clásicos que se cargan en el orden de
`pesca/index.html` y comparten el espacio global (por eso **no puede haber dos nombres de nivel superior repetidos** entre
archivos). En desarrollo se abre `pesca/index.html` servido por HTTP (por ejemplo con `servidor.mjs`); `node pesca/build.mjs` deja
el resultado en `pesca/dist/`.

```
pesca/
├─ index.html          orden de carga de los scripts
├─ build.mjs           empaquetador
├─ servidor.mjs        servidor estático + relay WebSocket (multijugador)
├─ build/ · dist/      Three.js empaquetado · página final lista para jugar
├─ vendor/             punto de entrada de Three.js
└─ src/
   ├─ data.js          todo el contenido: especies, jefes, cañas, armas, botes, comida…
   ├─ world.js · terrain.js · sea.js · sky.js · edificios.js · arsenal3d.js   el mundo (islas, mar, cielo, edificios)
   ├─ models.js · art-fish.js · fish3d.js · creatures.js · personas.js        modelos 3D de personajes, peces y criaturas
   ├─ player.js · input.js · fishing.js · fight.js · tools.js · armas.js · botes.js   jugador, pesca y herramientas
   ├─ boss.js · boss-tierra.js   jefes marinos y de tierra (ataques, fases, botín)
   ├─ hud.js · panels.js · missions.js · save.js · audio.js · fx.js           interfaz, menús, misiones, guardado, sonido
   ├─ casino-logica.js · casino.js   las matemáticas de los juegos y su interfaz
   ├─ red.js · jugadores.js · red-jefes.js   multijugador: transporte, avatares/chat y sincronización de jefes
   └─ main.js            arranque y bucle principal
```

El mundo es **determinista** (misma isla, mismos jefes y mismo terreno para todos los jugadores): por eso el multijugador solo
tiene que compartir posiciones y estados, no el mapa. Unidad: 1 unidad = 1 metro, `y` hacia arriba, el norte es `−z`.

## Qué se probó y qué no

Se probó con Chromium sin cabeza (Playwright, con renderizado por software): el flujo completo de un jugador, los 8 jefes (los 40
ataques corren sin errores), la economía, el casino, la interfaz en escritorio y en celular, y el multijugador con varias
pestañas por BroadcastChannel y por el servidor WebSocket (incluidos jefes compartidos, botín, anfitrión que se va y entrada
tardía). El canal `room` de la plataforma se probó contra un reemplazo simulado que respeta su interfaz y sus límites; **no se pudo
probar con espectadores reales dentro de Claude**.
