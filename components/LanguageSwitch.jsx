import { AVAILABLE_LANGUAGES, LANGUAGE_SHORT_LABELS, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitch({ className = "", appearance = "light" }) {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (event, code) => {
    event.stopPropagation();
    if (code !== language) {
      setLanguage(code);
    }
  };

  return (
    <div
      className={`language-switch language-switch--${appearance}${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Language selector"
    >
      {AVAILABLE_LANGUAGES.map((code) => {
        const isActive = code === language;
        return (
          <button
            key={code}
            type="button"
            className={`language-switch__option${isActive ? " is-active" : ""}`}
            aria-pressed={isActive}
            onClick={(event) => handleSelect(event, code)}
          >
            {LANGUAGE_SHORT_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
