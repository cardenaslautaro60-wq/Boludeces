// Luz realista sobre la estética PS2 (versión compacta): cielo físico con nubes, sol con
// exposición de cámara, reflejos del cielo, agua que refleja, resplandor y faroles que
// iluminan la vereda. Las texturas siguen siendo las de la PS2 (no carga las fotos).
import { STYLE } from './style.js';
import { RealPost, RealSky, setupRealRenderer } from './realista.js';
import { waterMaterial } from './real/materials.js';

STYLE.luz = true;
STYLE.variante = 'compacto';
STYLE.RealPost = RealPost;
STYLE.RealSky = RealSky;
STYLE.setupRenderer = setupRealRenderer;
STYLE.waterMaterial = waterMaterial;
