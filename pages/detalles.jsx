import Image from "next/image";
import { useEffect, useState } from "react";

import CalendarBadge from "@/components/CalendarBadge";
import Countdown from "@/components/Countdown";
import GeneralRSVPForm from "@/components/GeneralRSVPForm";
import Reveal from "@/components/Reveal";

const EVENT_START = "2025-12-20T17:00:00-05:00";
const CONTACT_PHONE = "+14013653519";
const CONTACT_LABEL = "401 • 365 • 3519";
const MAP_LINK = "https://maps.app.goo.gl/Em2ApGxVxtU7qwGG6";
const CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV%20Yamilet%20Alfaro&dates=20251220T220000Z/20251221T040000Z&details=Quincea%C3%B1era%20de%20Yamilet%20Alfaro&location=Night%20Of%20Columbus%201675%20Douglas%20Ave%20North%20Providence%20RI%2002904&sf=true&output=xml";

const RECEPTION_CARD = {
  id: "recepcion",
  icon: "/icons/ceremonia.png",
  title: "Recepción",
  time: "Horario: 5:00 pm a 11:00 pm",
  location: "Knights of Columbus Rev. Jordan J. Dillon Council #3563 • 1675 Douglas Ave. • North Providence, RI 02904",
  link: MAP_LINK,
};

const SLIDESHOW_PHOTOS = Array.from({ length: 10 }, (_, index) => `/photos/foto${index + 1}.jpg`);

export default function DetallesPage() {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let audio = window.__xvBgm;
    if (!audio) {
      audio = new Audio("/music/music.mp3");
      audio.loop = true;
      audio.preload = "auto";
      window.__xvBgm = audio;
    }

    const syncState = () => setIsAudioPlaying(!audio.paused);

    audio.addEventListener("play", syncState);
    audio.addEventListener("pause", syncState);
    setIsAudioReady(true);
    setIsAudioPlaying(!audio.paused);

    return () => {
      audio.removeEventListener("play", syncState);
      audio.removeEventListener("pause", syncState);
    };
  }, []);

  const toggleAudio = () => {
    const audio = typeof window !== "undefined" ? window.__xvBgm : null;
    if (!audio || !isAudioReady) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <main className="invite-wrap text-ink">
      <button
        type="button"
        className="sound-toggle"
        onClick={toggleAudio}
        disabled={!isAudioReady}
        aria-label={isAudioPlaying ? "Silenciar música" : "Reproducir música"}
      >
        <span aria-hidden="true">{isAudioPlaying ? "🔊" : "🔈"}</span>
      </button>

      <section className="section">
        <div className="relative overflow-hidden rounded-3xl bg-black/40 shadow-soft">
          <div className="relative h-[68vh] min-h-[420px] sm:min-h-[520px] w-full">
            <Image
              src="/photos/hero1.jpg"
              alt="Yamilet Alfaro"
              fill
              priority
              className="hero-image"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/25" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="h-font hero-sub hero-sub-white">Mis XV años</p>
              <h1 className="h-font hero-names hero-names-outline text-4xl leading-tight md:text-6xl lg:text-7xl">
                Yamilet Alfaro
              </h1>
              <p className="hero-date mt-4 max-w-xl text-base md:text-lg">
                20 de diciembre de 2025 • Knights of Columbus Rev. Jordan J. Dillon Council #3563 • North Providence, RI
              </p>
            </div>

            <a
              href="#reservaciones"
              className="absolute bottom-8 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Ir a reservaciones"
            >
              <span className="border-b-2 border-r-2 border-white/90 p-2.5 rotate-45" />
            </a>
          </div>
        </div>
      </section>

      <Reveal className="section narrow">
        <div className="gold-card gold-card--soft parents-card text-center">
          <p className="frase mx-auto max-w-3xl">
            Hay momentos inolvidables que se atesoran en el corazón para siempre. Con la bendición de Dios y el amor de
            mi familia, me siento muy feliz de llegar a este momento de mi vida. Los invito a compartir conmigo este día
            tan especial.
          </p>

          <div className="mt-10 flex flex-col items-center text-center">
            <h3 className="titulo mt-0">Junto a mis padres:</h3>
            <p className="frase mt-6 max-w-xl">Claudia Natareno</p>
            <p className="frase max-w-xl">&</p>
            <p className="frase max-w-xl">Alberto Alfaro</p>
          </div>

          <p className="frase mx-auto mt-10 max-w-3xl">Gracias por sumarte a este recuerdo inolvidable.</p>
        </div>
      </Reveal>

      <Reveal className="section narrow">
        <div className="gold-card gold-card--soft flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center">
          <div className="gold-card__inner flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-frase-gradient font-petrona text-2xl uppercase tracking-[0.26em]">¡Falta poco!</h3>
              <p className="font-petrona text-lg uppercase tracking-[0.24em] text-[#2f2f2f]">Nos vemos dentro de</p>
            </div>
            <Countdown targetISO={EVENT_START} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <CalendarBadge />
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-gold font-petrona tracking-[0.18em] uppercase text-xs"
            >
              Añadir al calendario
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal className="section narrow">
        <div className="flex justify-center">
          <PlaceCard key={RECEPTION_CARD.id} {...RECEPTION_CARD} />
        </div>
      </Reveal>

      <Reveal className="section narrow">
        <PhotoSlideshow photos={SLIDESHOW_PHOTOS} />
      </Reveal>

      <Reveal className="section narrow gold-card gold-card--soft" id="reservaciones">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="text-center space-y-3">
            <h2 className="font-petrona text-2xl text-frase-gradient uppercase tracking-[0.26em]">Reservaciones</h2>
            <p className="sec-text">
              Completa el siguiente formulario para confirmar tu asistencia. Necesitamos el nombre y teléfono del adulto
              responsable, la lista de adultos acompañantes y cuántos niños asistirán. Puedes enviar nuevas respuestas si
              necesitas actualizar tus datos antes del <b>1 de diciembre de 2025</b>.
            </p>
            <p className="sec-text text-sm">
              ¿Prefieres hablar con nosotros? Llámanos o envía un SMS al{" "}
              <a className="link-gold font-semibold" href={`tel:${CONTACT_PHONE}`}>
                {CONTACT_LABEL}
              </a>
              .
            </p>
          </div>
          <GeneralRSVPForm />
        </div>
      </Reveal>

      <Reveal className="section narrow text-center">
        <p className="font-petrona text-frase-gradient text-lg uppercase tracking-[0.24em]">
          “Los sueños que se crean con amor se vuelven eternos.”
        </p>
        <p className="sec-text mt-4 font-petrona tracking-[0.18em] uppercase">Con cariño, familia Alfaro</p>
      </Reveal>

      <Reveal className="section narrow text-center">
        <p className="sec-text font-petrona">
          ¿Dudas? Escríbenos o llámanos al{" "}
          <a className="link-gold font-semibold" href={`tel:${CONTACT_PHONE}`}>
            {CONTACT_LABEL}
          </a>
        </p>
      </Reveal>
    </main>
  );
}

