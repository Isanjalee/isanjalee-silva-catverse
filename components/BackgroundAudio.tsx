"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useWeather } from "@/components/WeatherProvider";

type AudioCleanup = () => void;

let preparedContext: AudioContext | null = null;

export function prepareAmbientAudio() {
  if (typeof window === "undefined") return null;

  const AudioContextClass =
    window.AudioContext ??
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!preparedContext || preparedContext.state === "closed") {
    preparedContext = new AudioContextClass();
  }

  void preparedContext.resume();
  return preparedContext;
}

function createNoiseBuffer(context: AudioContext) {
  const length = context.sampleRate * 2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;

  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.72 + white * 0.28;
    data[index] = last;
  }

  return buffer;
}

function addNoiseBed(
  context: AudioContext,
  output: AudioNode,
  buffer: AudioBuffer,
  options: {
    gain: number;
    frequency: number;
    filterType: BiquadFilterType;
    lfoRate: number;
    lfoDepth: number;
  },
): AudioCleanup {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();

  source.buffer = buffer;
  source.loop = true;
  filter.type = options.filterType;
  filter.frequency.value = options.frequency;
  filter.Q.value = 0.55;
  gain.gain.value = options.gain;
  lfo.type = "sine";
  lfo.frequency.value = options.lfoRate;
  lfoGain.gain.value = options.lfoDepth;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);

  source.start();
  lfo.start();

  return () => {
    source.stop();
    lfo.stop();
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
  };
}

function playBirdChirp(context: AudioContext, output: AudioNode) {
  const start = context.currentTime;

  for (let note = 0; note < 3; note += 1) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = start + note * 0.16;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1450 + note * 120, noteStart);
    oscillator.frequency.exponentialRampToValueAtTime(2350 + note * 90, noteStart + 0.09);
    oscillator.frequency.exponentialRampToValueAtTime(1750, noteStart + 0.2);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.024, noteStart + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.22);

    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.24);
  }
}

function playLeafRustle(
  context: AudioContext,
  output: AudioNode,
  buffer: AudioBuffer,
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const start = context.currentTime;

  source.buffer = buffer;
  source.playbackRate.value = 1.35;
  filter.type = "bandpass";
  filter.frequency.value = 1850;
  filter.Q.value = 0.7;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.026, start + 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.15);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  source.start(start, Math.random() * 0.6, 1.2);
}

function playMeow(context: AudioContext, output: AudioNode) {
  const start = context.currentTime;
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const voice = context.createOscillator();
  const warmth = context.createOscillator();

  filter.type = "lowpass";
  filter.frequency.value = 1150;
  voice.type = "triangle";
  warmth.type = "sine";
  voice.frequency.setValueAtTime(510, start);
  voice.frequency.exponentialRampToValueAtTime(620, start + 0.18);
  voice.frequency.exponentialRampToValueAtTime(330, start + 0.78);
  warmth.frequency.setValueAtTime(255, start);
  warmth.frequency.exponentialRampToValueAtTime(170, start + 0.78);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.038, start + 0.11);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.85);

  voice.connect(filter);
  warmth.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  voice.start(start);
  warmth.start(start);
  voice.stop(start + 0.9);
  warmth.stop(start + 0.9);
}

function playWinterChime(context: AudioContext, output: AudioNode) {
  // A soft, slightly detuned bell arpeggio — calm and christmassy rather
  // than bright/festive, so it still reads as "quiet winter evening."
  const start = context.currentTime;
  const notes = [880, 1108.7, 1318.5, 1760]; // A5, C#6, E6, A6

  notes.forEach((frequency, index) => {
    const noteStart = start + index * 0.22;
    const bell = context.createOscillator();
    const partial = context.createOscillator();
    const gain = context.createGain();

    bell.type = "sine";
    partial.type = "sine";
    bell.frequency.setValueAtTime(frequency, noteStart);
    partial.frequency.setValueAtTime(frequency * 2.01, noteStart);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.02, noteStart + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.6);

    bell.connect(gain);
    partial.connect(gain);
    gain.connect(output);
    bell.start(noteStart);
    partial.start(noteStart);
    bell.stop(noteStart + 1.7);
    partial.stop(noteStart + 1.7);
  });
}

function playFireflyChime(context: AudioContext, output: AudioNode) {
  const start = context.currentTime;

  for (let note = 0; note < 2; note += 1) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = start + note * 0.24;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(820 + note * 220, noteStart);
    oscillator.frequency.exponentialRampToValueAtTime(1220 + note * 180, noteStart + 0.35);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.014, noteStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.75);

    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.8);
  }
}

