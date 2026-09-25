#!/usr/bin/env python3
"""Genera las voces grabadas del juego (radio, anuncios, gente para hablar, misiones y la calle).

Voz base: Piper es_AR "daniela" (castellano rioplatense; datos OpenSLR 61, CC BY-SA 4.0).
Cada personaje sale de esa voz cambiando tono, formantes y velocidad con Praat (parselmouth),
así todos hablan con acento de acá. La radio pasa además por un filtro de banda de AM.
No imita la voz de ninguna persona real.

Salida: src/audio/voces.bin (MP3 mono de 16 kHz, uno detrás de otro) y src/audio/voces.json
(clave -> [inicio, largo, duración]).

Uso:
  pip install piper-tts praat-parselmouth soundfile numpy
  node tools/voz/lineas.mjs > /tmp/lineas.json
  python3 tools/voz/generar.py /tmp/lineas.json carpeta/con/es_AR-daniela-high.onnx
"""
import io
import json
import os
import re
import sys
import wave

import numpy as np
import parselmouth
import soundfile as sf
from parselmouth.praat import call
from piper import PiperVoice
from piper.config import SynthesisConfig

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'audio')
LINES = json.load(open(sys.argv[1]))
MODEL = sys.argv[2]

# formantes (1 = sin cambio), tono medio en Hz (0 = sin cambio), rango de tono, duración, radio
VOICES = {
    'santiago': (0.85, 110, 1.0, 0.97, True),
    'locutora': (1.0, 0, 1.0, 0.98, True),
    'narrador': (1.0, 0, 0.9, 1.06, False),
    'gordopin': (0.88, 128, 1.1, 1.0, False),
    'petroca': (0.84, 102, 0.9, 1.0, False),
    'tenpesos': (0.82, 92, 0.8, 1.05, False),
    'cacho': (0.85, 115, 1.0, 1.0, False),
    'chino': (0.87, 125, 1.0, 0.98, False),
    'choripanero': (0.83, 98, 1.1, 0.98, False),
    'canillita': (0.88, 132, 1.2, 0.97, False),
    'viejo': (0.84, 100, 0.85, 1.12, False),
    'rosa': (1.0, 172, 0.8, 1.1, False),
    'petrolero': (0.85, 108, 1.0, 1.0, False),
    'barra': (0.87, 138, 1.3, 0.95, False),
    'vecino': (0.86, 118, 1.0, 1.0, False),
    'cana': (0.84, 104, 0.9, 1.0, False),
    'cheto': (0.9, 135, 1.2, 1.0, False),
    'pulenta': (0.86, 120, 1.0, 1.0, False),
    'nahuel': (0.9, 142, 1.1, 0.98, False),
}

voice = PiperVoice.load(MODEL)
SR = 16000


# cómo se dicen algunas cosas de acá
SAY = [(r'\bKm\b', 'Kilómetro'), (r'Newbery', 'Niúberi'), (r'Tilly', 'Tili'), (r'\bYPF\b', 'i pe efe'), (r'\bbolú\b', 'bolú'),
       (r'SUPERSALTO', 'súper salto'), (r'PETRODOLARES', 'petrodólares'), (r'BALASINFINITAS', 'balas infinitas'), (r'VIENTAZO', 'vientazo'),
       (r'NEVADA', 'nevada'), (r'CHENQUE', 'Chenque')]


def speakable(text):
    for a, b in SAY:
        text = re.sub(a, b, text)
    return text


def synth(text, length):
    text = speakable(text)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        voice.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=length, noise_scale=0.6, noise_w_scale=0.7))
    buf.seek(0)
    d, sr = sf.read(buf)
    return d.astype(np.float64), sr


chunks = []
index = {}
off = 0
total_s = 0
for i, L in enumerate(LINES):
    fshift, pitch, prange, dur, radio = VOICES.get(L['voice'], VOICES['vecino'])
    d, sr = synth(L['text'], dur)
    snd = parselmouth.Sound(d, sampling_frequency=sr)
    if fshift != 1.0 or pitch:
        snd = call(snd, 'Change gender', 75, 500, fshift, pitch, prange, 1.0)
    if radio:
        snd = call(snd, 'Filter (pass Hann band)', 260, 3900, 120)
    else:
        snd = call(snd, 'Filter (pass Hann band)', 70, 7600, 60)
    snd = call(snd, 'Resample', SR, 50)
    x = snd.values[0]
    if radio:
        # un poco de saturación de AM
        x = np.tanh(x * 2.2) / np.tanh(2.2)
    # volumen parejo: RMS de -19 dBFS y picos por debajo de -1 dBFS
    rms = np.sqrt(np.mean(x ** 2)) or 1e-6
    x = x * (10 ** (-19 / 20) / rms)
    pk = np.max(np.abs(x)) or 1
    if pk > 0.89:
        x = x * (0.89 / pk)
    pad = np.zeros(int(SR * 0.06))
    x = np.concatenate([pad, x, pad])
    b = io.BytesIO()
    sf.write(b, x.astype(np.float32), SR, format='MP3', bitrate_mode='VARIABLE', compression_level=0.9)
    data = b.getvalue()
    pad4 = (-len(data)) % 4
    chunks.append(data + b'\0' * pad4)
    secs = len(x) / SR
    index[L['key']] = [off, len(data), round(secs, 2)]
    off += len(data) + pad4
    total_s += secs
    if i % 20 == 0:
        print(i, L['voice'], L['text'][:50], round(secs, 1), 's', len(data), 'B', flush=True)

open(os.path.join(OUT, 'voces.bin'), 'wb').write(b''.join(chunks))
json.dump(index, open(os.path.join(OUT, 'voces.json'), 'w'), separators=(',', ':'))
print('frases', len(index), 'audio', round(total_s), 's', 'tamaño', round(off / 1024), 'KB')
