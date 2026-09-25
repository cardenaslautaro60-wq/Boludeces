// Biblioteca de medios del jugador: video de intro y temas de Novishok para las persecuciones.
// - En la página publicada (Artifact): los archivos se suben al almacén del artifact (assets)
//   y la lista se guarda en su base de datos (db), así todos los que abren el juego los ven.
// - Abriendo el juego desde el repo: se usan media/intro.mp4 y media/medios.js si existen,
//   y lo que se suba desde el juego queda guardado en este navegador (IndexedDB).

const DOC = 'media/config';
const IDB = 'gtasj-media';

function idbOpen() {
  return new Promise((resolve, reject) => {
    try {
      const r = indexedDB.open(IDB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore('files');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    } catch (e) { reject(e); }
  });
}
function idbReq(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', mode);
    const st = tx.objectStore('files');
    const q = fn(st);
    tx.oncomplete = () => resolve(q && q.result);
    tx.onerror = () => reject(tx.error);
  });
}

// Tipos que acepta el almacén del artifact para cada archivo
function assetType(file, kind) {
  const t = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  if (t === 'video/mp4' || t === 'video/webm') return t;
  if (t.includes('webm') || name.endsWith('.webm') || name.endsWith('.weba') || name.endsWith('.opus')) return 'video/webm';
  // audio m4a/aac/mp3 y videos .mov/.m4v: el navegador reconoce el contenido al reproducir
  void kind;
  return 'video/mp4';
}

export class MediaLibrary {
  constructor() {
    this.mode = 'none';
    this.config = { intro: null, songs: [] };
    this.localUrls = [];
    this.listeners = [];
    this.repo = { intro: null, songs: [] };
  }

  onChange(fn) { this.listeners.push(fn); }
  emit() { for (const f of this.listeners) try { f(this); } catch (e) { /* nada */ } }

  async init() {
    const C = window.claude;
    if (C && typeof C.use === 'function') {
      try {
        const [db, assets] = await Promise.all([C.use('db'), C.use('assets')]);
        if (db) {
          this.mode = 'artifact';
          this.db = db;
          this.assets = assets; // null si quien mira no puede editar
          await new Promise((resolve) => {
            let first = true;
            this.unsub = db.doc(DOC).onSnapshot((snap) => {
              const d = snap.exists ? snap.data() : null;
              this.config = {
                intro: d && d.intro ? { ...d.intro } : null,
                songs: d && Array.isArray(d.songs) ? d.songs.map((s) => ({ ...s })) : [],
              };
              this.emit();
              if (first) { first = false; resolve(); }
            }, () => { if (first) { first = false; resolve(); } });
            setTimeout(() => { if (first) { first = false; resolve(); } }, 4000);
          });
          return;
        }
      } catch (e) { /* sin capacidades: modo local */ }
    }
    this.mode = 'local';
    await this.loadRepoMedia();
    await this.loadLocal();
  }

  // Archivos que vienen en la carpeta media/ del repo
  async loadRepoMedia() {
    const probe = (src) => new Promise((resolve) => {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.muted = true;
      const done = (ok) => { v.removeAttribute('src'); v.load(); resolve(ok); };
      v.onloadedmetadata = () => done(true);
      v.onerror = () => done(false);
      setTimeout(() => done(false), 2500);
      v.src = src;
    });
    if (location.protocol === 'file:' || location.protocol.startsWith('http')) {
      const iv = window.INTRO_VIDEO;
      if (iv && await probe(iv)) this.repo.intro = { url: iv, name: iv.split('/').pop() };
      const list = window.NOVISHOK_TEMAS;
      if (Array.isArray(list)) this.repo.songs = list.map((s) => ({ url: 'media/novishok/' + s.archivo, title: s.titulo || s.archivo }));
    }
  }

