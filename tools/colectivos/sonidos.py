# Recorta, normaliza y empaqueta los sonidos del colectivo (Metalpar OF-1519) en un .bin de mp3
import subprocess, numpy as np, json, sys, os
SRC = sys.argv[1]; OUT = sys.argv[2]; SR = 22050
# nombre: (archivo, inicio, duración, loop, ganancia en dB objetivo de pico)
CLIPS = {
  'ralenti':  ('OF-1519/idle (2).wav', 2.0, 6.0, True),
  'bajo':     ('OF-1519/giro baixo.wav', 0.5, 4.5, True),
  'medio':    ('OF-1519/giro medio 1.wav', 0.5, 5.5, True),
  'alto':     ('OF-1519/giro alto 1519.wav', 0.1, 2.2, True),
  'arranque': ('OF-1519/motor ligando.wav', 0, 2.3, False),
  'apagado':  ('OF-1519/desliga motor.wav', 0, 3.0, False),
  'turbo':    ('OF-1519/Merc-Turbo.wav', 0, 1.06, False),
  'aire':     ('OF-1519/balao de ar.wav', 0, 2.6, False),
  'freno':    ('sounds/freio on.wav', 0, 1.3, False),
  'suelta':   ('sounds/freio off.wav', 0, 0.94, False),
  'chirrido': ('frenoBT5/freio.wav', 0, 0.65, False),
  'bocina':   ('sounds/horn.wav', 0.25, 1.1, True),
  'cambio':   ('sounds/Embreagem.wav', 0, 0.52, False),
  'abre':     ('sounds/Porta Abre.wav', 0, 3.0, False),
  'cierra':   ('sounds/Porta Fecha.wav', 0, 3.0, False),
  'timbre':   ('sounds/timbre.wav', 0, 0.7, False),
}
def load(f, t0, d):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t0), '-t', str(d), '-i', os.path.join(SRC, f), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()
blob = bytearray(); idx = {}
for k, (f, t0, d, loop) in CLIPS.items():
    x = load(f, t0, d)
    x = x / (np.abs(x).max() + 1e-9) * 0.89
    if loop:
        F = int(0.25 * SR)
        y = x[:len(x) - F].copy()
        r = np.linspace(0, 1, F, dtype=np.float32)
        y[:F] = x[:F] * np.sqrt(r) + x[len(x) - F:] * np.sqrt(1 - r)
        x = y
    else:
        F = int(0.01 * SR); x[:F] *= np.linspace(0, 1, F); F = int(0.08 * SR); x[-F:] *= np.linspace(1, 0, F)
    mp3 = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-b:a', '48k', '-f', 'mp3', '-'], input=x.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    idx[k] = [len(blob), len(mp3), round(len(x) / SR, 3), loop]
    blob += mp3
open(os.path.join(OUT, 'colectivo.bin'), 'wb').write(blob)
json.dump(idx, open(os.path.join(OUT, 'colectivo.json'), 'w'))
print(len(blob) // 1024, 'KB', idx)
