let ctx: AudioContext | null = null;

function getContext() {

    if (!ctx)
        ctx = new AudioContext();

    return ctx;

}

export function beep(
    frequency = 900,
    duration = 0.04,
    volume = 0.03
) {

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