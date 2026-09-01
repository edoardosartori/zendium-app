let ctx: AudioContext | null = null;

function getContext() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function beep(frequency = 900, duration = 0.04, volume = 0.02) {
  const audio = getContext();

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "square";
  osc.frequency.value = frequency;

  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start();
  osc.stop(audio.currentTime + duration);
}

export function keyPressSound(volume = 0.02) {
  const audio = getContext();
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "triangle";

  osc.frequency.setValueAtTime(550, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.018);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1100, now);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + 0.032);
}

/**
 * 0.0s — Power-on
 * Suono basso, morbido e brevissimo: il "core" che si accende.
 */
export function powerOnSound(volume = 0.08) {
  const audio = getContext();
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(60, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * Impulsi elettronici per le wave (~1s, ~2s, ~3s).
 * Stesso "timbro di famiglia", frequenza leggermente diversa per ognuno
 * così si percepisce una progressione.
 */
function waveImpulse(frequency: number, volume = 0.04) {
  const audio = getContext();
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, now);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.6, now + 0.09);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

/** ~1.0s — Primo impulso (prima wave) */
export function pulseOneSound() {
  waveImpulse(720);
}

/** ~2.0s — Secondo impulso (seconda wave), leggermente diverso */
export function pulseTwoSound() {
  waveImpulse(840);
}

/** ~3.0s — Terzo impulso (terza wave), sensazione di stabilizzazione */
export function pulseThreeSound() {
  waveImpulse(960, 0.03);
}

/**
 * ~4.5–5.0s — Core pulse
 * Singolo tono molto basso e subtle: il sistema è quasi pronto.
 * Non va ripetuto: un solo evento isolato.
 */
export function corePulseSound(volume = 0.09) {
  const audio = getContext();
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(110, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(300, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + 1.0);
}

/**
 * 7.2s — Shutdown
 * Tono discendente breve, in coincidenza con il fade-out del core/status.
 */
export function shutdownSound(volume = 0.1) {
  const audio = getContext();
  const now = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + 0.5);
}

export function gridExpandSound(volume = 0.2) {
  const audio = getContext();
  const now = audio.currentTime;
  const duration = 3.8;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(40, now);
  osc.frequency.exponentialRampToValueAtTime(85, now + duration);

  filter.type = "lowpass";
  filter.Q.value = 1;
  filter.frequency.setValueAtTime(180, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + duration * 0.5);
  filter.frequency.exponentialRampToValueAtTime(250, now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + duration + 0.05);
}