function playRainDrop(context: AudioContext, output: AudioNode) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(1550 + Math.random() * 650, start);
  oscillator.frequency.exponentialRampToValueAtTime(620, start + 0.16);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.016, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);

  oscillator.connect(gain);
  gain.connect(output);
  oscillator.start(start);
  oscillator.stop(start + 0.22);
}

function playFrogCall(context: AudioContext, output: AudioNode) {
  const start = context.currentTime;

  for (let croak = 0; croak < 2; croak += 1) {
    const callStart = start + croak * 0.46;
    const voice = context.createOscillator();
    const warmth = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    voice.type = "triangle";
    warmth.type = "sine";
    voice.frequency.setValueAtTime(176 + croak * 12, callStart);
    voice.frequency.exponentialRampToValueAtTime(104, callStart + 0.18);
    voice.frequency.exponentialRampToValueAtTime(142, callStart + 0.38);
    warmth.frequency.setValueAtTime(88, callStart);
    warmth.frequency.exponentialRampToValueAtTime(66, callStart + 0.4);
    filter.type = "lowpass";
    filter.frequency.value = 480;
    filter.Q.value = 1.2;
    gain.gain.setValueAtTime(0.0001, callStart);
    gain.gain.exponentialRampToValueAtTime(0.018, callStart + 0.07);
    gain.gain.exponentialRampToValueAtTime(0.007, callStart + 0.22);
    gain.gain.exponentialRampToValueAtTime(0.0001, callStart + 0.44);

    voice.connect(filter);
    warmth.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    voice.start(callStart);
    warmth.start(callStart);
    voice.stop(callStart + 0.46);
    warmth.stop(callStart + 0.46);
  }
}

function playThunder(
  context: AudioContext,
  output: AudioNode,
  buffer: AudioBuffer,
) {
  const start = context.currentTime;
  const body = context.createBufferSource();
  const bodyFilter = context.createBiquadFilter();
  const bodyGain = context.createGain();
  const roll = context.createBufferSource();
  const rollFilter = context.createBiquadFilter();
  const rollGain = context.createGain();
  const crack = context.createBufferSource();
  const crackFilter = context.createBiquadFilter();
  const crackGain = context.createGain();

  body.buffer = buffer;
  body.loop = true;
  bodyFilter.type = "lowpass";
  bodyFilter.frequency.setValueAtTime(420, start);
  bodyFilter.frequency.exponentialRampToValueAtTime(105, start + 4.8);
  bodyFilter.Q.value = 0.55;
  bodyGain.gain.setValueAtTime(0.0001, start);
  bodyGain.gain.exponentialRampToValueAtTime(0.48, start + 0.055);
  bodyGain.gain.exponentialRampToValueAtTime(0.15, start + 0.72);
  bodyGain.gain.exponentialRampToValueAtTime(0.27, start + 1.35);
  bodyGain.gain.exponentialRampToValueAtTime(0.1, start + 2.15);
  bodyGain.gain.exponentialRampToValueAtTime(0.19, start + 2.85);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, start + 4.9);

  roll.buffer = buffer;
  roll.loop = true;
  rollFilter.type = "bandpass";
  rollFilter.frequency.value = 125;
  rollFilter.Q.value = 0.7;
  rollGain.gain.setValueAtTime(0.0001, start);
  rollGain.gain.exponentialRampToValueAtTime(0.22, start + 0.22);
  rollGain.gain.exponentialRampToValueAtTime(0.08, start + 0.9);
  rollGain.gain.exponentialRampToValueAtTime(0.26, start + 1.55);
  rollGain.gain.exponentialRampToValueAtTime(0.07, start + 2.35);
  rollGain.gain.exponentialRampToValueAtTime(0.2, start + 3.05);
  rollGain.gain.exponentialRampToValueAtTime(0.0001, start + 5.1);

  crack.buffer = buffer;
  crack.loop = true;
  crackFilter.type = "highpass";
  crackFilter.frequency.value = 820;
  crackFilter.Q.value = 0.45;
  crackGain.gain.setValueAtTime(0.0001, start);
  crackGain.gain.exponentialRampToValueAtTime(0.42, start + 0.012);
  crackGain.gain.exponentialRampToValueAtTime(0.055, start + 0.26);
  crackGain.gain.exponentialRampToValueAtTime(0.16, start + 0.42);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.82);

  body.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(output);
  roll.connect(rollFilter);
  rollFilter.connect(rollGain);
  rollGain.connect(output);
  crack.connect(crackFilter);
  crackFilter.connect(crackGain);
  crackGain.connect(output);
  body.start(start, Math.random(), 5);
  roll.start(start, Math.random(), 5.2);
  crack.start(start, Math.random(), 0.9);
}

