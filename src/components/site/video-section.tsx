"use client";

import { useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

export function VideoSection() {
  const { messages } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      try {
        video.muted = true; // ensure muted so autoplay policy allows it
        await video.play();
        setPlaying(true);
      } catch (err) {
        console.warn("[video] play() blocked:", err);
      }
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  return (
    <section id="video" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          {messages.video.title}
        </h2>
        <p className="twf-subtitle mx-auto max-w-2xl text-center">
          {messages.video.subtitle}
        </p>

        <div className="relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-navy-deep shadow-2xl">
          <video
            ref={videoRef}
            poster="/media/images/video-poster.webp"
            muted={muted}
            loop
            playsInline
            preload="metadata"
            controls={playing}
            onEnded={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="h-full w-full object-cover"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>

          {!playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={messages.video.play}
              className="group absolute inset-0 flex items-center justify-center bg-navy-deep/40 transition-colors hover:bg-navy-deep/30"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-grass text-white shadow-2xl shadow-grass/40 transition-transform duration-200 group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
              </span>
            </button>
          )}

          {playing && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label="Pausar"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-lg transition-transform hover:scale-105"
              >
                <Pause className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Ativar som" : "Silenciar"}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-lg transition-transform hover:scale-105"
              >
                {muted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <a href="#doar" className="twf-btn-green-lg">
          {messages.video.cta}
        </a>
      </div>
    </section>
  );
}
