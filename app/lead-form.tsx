"use client";

import { FormEvent, useState } from "react";
import { legalLinks } from "./legal-data";

type LeadFormProps = {
  variant: "hero" | "contact";
};

type SubmitState = "idle" | "sending" | "success" | "error";

const feedback = {
  success: "Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
  error: "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.",
} as const;

export function LeadForm({ variant }: LeadFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    setSubmitState("sending");

    try {
      const response = await fetch("/api/lead.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("message") ?? "",
          source: variant,
          consent: data.get("consent") === "on",
          website: data.get("website") ?? "",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error("Lead request was not accepted");
      }

      form.reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  const isSending = submitState === "sending";
  const statusMessage = submitState === "success" ? feedback.success : submitState === "error" ? feedback.error : "";
  const buttonLabel = isSending ? "Отправка…" : variant === "hero" ? "Записаться" : "Бесплатная консультация";

  const consent = (
    <label className="leadConsent">
      <input name="consent" type="checkbox" required />
      <span>
        Я согласен на обработку персональных данных. Подробнее: <a href={legalLinks.privacy}>политика обработки персональных данных</a> и <a href={legalLinks.consent}>согласие на обработку персональных данных</a>.
      </span>
    </label>
  );

  const formStatus = (
    <p className={`formFeedback ${submitState}`} role="status" aria-live="polite" aria-atomic="true">
      {statusMessage}
    </p>
  );

  const honeypot = <input className="leadHoneypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />;

  if (variant === "hero") {
    return (
      <form className="diagnosticForm leadForm" id="lead-form" onSubmit={handleSubmit}>
        <div className="formTitle">
          <span>Бесплатная консультация</span>
          <strong>Получите скидку 10% на ремонт</strong>
        </div>
        <div className="formFields">
          <label>
            <span>Имя</span>
            <input name="name" type="text" placeholder="Ваше имя" autoComplete="name" minLength={2} maxLength={80} required />
          </label>
          <label>
            <span>Телефон</span>
            <input
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              inputMode="tel"
              autoComplete="tel"
              pattern="[0-9+()\-\s]{7,}"
              maxLength={40}
              required
            />
          </label>
          <label className="commentField">
            <span>Сообщение</span>
            <input name="message" type="text" placeholder="Марка авто или симптом" maxLength={1000} />
          </label>
          <button type="submit" disabled={isSending}>{buttonLabel}</button>
        </div>
        {honeypot}
        {consent}
        {formStatus}
      </form>
    );
  }

  return (
    <form className="contactForm leadForm" onSubmit={handleSubmit}>
      <span>Бесплатная консультация</span>
      <h3>Опишите проблему — мастер свяжется с вами</h3>
      <label>
        Ваше имя
        <input name="name" type="text" placeholder="Имя" autoComplete="name" minLength={2} maxLength={80} required />
      </label>
      <label>
        Телефон
        <input
          name="phone"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9+()\-\s]{7,}"
          maxLength={40}
          required
        />
      </label>
      <label>
        Сообщение
        <textarea name="message" placeholder="Марка автомобиля и симптомы" rows={4} maxLength={1000} />
      </label>
      {honeypot}
      {consent}
      <button type="submit" disabled={isSending}>{buttonLabel} <span>→</span></button>
      {formStatus}
    </form>
  );
}
