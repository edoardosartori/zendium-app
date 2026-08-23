let ctx: AudioContext | null = null;

function getContext() {
  if (!ctx) ctx = new AudioContext();

  return ctx;
}

export function beep(frequency = 900, duration = 0.04, volume = 0.03) {
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

export function keyPressSound(volume = 0.06) {
  if (!ctx) {
    ctx = new AudioContext();
  }

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "triangle";

  osc.frequency.setValueAtTime(550, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.018);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1100, now);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.032);
}
