import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const COUNTDOWN_LABELS = {
  es: { days: "Días", hours: "Horas", minutes: "Min", seconds: "Seg" },
  en: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
};

export default function Countdown({ targetISO }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetISO).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const { language } = useLanguage();
  const labels = COUNTDOWN_LABELS[language] || COUNTDOWN_LABELS.es;

  return (
    <div className="countdown-wrap">
      <Item value={timeLeft.days} label={labels.days} />
      <Item value={timeLeft.hours} label={labels.hours} />
      <Item value={timeLeft.minutes} label={labels.minutes} />
      <Item value={timeLeft.seconds} label={labels.seconds} />
    </div>
  );
}

function Item({ value, label }) {
  return (
    <div className="count-item">
      <div className="count-num h-font">{String(value).padStart(2, "0")}</div>
      <div className="count-lbl">{label}</div>
    </div>
  );
}
