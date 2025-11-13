import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";

const FORM_COPY = {
  es: {
    contactNameLabel: "Nombre del contacto *",
    contactNamePlaceholder: "Ej. Claudia Natareno",
    contactPhoneLabel: "Teléfono *",
    contactPhonePlaceholder: "Ej. 4013653519",
    adultsTitle: "Adultos que asistirán *",
    addAdult: "+ Agregar adulto",
    adultPlaceholder: "Nombre del adulto {index}",
    removeAdult: "Eliminar adulto {index}",
    adultSummary: "Adultos agregados: {count}. Puedes incluir a todos los acompañantes mayores de edad.",
    childrenTitle: "Niños que asistirán",
    addChild: "+ Agregar niño",
    childPlaceholder: "Nombre del niño {index}",
    removeChild: "Eliminar niño {index}",
    noChildrenHelp: "Si asistirán niños, agrega sus nombres para tenerlos presentes.",
    childSummary: "Niños agregados: {count}. Si ya no asistirán, elimina sus nombres.",
    noteLabel: "Comentarios adicionales (opcional)",
    notePlaceholder: "Ej. Somos alérgicos a los frutos secos.",
    contactNameError: "Por favor ingresa el nombre del contacto principal.",
    contactPhoneError: "Necesitamos un número de contacto para confirmar.",
    adultListError: "Agrega al menos un adulto en la lista de invitados.",
    submitError: "No pudimos registrar tu asistencia.",
    genericError: "Ocurrió un error al enviar tu confirmación.",
    success: "¡Gracias! Hemos recibido tu confirmación.",
    submit: "Confirmar asistencia",
    submitting: "Enviando...",
  },
  en: {
    contactNameLabel: "Primary contact name *",
    contactNamePlaceholder: "e.g. Claudia Natareno",
    contactPhoneLabel: "Phone number *",
    contactPhonePlaceholder: "e.g. 4013653519",
    adultsTitle: "Adults attending *",
    addAdult: "+ Add adult",
    adultPlaceholder: "Adult {index} full name",
    removeAdult: "Remove adult {index}",
    adultSummary: "Adults added: {count}. Include every adult guest in your group.",
    childrenTitle: "Children attending",
    addChild: "+ Add child",
    childPlaceholder: "Child {index} full name",
    removeChild: "Remove child {index}",
    noChildrenHelp: "If kids will attend, add their names so we can plan for them.",
    childSummary: "Children added: {count}. Remove their names if they can no longer attend.",
    noteLabel: "Additional comments (optional)",
    notePlaceholder: "e.g. We are allergic to nuts.",
    contactNameError: "Please enter the main contact's name.",
    contactPhoneError: "We need a contact number to confirm.",
    adultListError: "Add at least one adult to your guest list.",
    submitError: "We couldn't record your RSVP.",
    genericError: "Something went wrong while sending your RSVP.",
    success: "Thank you! We have received your RSVP.",
    submit: "Confirm attendance",
    submitting: "Sending...",
  },
};

