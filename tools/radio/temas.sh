#!/bin/sh
# Recomprime un tema para la radio del juego: 96 kbps, volumen parejo, sin etiquetas.
# Uso: sh tools/radio/temas.sh "ruta/al/tema.mp3" media/radio/rock-local/nombre.mp3
# Después anotalo en src/audio/radio-temas.js
set -e
ffmpeg -v error -y -i "$1" -map 0:a:0 -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 -ac 2 -b:a 96k -map_metadata -1 "$2"