function playPowerBlast(
  context: AudioContext,
  output: AudioNode,
  buffer: AudioBuffer,
) {
  const start = context.currentTime;
  const blastBus = context.createGain();
  const arcNoise = context.createBufferSource();
  const arcFilter = context.createBiquadFilter();
  const arcGain = context.createGain();
  const pressure = context.createBufferSource();
  const pressureFilter = context.createBiquadFilter();
  const pressureGain = context.createGain();

  blastBus.gain.setValueAtTime(1.25, start);
  blastBus.gain.exponentialRampToValueAtTime(0.78, start + 3.8);
  blastBus.connect(output);

  arcNoise.buffer = buffer;
  arcNoise.loop = true;
  arcFilter.type = "highpass";
  arcFilter.frequency.value = 1_100;
  arcFilter.Q.value = 0.5;
  arcGain.gain.setValueAtTime(0.0001, start);
  arcGain.gain.exponentialRampToValueAtTime(0.58, start + 0.006);
  arcGain.gain.exponentialRampToValueAtTime(0.12, start + 0.19);
  arcGain.gain.exponentialRampToValueAtTime(0.3, start + 0.31);
  arcGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.72);

  pressure.buffer = buffer;
  pressure.loop = true;
  pressureFilter.type = "lowpass";
  pressureFilter.frequency.setValueAtTime(260, start);
  pressureFilter.frequency.exponentialRampToValueAtTime(72, start + 3.4);
  pressureFilter.Q.value = 0.75;
  pressureGain.gain.setValueAtTime(0.0001, start);
  pressureGain.gain.exponentialRampToValueAtTime(0.62, start + 0.025);
  pressureGain.gain.exponentialRampToValueAtTime(0.18, start + 0.8);
  pressureGain.gain.exponentialRampToValueAtTime(0.38, start + 1.5);
  pressureGain.gain.exponentialRampToValueAtTime(0.12, start + 2.4);
  pressureGain.gain.exponentialRampToValueAtTime(0.0001, start + 3.7);

  arcNoise.connect(arcFilter);
  arcFilter.connect(arcGain);
  arcGain.connect(blastBus);
  pressure.connect(pressureFilter);
  pressureFilter.connect(pressureGain);
  pressureGain.connect(blastBus);

  arcNoise.start(start, Math.random(), 0.8);
  pressure.start(start, Math.random(), 3.8);
  playThunder(context, blastBus, buffer);
}

