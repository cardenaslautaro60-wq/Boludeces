# Texturas de la versión realista

Las texturas de `src/render/real/` son de [Poly Haven](https://polyhaven.com) y tienen licencia
[CC0](https://polyhaven.com/license) (dominio público). Se bajan y reducen con
`python3 tools/realista/texturas.py`.

| Clave | Textura de Poly Haven |
|---|---|
| asfalto | asphalt_02 |
| ripio | gravel_road |
| vereda | concrete_pavement_02 |
| estepa | withered_grass |
| tierra | dry_ground_rocks |
| roca | aerial_ground_rock |
| arena | coast_sand_01 |
| arenah | damp_beach_sand |
| pasto | leafy_grass |
| cancha | park_dirt |
| revoque | white_plaster_rough_01 |
| revoque2 | painted_plaster_wall |
| ladrillo | brick_wall_02 |
| hormigon | concrete_wall_004 |
| chapa | corrugated_iron |
| chapavieja | rusty_corrugated_iron |
| tejas | clay_roof_tiles |
| metal | rusty_metal_sheet |
| madera | wood_planks_grey |

# Personajes de la versión realista

El cuerpo, los ojos, las cejas, los peinados y la barba (`src/render/real/humano.bin`,
`piel_*.webp`, `ojo_c.webp`, `pelo_*.webp`) salen de **Universal Base Characters** de
[Quaternius](https://quaternius.com), licencia [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
Se convierten con `python3 tools/realista/personajes.py <zip de la versión Standard>`, que además
los engancha a los 17 huesos del juego.
