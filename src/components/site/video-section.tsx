"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <section id="video" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          Conheça a Together We Feed
        </h2>
        <p className="twf-subtitle mx-auto max-w-2xl text-center">
          Assista e compreenda como a sua ajuda transforma vidas.
        </p>

        <div className="relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-navy-deep shadow-2xl">
          <video
            poster="/media/images/video-poster.webp"
            muted={muted}
            autoPlay={playing}
            loop
            playsInline
            preload="metadata"
            controls={playing}
            className="h-full w-full object-cover"
          >
            {/* Placeholder source — the original presentation video is not bundled.
                The native controls will be available once playback is started. */}
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>

          {!playing && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Reproduzir vídeo de apresentação"
              className="group absolute inset-0 flex items-center justify-center bg-navy-deep/40 transition-colors hover:bg-navy-deep/30"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-grass text-white shadow-2xl shadow-grass/40 transition-transform duration-200 group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
              </span>
            </button>
          )}

          {playing && (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Ativar som" : "Silenciar"}
              className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-deep shadow-lg transition-transform hover:scale-105"
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <a href="#doar" className="twf-btn-green-lg">
          Quero ajudar
        </a>
      </div>
    </section>
  );
}
