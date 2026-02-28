"use client";

import { useEffect, useRef } from "react";

export default function BackgroundAudio({ isPlaying }: { isPlaying: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Browsers might block autoplay, so we handle the promise gracefully
      audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    // Relaxing calm lofi cat music (royalty free background stream)
    <audio
      ref={audioRef}
      loop
      src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
      preload="none"
    />
  );
}
