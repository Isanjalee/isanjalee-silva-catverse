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

function playThunder(
  context: AudioContext,
  output: AudioNode,
  buffer: AudioBuffer,
) {
  const start = context.currentTime;
  const noise = context.createBufferSource();
  const noiseFilter = context.createBiquadFilter();
  const noiseGain = context.createGain();
  const crackFilter = context.createBiquadFilter();
  const crackGain = context.createGain();
  const impact = context.createOscillator();
  const impactGain = context.createGain();
  const rumble = context.createOscillator();
  const rumbleGain = context.createGain();
  const rollingBody = context.createOscillator();
  const rollingGain = context.createGain();

  noise.buffer = buffer;
  noise.loop = true;
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 320;
  noiseGain.gain.setValueAtTime(0.0001, start);
  noiseGain.gain.exponentialRampToValueAtTime(0.42, start + 0.14);
  noiseGain.gain.exponentialRampToValueAtTime(0.11, start + 1.15);
  noiseGain.gain.exponentialRampToValueAtTime(0.2, start + 1.85);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, start + 4.3);
  crackFilter.type = "bandpass";
  crackFilter.frequency.value = 720;
  crackFilter.Q.value = 0.85;
  crackGain.gain.setValueAtTime(0.0001, start);
  crackGain.gain.exponentialRampToValueAtTime(0.5, start + 0.025);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.48);
  crackGain.gain.exponentialRampToValueAtTime(0.18, start + 0.62);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.98);

  impact.type = "triangle";
  impact.frequency.setValueAtTime(96, start);
  impact.frequency.exponentialRampToValueAtTime(44, start + 1.15);
  impactGain.gain.setValueAtTime(0.0001, start);
  impactGain.gain.exponentialRampToValueAtTime(0.24, start + 0.035);
  impactGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.25);

  rumble.type = "sine";
  rumble.frequency.setValueAtTime(84, start);
  rumble.frequency.exponentialRampToValueAtTime(46, start + 4);
  rumbleGain.gain.setValueAtTime(0.0001, start);
  rumbleGain.gain.exponentialRampToValueAtTime(0.16, start + 0.22);
  rumbleGain.gain.exponentialRampToValueAtTime(0.42, start + 1.05);
  rumbleGain.gain.exponentialRampToValueAtTime(0.2, start + 2.35);
  rumbleGain.gain.exponentialRampToValueAtTime(0.0001, start + 4.35);

  rollingBody.type = "triangle";
  rollingBody.frequency.setValueAtTime(165, start);
  rollingBody.frequency.exponentialRampToValueAtTime(78, start + 3.6);
  rollingGain.gain.setValueAtTime(0.0001, start);
  rollingGain.gain.exponentialRampToValueAtTime(0.08, start + 0.35);
  rollingGain.gain.exponentialRampToValueAtTime(0.2, start + 1.25);
  rollingGain.gain.exponentialRampToValueAtTime(0.0001, start + 3.9);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(output);
  noise.connect(crackFilter);
  crackFilter.connect(crackGain);
  crackGain.connect(output);
  impact.connect(impactGain);
  impactGain.connect(output);
  rumble.connect(rumbleGain);
  rumbleGain.connect(output);
  rollingBody.connect(rollingGain);
  rollingGain.connect(output);
  noise.start(start, Math.random() * 0.4, 4.4);
  impact.start(start);
  impact.stop(start + 1.3);
  rumble.start(start);
  rumble.stop(start + 4.4);
  rollingBody.start(start);
  rollingBody.stop(start + 4);
}

export default function BackgroundAudio({ isPlaying }: { isPlaying: boolean }) {
  const { weather } = useWeather();
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
      const stopAt = context.currentTime;
      master.gain.cancelScheduledValues(stopAt);
      master.gain.setTargetAtTime(0.0001, stopAt, 0.08);
      contextRef.current = null;
      masterRef.current = null;
      if (preparedContext === context) preparedContext = null;
      window.setTimeout(() => {
        void context.close();
      }, 220);
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

    if (weather === "sunny") {
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
          4_500,
          8_000,
          15_000,
        );
      } else {
        schedule(() => playBirdChirp(context, mix), 3_500, 7_000, 14_000);
        schedule(
          () => playLeafRustle(context, mix, noiseBuffer),
          5_000,
          7_000,
          13_000,
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
      timers.forEach((timer) => window.clearTimeout(timer));
      cleanups.forEach((cleanup) => cleanup());
      const stopAt = context.currentTime;
      mix.gain.cancelScheduledValues(stopAt);
      mix.gain.setTargetAtTime(0.0001, stopAt, 0.12);
      window.setTimeout(() => mix.disconnect(), 320);
    };
  }, [isPlaying, resolvedTheme, weather]);

  return null;
}
