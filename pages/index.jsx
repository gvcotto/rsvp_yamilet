import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const INTRO_VIDEO_SRC = "/video/castle_intro.mp4";
const AUDIO_SRC = "/music/music.mp3";

export default function IntroVideo() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const unlockHandlersRef = useRef({ pointer: null, key: null });

  const ensureAudio = () => {
    if (typeof window === "undefined") return null;
    let audio = window.__xvBgm;
    if (!audio) {
      audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.preload = "auto";
      window.__xvBgm = audio;
    }
    return audio;
  };

  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return;

    const syncState = () => {
      setAudioReady(true);
      setIsAudioPlaying(!audio.paused);
    };

    const clearUnlockHandlers = () => {
      const { pointer, key } = unlockHandlersRef.current;
      if (pointer) window.removeEventListener("pointerdown", pointer);
      if (key) window.removeEventListener("keydown", key);
      unlockHandlersRef.current = { pointer: null, key: null };
    };

    const requestUnlock = () => {
      const pointerHandler = () => {
        audio.play().catch(() => {});
        clearUnlockHandlers();
      };
      const keyHandler = () => {
        audio.play().catch(() => {});
        clearUnlockHandlers();
      };
      unlockHandlersRef.current = { pointer: pointerHandler, key: keyHandler };
      window.addEventListener("pointerdown", pointerHandler, { once: true });
      window.addEventListener("keydown", keyHandler, { once: true });
    };

    audio.addEventListener("play", syncState);
    audio.addEventListener("pause", syncState);
    audio.addEventListener("canplay", syncState);

    audio.play().catch(requestUnlock);

    return () => {
      audio.removeEventListener("play", syncState);
      audio.removeEventListener("pause", syncState);
      audio.removeEventListener("canplay", syncState);
      clearUnlockHandlers();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => triggerTransition();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  const startExperience = () => {
    const video = videoRef.current;
    if (!video) return;
    ensureAudio()?.play().catch(() => {});
    video
      .play()
      .then(() => setStarted(true))
      .catch(() => {});
  };

  const triggerTransition = () => {
    if (transitioning) return;
    setTransitioning(true);
    ensureAudio()?.play().catch(() => {});
    setTimeout(() => {
      router.replace("/detalles");
    }, 600);
  };

  const handleInteraction = () => {
    if (!started) {
      startExperience();
      return;
    }
    triggerTransition();
  };

  const toggleAudio = (event) => {
    event.stopPropagation();
    const audio = ensureAudio();
    if (!audio || !audioReady) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <div
      className={`intro-video${transitioning ? " intro-video--fade" : ""}`}
      onClick={handleInteraction}
      role="button"
      tabIndex={-1}
      aria-label="Entrar a la invitación"
    >
      <video
        ref={videoRef}
        className="intro-video__player"
        src={INTRO_VIDEO_SRC}
        muted
        playsInline
        controls={false}
        preload="auto"
      />
      <div className={`intro-video__veil${started ? " intro-video__veil--hidden" : ""}`}>
        {!started && (
          <div className="intro-video__cta">
            <span className="intro-video__emoji" aria-hidden="true" style={{ color: "#d8aeb0" }}>
              🤍
            </span>
            <p>Toca o haz clic para iniciar</p>
            <span className="intro-video__hand" aria-hidden="true" style={{ color: "#d8aeb0" }}>
              👆
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        className="sound-toggle"
        onClick={toggleAudio}
        disabled={!audioReady}
        aria-pressed={isAudioPlaying}
        aria-label={isAudioPlaying ? "Silenciar música" : "Reproducir música"}
      >
        <span aria-hidden="true">{isAudioPlaying ? "🔊" : "🔇"}</span>
      </button>
    </div>
  );
}
