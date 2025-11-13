import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import LanguageSwitch from "@/components/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";

const INTRO_VIDEO_SRC = "/video/castle_intro.mp4";
const AUDIO_SRC = "/music/music.mp3";
const SOUND_ON_ICON = "🔊";
const SOUND_OFF_ICON = "🔈";
const INTRO_HEART_EMOJI = "💞";
const INTRO_HAND_EMOJI = "👇";
const INTRO_COPY = {
  es: {
    ariaLabel: "Entrar a la invitación",
    CTA: "Toca o haz clic para iniciar",
    muteMusic: "Silenciar música",
    playMusic: "Reproducir música",
    restartVideo: "Reproducir video de bienvenida otra vez",
  },
  en: {
    ariaLabel: "Enter the invitation",
    CTA: "Tap or click to begin",
    muteMusic: "Mute music",
    playMusic: "Play music",
    restartVideo: "Replay welcome video",
  },
};

export default function IntroVideo() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const unlockHandlersRef = useRef({ pointer: null, key: null });
  const { language } = useLanguage();
  const copy = INTRO_COPY[language] || INTRO_COPY.es;

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

  const startExperience = () => {
    const video = videoRef.current;
    if (!video) return;
    ensureAudio()?.play().catch(() => {});
    video
      .play()
      .then(() => setStarted(true))
      .catch(() => {});
  };

  const triggerTransition = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    ensureAudio()?.play().catch(() => {});
    setTimeout(() => {
      router.replace("/detalles");
    }, 600);
  }, [router, transitioning]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => triggerTransition();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [triggerTransition]);

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

  const restartIntro = (event) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    setTransitioning(false);
    setStarted(false);
    video.currentTime = 0;
    ensureAudio()?.play().catch(() => {});
    video.play().catch(() => {});
  };

  return (
    <div
      className={`intro-video${transitioning ? " intro-video--fade" : ""}`}
      onClick={handleInteraction}
      role="button"
      tabIndex={-1}
      aria-label={copy.ariaLabel}
    >
      <LanguageSwitch className="floating-language-switch" appearance="light" />
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
              {INTRO_HEART_EMOJI}
            </span>
            <p>{copy.CTA}</p>
            <span className="intro-video__hand" aria-hidden="true" style={{ color: "#d8aeb0" }}>
              {INTRO_HAND_EMOJI}
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
        aria-label={isAudioPlaying ? copy.muteMusic : copy.playMusic}
      >
        <span aria-hidden="true">{isAudioPlaying ? SOUND_ON_ICON : SOUND_OFF_ICON}</span>
      </button>
      <button
        type="button"
        className="sound-toggle sound-toggle--secondary"
        onClick={restartIntro}
        aria-label={copy.restartVideo}
      >
        ↺
      </button>
    </div>
  );
}