export default function GeneralRSVPForm() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [adults, setAdults] = useState([{ name: "" }]);
  const [children, setChildren] = useState([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { language } = useLanguage();
  const text = FORM_COPY[language] || FORM_COPY.es;

  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [language]);

  const totalAdults = useMemo(
    () => adults.map((adult) => adult.name.trim()).filter(Boolean).length,
    [adults]
  );
  const totalChildren = useMemo(
    () => children.map((child) => child.name.trim()).filter(Boolean).length,
    [children]
  );

  const addAdult = () => {
    setAdults((prev) => [...prev, { name: "" }]);
  };

  const addChild = () => {
    setChildren((prev) => [...prev, { name: "" }]);
  };

  const updateAdult = (index, value) => {
    setAdults((prev) =>
      prev.map((adult, idx) => (idx === index ? { ...adult, name: value } : adult))
    );
  };

  const updateChild = (index, value) => {
    setChildren((prev) =>
      prev.map((child, idx) => (idx === index ? { ...child, name: value } : child))
    );
  };

  const removeAdult = (index) => {
    setAdults((prev) => prev.filter((_, idx) => idx !== index));
  };

  const removeChild = (index) => {
    setChildren((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D+/g, "");
    setContactPhone(digitsOnly);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanAdults = adults.map((adult) => adult.name.trim()).filter(Boolean);
    if (!contactName.trim()) {
      setErrorMessage(text.contactNameError);
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMessage(text.contactPhoneError);
      return;
    }
    if (!cleanAdults.length) {
      setErrorMessage(text.adultListError);
      return;
    }

    const childEntries = children.map((child) => child.name.trim()).filter(Boolean);
    const members = [
      ...cleanAdults.map((name) => ({ name, type: "adult" })),
      ...childEntries.map((name) => ({ name, type: "child" })),
    ];

    const payload = {
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      answer: "SI",
      guests: members.length,
      members,
      note: JSON.stringify({
        comment: note.trim(),
        members,
        adultsCount: cleanAdults.length,
        childrenCount: childEntries.length,
      }),
      receivedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || result?.ok === false) {
        throw new Error(result?.error || text.submitError);
      }
      setSuccessMessage(text.success);
      setContactName("");
      setContactPhone("");
      setAdults([{ name: "" }]);
      setChildren([]);
      setNote("");
    } catch (err) {
      setErrorMessage(err.message || text.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="rsvp-form__grid">
        <label className="rsvp-form__field">
          <span>{text.contactNameLabel}</span>
          <input
            type="text"
            className="input"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder={text.contactNamePlaceholder}
            required
          />
        </label>
        <label className="rsvp-form__field">
          <span>{text.contactPhoneLabel}</span>
          <input
            type="tel"
            className="input"
            value={contactPhone}
            onChange={handlePhoneChange}
            inputMode="numeric"
            pattern="[0-9]+"
            placeholder={text.contactPhonePlaceholder}
            required
          />
        </label>
      </div>

      <div className="rsvp-form__group">
        <div className="rsvp-form__group-head">
          <p className="rsvp-form__group-title">{text.adultsTitle}</p>
          <button
            type="button"
            className="rsvp-form__small-btn"
            onClick={addAdult}
            disabled={adults.length >= 10}
          >
            {text.addAdult}
          </button>
        </div>
        <div className="rsvp-form__adults">
          {adults.map((adult, index) => (
            <div key={`adult-${index}`} className="rsvp-form__adult-row">
              <input
                type="text"
                className="input"
                value={adult.name}
                onChange={(e) => updateAdult(index, e.target.value)}
                placeholder={text.adultPlaceholder.replace("{index}", String(index + 1))}
              />
              {adults.length > 1 && (
                <button
                  type="button"
                  className="rsvp-form__remove"
                  onClick={() => removeAdult(index)}
                  aria-label={text.removeAdult.replace("{index}", String(index + 1))}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="rsvp-form__help">
          {text.adultSummary.replace("{count}", String(totalAdults || 0))}
        </p>
      </div>

      <div className="rsvp-form__group">
        <div className="rsvp-form__group-head">
          <p className="rsvp-form__group-title">{text.childrenTitle}</p>
          <button
            type="button"
            className="rsvp-form__small-btn"
            onClick={addChild}
            disabled={children.length >= 10}
          >
            {text.addChild}
          </button>
        </div>
        {children.length === 0 ? (
          <p className="rsvp-form__help">
            {text.noChildrenHelp}
          </p>
        ) : (
          <>
            <div className="rsvp-form__adults">
              {children.map((child, index) => (
                <div key={`child-${index}`} className="rsvp-form__adult-row">
                  <input
                    type="text"
                    className="input"
                    value={child.name}
                    onChange={(e) => updateChild(index, e.target.value)}
                    placeholder={text.childPlaceholder.replace("{index}", String(index + 1))}
                  />
                  <button
                    type="button"
                    className="rsvp-form__remove"
                    onClick={() => removeChild(index)}
                    aria-label={text.removeChild.replace("{index}", String(index + 1))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="rsvp-form__help">
              {text.childSummary.replace("{count}", String(totalChildren || 0))}
            </p>
          </>
        )}
      </div>

      <label className="rsvp-form__field">
        <span>{text.noteLabel}</span>
        <textarea
          className="textarea"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={text.notePlaceholder}
        />
      </label>

      {errorMessage && (
        <p className="rsvp-form__message rsvp-form__message--error" role="alert">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="rsvp-form__message rsvp-form__message--success" role="status">
          {successMessage}
        </p>
      )}

      <button type="submit" className="btn-gold rsvp-form__submit" disabled={submitting}>
        {submitting ? text.submitting : text.submit}
      </button>
    </form>
  );
}
