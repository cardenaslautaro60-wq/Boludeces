// Temas reales de las radios "Rock Local" y "Urbano" (los MP3 que pasó Nicolás).
// Los archivos están en media/radio/<género>/ (recomprimidos a 96 kbps por tools/radio/temas.sh)
// y no van adentro de la página: se cargan al lado, así la página no pesa de más.
// Para sumar un tema: copialo con tools/radio/temas.sh y anotalo acá.
export const RADIO_TEMAS = {
  'rock-local': [
    { archivo: 'rock-local/escampar-pasaras.mp3', titulo: 'Escampar — Pasarás' },
    { archivo: 'rock-local/al-700-mix.mp3', titulo: 'Aerosol — Al 700 (mix)' },
    { archivo: 'rock-local/tema-wa0037.mp3', titulo: 'Escampar' },
  ],
  urbano: [
    { archivo: 'urbano/lexx-en-el-party.mp3', titulo: 'Lexx — En el Party (RKT romántico)' },
  ],
};

// Dónde buscar los archivos: al lado de la página (index.html y la versión publicada)
// o una carpeta más arriba (las páginas de dist/)
export const RADIO_BASES = ['media/radio/', '../media/radio/'];
