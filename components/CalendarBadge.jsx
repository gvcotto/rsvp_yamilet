import { useLanguage } from "@/contexts/LanguageContext";

const EVENT_DAY = 20;
const MONTH_LABEL = {
  es: "Diciembre 2025",
  en: "December 2025",
};
const DAY_LABELS = {
  es: ["D", "L", "M", "M", "J", "V", "S"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

export default function CalendarBadge() {
  const { language } = useLanguage();
  const days = DAY_LABELS[language] || DAY_LABELS.es;
  const monthText = MONTH_LABEL[language] || MONTH_LABEL.es;
  const numbers = ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  return (
    <div className="cal-badge">
      <div className="cal-head">
        <span className="cal-dot" />
        <span className="h-font">{monthText}</span>
        <span className="cal-dot" />
      </div>
      <div className="cal-grid">
        {days.map((d, i) => (
          <div key={`d${i}`} className="cal-day">
            {d}
          </div>
        ))}
        {numbers.map((n, i) =>
          n === EVENT_DAY ? (
            <div key={`n${i}`} className="cal-num highlight">
              {EVENT_DAY}
            </div>
          ) : (
            <div key={`n${i}`} className="cal-num">
              {n || ""}
            </div>
          )
        )}
      </div>
    </div>
  );
}