  async loadLocal() {
    try {
      this.idb = await idbOpen();
      const cfg = await idbReq(this.idb, 'readonly', (st) => st.get('config'));
      this.config = cfg || { intro: null, songs: [] };
      for (const u of this.localUrls) URL.revokeObjectURL(u);
      this.localUrls = [];
      this.blobUrls = {};
      const ids = [this.config.intro && this.config.intro.id, ...this.config.songs.map((s) => s.id)].filter(Boolean);
      for (const id of ids) {
        const blob = await idbReq(this.idb, 'readonly', (st) => st.get(id));
        if (blob) { const u = URL.createObjectURL(blob); this.blobUrls[id] = u; this.localUrls.push(u); }
      }
    } catch (e) { this.idb = null; }
    this.emit();
  }

  async saveLocalConfig() {
    await idbReq(this.idb, 'readwrite', (st) => st.put(this.config, 'config'));
  }

  canUpload() { return (this.mode === 'artifact' && !!this.assets) || (this.mode === 'local' && !!this.idb); }

  urlFor(item) {
    if (!item) return null;
    if (this.mode === 'artifact') return item.asset ? '/_blob/' + item.asset : null;
    return this.blobUrls && this.blobUrls[item.id] ? this.blobUrls[item.id] : null;
  }

  intro() {
    const u = this.urlFor(this.config.intro);
    if (u) return { url: u, name: this.config.intro.name };
    return this.repo.intro;
  }

  songs() {
    const own = this.config.songs.map((s) => ({ url: this.urlFor(s), title: s.title, id: s.id || s.asset })).filter((s) => s.url);
    return own.length ? own : this.repo.songs;
  }

  async upload(file, kind) {
    if (this.mode === 'artifact') {
      if (!this.assets) throw { code: 'not_granted', message: 'Solo quien edita el juego puede subir archivos.' };
      const res = await this.assets.upload(file, { type: assetType(file, kind) });
      return { asset: res.id, name: file.name, size: res.sizeBytes };
    }
    const id = 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    await idbReq(this.idb, 'readwrite', (st) => st.put(file, id));
    return { id, name: file.name, size: file.size };
  }

  async writeConfig() {
    if (this.mode === 'artifact') await this.db.doc(DOC).set({ intro: this.config.intro, songs: this.config.songs, updated: new Date().toISOString() });
    else { await this.saveLocalConfig(); await this.loadLocal(); }
  }

  async setIntro(file) {
    const old = this.config.intro;
    const item = await this.upload(file, 'video');
    this.config.intro = item;
    await this.writeConfig();
    await this.forget(old);
    this.emit();
  }

  async removeIntro() {
    const old = this.config.intro;
    this.config.intro = null;
    await this.writeConfig();
    await this.forget(old);
    this.emit();
  }

  async addSong(file, title) {
    const item = await this.upload(file, 'audio');
    item.title = (title || file.name.replace(/\.[^.]+$/, '')).slice(0, 80);
    this.config.songs = [...this.config.songs, item];
    await this.writeConfig();
    this.emit();
  }

  async removeSong(i) {
    const old = this.config.songs[i];
    this.config.songs = this.config.songs.filter((_, k) => k !== i);
    await this.writeConfig();
    await this.forget(old);
    this.emit();
  }

  // Borra el archivo que ya no apunta ninguna entrada
  async forget(item) {
    if (!item) return;
    try {
      if (this.mode === 'artifact' && item.asset && this.assets) await this.assets.delete(item.asset);
      if (this.mode === 'local' && item.id && this.idb) await idbReq(this.idb, 'readwrite', (st) => st.delete(item.id));
    } catch (e) { /* el archivo puede no existir */ }
  }
}

export function mediaErrorText(e) {
  const c = e && e.code;
  if (c === 'too_large') return 'El archivo pesa más de 20 MB. Comprimilo y probá de nuevo.';
  if (c === 'unsupported_type') return 'Ese formato no se puede subir. Usá MP4 o WebM (para música también sirve M4A).';
  if (c === 'quota_or_state') return 'Se llenó el espacio del juego. Borrá algún archivo y probá de nuevo.';
  if (c === 'rate_limited') return 'Esperá unos segundos y probá de nuevo.';
  if (c === 'not_granted') return 'Solo quien edita el juego puede subir archivos.';
  if (c === 'invalid_argument') return 'No tenés permiso para cambiar los medios de este juego.';
  return 'No se pudo subir el archivo. Probá de nuevo en un rato.';
}
