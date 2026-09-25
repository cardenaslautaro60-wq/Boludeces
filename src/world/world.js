import * as THREE from 'three';
import { Terrain, buildWater, coastX } from './terrain.js';
import { RoadNetwork } from './roads.js';
import { City } from './city.js';
import { Props } from './props.js';
import { StaticColliders } from './collision.js';
import { makeTextures } from '../render/textures.js';
import { GRIDS, FLATS, ZONES, WORLD } from './mapdata.js';

const nextFrame = () => new Promise((r) => setTimeout(r, 0));

export class World {
  constructor(game) {
    this.game = game;
  }

  async build(progress = () => {}) {
    const g = this.game;
    progress(0.05, 'Levantando la meseta...');
    await nextFrame();
    const terrain = new Terrain();
    progress(0.15, 'Trazando la Ruta 3...');
    await nextFrame();
    const roads = new RoadNetwork();
    const flat = roads.computeHeights(terrain);
    terrain.flattenRoads(flat);
    terrain.buildRamps();
    roads.buildMask(WORLD);
    for (const n of roads.nodes) n.h = terrain.heightAt(n.x, n.z);
    g.terrain = terrain;
    g.roads = roads;
    progress(0.25, 'Pintando la estepa...');
    await nextFrame();
    const textures = makeTextures();
    g.textures = textures;
    const urban = (x, z) => GRIDS.some((gr) => x >= gr.x0 && x <= gr.x0 + gr.cols * gr.px && z >= gr.z0 && z <= gr.z0 + gr.rows * gr.pz)
      || FLATS.some((f) => x > f.x0 && x < f.x1 && z > f.z0 && z < f.z1);
    this.terrainMesh = terrain.buildMesh(urban);
    g.scene.add(this.terrainMesh);
    this.water = buildWater(terrain);
    g.scene.add(this.water);
    progress(0.4, 'Asfaltando calles...');
    await nextFrame();
    this.roadMesh = roads.buildMeshes(terrain, textures);
    g.scene.add(this.roadMesh);
    progress(0.5, 'Construyendo el Centro...');
    await nextFrame();
    const colliders = new StaticColliders();
    g.colliders = colliders;
    const city = new City();
    g.city = city;
    city.build(terrain, roads, textures, colliders, g.scene);
    progress(0.7, 'Instalando cigüeñas...');
    await nextFrame();
    const props = new Props();
    g.props = props;
    props.build(g);
    // Paredes invisibles en el borde del mapa
    progress(0.8, 'Soplando el viento...');
    await nextFrame();
    this.zoneCache = { x: 1e9, z: 1e9, name: '' };
  }

  zoneAt(x, z) {
    const t = this.game.terrain;
    if (t && t.heightAt(x, z) < -1.5 && x > coastX(z) - 5) return 'Golfo San Jorge';
    for (const zn of ZONES) {
      if (zn.rect) {
        const [x0, x1, z0, z1] = zn.rect;
        if (x >= x0 && x <= x1 && z >= z0 && z <= z1) return zn.name;
      } else if (zn.ellipse) {
        const [cx, cz, rx, rz] = zn.ellipse;
        if (((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 <= 1) return zn.name;
      }
    }
    return 'Comodoro Rivadavia';
  }

  // Altura para los pies de un personaje (incluye veredas)
  footGround(x, z) {
    const g = this.game;
    return g.terrain.groundAt(x, z) + g.city.curbAt(x, z);
  }
}

export { THREE };
