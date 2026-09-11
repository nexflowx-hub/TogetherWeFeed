"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";

const DEFAULT_POSTER = "/media/images/video-poster.webp";
const DEFAULT_VIDEO_URL = "https://hopeheaart.com/pt/media/videos/apresentacao.mp4";

export function VideoSection() {
  const { messages } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  const videoUrl = useMemo(
    () => process.env.NEXT_PUBLIC_TWF_VIDEO_URL?.trim() || DEFAULT_VIDEO_URL,
    []
  );

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoUrl || mediaError) return;

    if (!video.paused) {
      video.pause();
      return;
    }

    setLoading(true);
    try {
      video.muted = muted;
      await video.play();
    } catch (cause) {
      console.warn("[video] play() failed", cause);
      setPlaying(false);
      setMediaError(true);
    } finally {
      setLoading(false);
    }
  }, [mediaError, muted, videoUrl]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
  }, []);

  const retry = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setMediaError(false);
    setPlaying(false);
    setLoading(true);
    video.load();
  }, [videoUrl]);

  const unavailable = !videoUrl || mediaError;

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
            poster={DEFAULT_POSTER}
            muted={muted}
            playsInline
            preload="metadata"
            controls={playing && !mediaError}
            onLoadStart={() => videoUrl && setLoading(true)}
            onCanPlay={() => {
              setLoading(false);
              setMediaError(false);
            }}
            onWaiting={() => setLoading(true)}
            onPlaying={() => {
              setLoading(false);
              setPlaying(true);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setLoading(false);
              setPlaying(false);
              setMediaError(true);
            }}
            className="h-full w-full object-cover"
          >
            {videoUrl ? <source src={videoUrl} type="video/mp4" /> : null}
          </video>

          {!playing && !unavailable && (
            <button
              type="button"
              onClick={togglePlay}
              disabled={loading}
              aria-label={messages.video.play}
              className="group absolute inset-0 flex items-center justify-center bg-navy-deep/40 transition-colors hover:bg-navy-deep/30 disabled:cursor-wait"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-grass text-white shadow-2xl shadow-grass/40 transition-transform duration-200 group-hover:scale-110">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
                )}
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
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
          )}

          {unavailable && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-deep/65 px-6 text-center text-white">
              <AlertCircle className="h-9 w-9" aria-hidden="true" />
              <p className="max-w-md text-sm font-semibold leading-relaxed">
                {!videoUrl
                  ? "O vídeo está a ser atualizado. Volte em breve."
                  : "Não foi possível carregar o vídeo neste momento."}
              </p>
              {videoUrl && (
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-navy-deep"
                >
                  <RotateCcw className="h-4 w-4" /> Tentar novamente
                </button>
              )}
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