function PlaceCard({ icon, title, time, location, link }) {
  return (
    <div className="gold-card place-card flex w-full flex-col items-center gap-6 md:flex-row md:items-center">
      <div className="flex h-36 w-36 flex-none items-center justify-center rounded-3xl bg-white shadow-inner">
        <Image src={icon} alt={title} width={120} height={120} className="object-contain" />
      </div>
      <div className="place-details flex w-full flex-col items-center gap-3 text-center md:items-start md:text-left">
        <h3 className="text-frase-gradient font-petrona text-2xl uppercase tracking-[0.2em]">{title}</h3>
        <p className="place-time font-semibold text-[#4a4f5e]">{time}</p>
        <p className="text-gray-700 font-libre max-w-2xl">{location}</p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="btn-gold btn-map font-petrona text-xs uppercase tracking-[0.26em] self-center md:self-start"
        >
          Ver ubicación
        </a>
      </div>
    </div>
  );
}

function PhotoSlideshow({ photos = [], interval = 5000 }) {
  const validPhotos = photos.filter(Boolean);
  const [current, setCurrent] = useState(0);
  const total = validPhotos.length;

  useEffect(() => {
    if (total <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, total]);

  const goTo = (nextIndex) => {
    if (!total) return;
    const normalized = ((nextIndex % total) + total) % total;
    setCurrent(normalized);
  };

  if (!total) {
    return null;
  }

  return (
    <div className="slideshow gold-card gold-card--soft">
      <div className="slideshow__stage">
        {validPhotos.map((photo, index) => (
          <div
            key={photo}
            className={`slideshow__slide${index === current ? " slideshow__slide--active" : ""}`}
          >
            <Image
              src={photo}
              alt={`Recuerdo ${index + 1} de Yamilet`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 90vw, 800px"
              className="slideshow__image"
            />
          </div>
        ))}
        <button
          type="button"
          className="slideshow__control slideshow__control--prev"
          onClick={() => goTo(current - 1)}
          aria-label="Ver foto anterior"
        >
          ‹
        </button>
        <button
          type="button"
          className="slideshow__control slideshow__control--next"
          onClick={() => goTo(current + 1)}
          aria-label="Ver foto siguiente"
        >
          ›
        </button>
      </div>
      <div className="slideshow__dots" role="tablist" aria-label="Fotos del recuerdo">
        {validPhotos.map((photo, index) => (
          <button
            key={photo}
            type="button"
            role="tab"
            aria-selected={index === current}
            aria-label={`Ver foto ${index + 1}`}
            className={`slideshow__dot${index === current ? " slideshow__dot--active" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