export default function BackgroundAudio({ isPlaying }: { isPlaying: boolean }) {
  const { weather, season } = useWeather();
  const { resolvedTheme } = useTheme();
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  useLayoutEffect(() => {
    if (!isPlaying) return;

    const context = prepareAmbientAudio();
    if (!context) return;

    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const now = context.currentTime;

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.6);
    compressor.threshold.value = -18;
    compressor.knee.value = 8;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.015;
    compressor.release.value = 0.35;
    master.connect(compressor);
    compressor.connect(context.destination);
    contextRef.current = context;
    masterRef.current = master;
    const unlockAudio = () => {
      void context.resume().then(() => {
        if (context.state === "running") {
          window.removeEventListener("pointerdown", unlockAudio);
          window.removeEventListener("keydown", unlockAudio);
        }
      });
    };

    void context.resume();
    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    const handleVisibility = () => {
      if (document.hidden) {
        void context.suspend();
      } else {
        void context.resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      // Toggling the music icon off must cut sound immediately, not fade —
      // a lingering tail reads as "sound plays even when the icon is off".
      try {
        const stopAt = context.currentTime;
        master.gain.cancelScheduledValues(stopAt);
        master.gain.setValueAtTime(0, stopAt);
      } catch {
        // context may already be mid-teardown; nothing left to silence
      }
      contextRef.current = null;
      masterRef.current = null;
      if (preparedContext === context) preparedContext = null;
      void context.close();
    };
  }, [isPlaying]);

  useEffect(() => {
    const context = contextRef.current;
    const master = masterRef.current;
    if (!isPlaying || !context || !master) return;

    const mix = context.createGain();
    const noiseBuffer = createNoiseBuffer(context);
    const cleanups: AudioCleanup[] = [];
    const timers: number[] = [];
    const now = context.currentTime;
    const isDark = resolvedTheme === "dark";

    mix.gain.setValueAtTime(0.0001, now);
    mix.gain.exponentialRampToValueAtTime(1, now + 1.2);
    mix.connect(master);

    const handlePowerBlast = () => {
      if (context.state === "running") {
        playPowerBlast(context, mix, noiseBuffer);
      }
    };
    window.addEventListener("catverse-power-blast", handlePowerBlast);

    const schedule = (
      callback: () => void,
      firstDelay: number,
      minimumDelay: number,
      maximumDelay: number,
    ) => {
      const run = () => {
        callback();
        const delay =
          minimumDelay + Math.random() * (maximumDelay - minimumDelay);
        timers.push(window.setTimeout(run, delay));
      };
      timers.push(window.setTimeout(run, firstDelay));
    };

    if (weather === "sunny" && season === "winter") {
      // Calm, cold, quiet-evening winter mix: a soft airy hush instead of
      // a warm hum, a gentle wind-chime arpeggio instead of birds/fireflies,
      // and the cat still visits, just less often — it's a hushed scene.
      cleanups.push(
        addNoiseBed(context, mix, noiseBuffer, {
          gain: 0.022,
          frequency: isDark ? 950 : 1150,
          filterType: "bandpass",
          lfoRate: 0.05,
          lfoDepth: 0.008,
        }),
      );

      schedule(
        () => playWinterChime(context, mix),
        5_000,
        14_000,
        24_000,
      );
      schedule(() => playMeow(context, mix), 14_000, 26_000, 40_000);
    } else if (weather === "sunny") {
      cleanups.push(
        addNoiseBed(context, mix, noiseBuffer, {
          gain: 0.032,
          frequency: 720,
          filterType: "lowpass",
          lfoRate: 0.085,
          lfoDepth: 0.011,
        }),
      );

      schedule(() => playMeow(context, mix), 9_000, 18_000, 28_000);

      if (isDark) {
        schedule(
          () => playFireflyChime(context, mix),
          season === "spring" ? 3_200 : 4_500,
          season === "spring" ? 6_000 : 8_000,
          season === "spring" ? 11_000 : 15_000,
        );
        if (season === "autumn") {
          schedule(
            () => playLeafRustle(context, mix, noiseBuffer),
            3_800,
            6_000,
            10_000,
          );
        }
      } else {
        schedule(
          () => playBirdChirp(context, mix),
          season === "spring" ? 2_400 : 3_500,
          season === "spring" ? 5_000 : 7_000,
          season === "spring" ? 10_000 : 14_000,
        );
        schedule(
          () => playLeafRustle(context, mix, noiseBuffer),
          season === "autumn" ? 2_800 : 5_000,
          season === "autumn" ? 4_500 : 7_000,
          season === "autumn" ? 8_500 : 13_000,
        );
      }
    } else {
      const isStorm = weather === "storm";

      cleanups.push(
        addNoiseBed(context, mix, noiseBuffer, {
          gain: isStorm ? 0.072 : 0.052,
          frequency: isStorm ? 480 : 650,
          filterType: "lowpass",
          lfoRate: isStorm ? 0.11 : 0.07,
          lfoDepth: isStorm ? 0.022 : 0.014,
        }),
      );
      cleanups.push(
        addNoiseBed(context, mix, noiseBuffer, {
          gain: isStorm ? 0.056 : 0.042,
          frequency: 2600,
          filterType: "highpass",
          lfoRate: 0.16,
          lfoDepth: 0.009,
        }),
      );

      schedule(
        () => playRainDrop(context, mix),
        450,
        isStorm ? 260 : 480,
        isStorm ? 720 : 1_200,
      );
      schedule(
        () => playFrogCall(context, mix),
        isStorm ? 7_000 : 3_800,
        isStorm ? 12_000 : 7_000,
        isStorm ? 20_000 : 13_000,
      );
      if (isStorm) {
        const scheduleThunderCycle = () => {
          // Lightning is visible about 770ms into the 11s visual cycle.
          // At ~343m/s, a nearby 100–300m strike delays thunder by about
          // 0.3–0.9 seconds after the light reaches the viewer.
          const distanceMetres = 100 + Math.random() * 200;
          const soundTravelDelay = (distanceMetres / 343) * 1_000;
          timers.push(
            window.setTimeout(
              () => playThunder(context, mix, noiseBuffer),
              770 + soundTravelDelay,
            ),
          );
          timers.push(window.setTimeout(scheduleThunderCycle, 11_000));
        };

        scheduleThunderCycle();
      }
    }

    return () => {
      window.removeEventListener("catverse-power-blast", handlePowerBlast);
      timers.forEach((timer) => window.clearTimeout(timer));
      cleanups.forEach((cleanup) => cleanup());
      try {
        const stopAt = context.currentTime;
        mix.gain.cancelScheduledValues(stopAt);
        mix.gain.setTargetAtTime(0.0001, stopAt, 0.12);
        window.setTimeout(() => {
          try {
            mix.disconnect();
          } catch {
            // outer context may have already closed (isPlaying turned off)
          }
        }, 320);
      } catch {
        // outer context may have already closed (isPlaying turned off)
      }
    };
  }, [isPlaying, resolvedTheme, season, weather]);

  return null;
}
