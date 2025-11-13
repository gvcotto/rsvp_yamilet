import { useMemo, useState } from "react";

export default function GeneralRSVPForm() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [adults, setAdults] = useState([{ name: "" }]);
  const [children, setChildren] = useState([]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage("Por favor ingresa el nombre del contacto principal.");
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMessage("Necesitamos un número de contacto para confirmar.");
      return;
    }
    if (!cleanAdults.length) {
      setErrorMessage("Agrega al menos un adulto en la lista de invitados.");
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
        throw new Error(result?.error || "No pudimos registrar tu asistencia.");
      }
      setSuccessMessage("¡Gracias! Hemos recibido tu confirmación.");
      setContactName("");
      setContactPhone("");
      setAdults([{ name: "" }]);
      setChildren([]);
      setNote("");
    } catch (err) {
      setErrorMessage(err.message || "Ocurrió un error al enviar tu confirmación.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="rsvp-form__grid">
        <label className="rsvp-form__field">
          <span>Nombre del contacto *</span>
          <input
            type="text"
            className="input"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Ej. Claudia Natareno"
            required
          />
        </label>
        <label className="rsvp-form__field">
          <span>Teléfono *</span>
          <input
            type="tel"
            className="input"
            value={contactPhone}
            onChange={handlePhoneChange}
            inputMode="numeric"
            pattern="[0-9]+"
            placeholder="Ej. 4013653519"
            required
          />
        </label>
      </div>

      <div className="rsvp-form__group">
        <div className="rsvp-form__group-head">
          <p className="rsvp-form__group-title">Adultos que asistirán *</p>
          <button
            type="button"
            className="rsvp-form__small-btn"
            onClick={addAdult}
            disabled={adults.length >= 10}
          >
            + Agregar adulto
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
                placeholder={`Nombre del adulto ${index + 1}`}
              />
              {adults.length > 1 && (
                <button
                  type="button"
                  className="rsvp-form__remove"
                  onClick={() => removeAdult(index)}
                  aria-label={`Eliminar adulto ${index + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="rsvp-form__help">
          Adultos agregados: {totalAdults || 0}. Puedes incluir a todos los acompañantes
          mayores de edad.
        </p>
      </div>

      <div className="rsvp-form__group">
        <div className="rsvp-form__group-head">
          <p className="rsvp-form__group-title">Niños que asistirán</p>
          <button
            type="button"
            className="rsvp-form__small-btn"
            onClick={addChild}
            disabled={children.length >= 10}
          >
            + Agregar niño
          </button>
        </div>
        {children.length === 0 ? (
          <p className="rsvp-form__help">
            Si asistirán niños, agrega sus nombres para tenerlos presentes.
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
                    placeholder={`Nombre del niño ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="rsvp-form__remove"
                    onClick={() => removeChild(index)}
                    aria-label={`Eliminar niño ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="rsvp-form__help">
              Niños agregados: {totalChildren || 0}. Si ya no asistirán, elimina sus nombres.
            </p>
          </>
        )}
      </div>

      <label className="rsvp-form__field">
        <span>Comentarios adicionales (opcional)</span>
        <textarea
          className="textarea"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej. Somos alérgicos a los frutos secos."
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
        {submitting ? "Enviando..." : "Confirmar asistencia"}
      </button>
    </form>
  );
}
