"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  variant: "hero" | "contact";
};

const endpoint = process.env.NEXT_PUBLIC_LEAD_FORM_ENDPOINT?.trim() ?? "";

const initialState = {
  kind: "idle" as const,
  message: "",
};

export function LeadForm({ variant }: LeadFormProps) {
  const [status, setStatus] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    if (!endpoint) {
      setStatus({
        kind: "error",
        message: "Онлайн-отправка пока не настроена. Пожалуйста, позвоните нам по телефону.",
      });
      return;
    }

    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");

    if (phone.length < 10) {
      setStatus({ kind: "error", message: "Укажите корректный номер телефона." });
      return;
    }

    setStatus(initialState);
    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          phone: String(data.get("phone") ?? "").trim(),
          message: String(data.get("message") ?? "").trim(),
          source: variant === "hero" ? "hero" : "contacts",
          pageUrl: window.location.href,
        }),
      });

      if (!response.ok) throw new Error(`Lead endpoint returned ${response.status}`);

      form.reset();
      setStatus({
        kind: "success",
        message: "Заявка отправлена. Мастер свяжется с вами в ближайшее время.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Не удалось отправить заявку. Проверьте соединение или позвоните нам по телефону.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (variant === "hero") {
    return (
      <form className="diagnosticForm leadForm" id="diagnostic-form" onSubmit={handleSubmit} noValidate>
        <div className="formTitle">
          <span>Бесплатная консультация</span>
          <strong>Получите скидку 10% на ремонт</strong>
        </div>
        <div className="formFields">
          <label>
            <span>Имя</span>
            <input name="name" type="text" placeholder="Ваше имя" autoComplete="name" required />
          </label>
          <label>
            <span>Телефон</span>
            <input
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              inputMode="tel"
              autoComplete="tel"
              pattern="[0-9+()\-\s]{10,}"
              required
            />
          </label>
          <label className="commentField">
            <span>Сообщение</span>
            <input name="message" type="text" placeholder="Марка авто или симптом" />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправка…" : "Записаться"}
          </button>
        </div>
        <p className="formConsent">Нажимая на кнопку, вы подтверждаете согласие с политикой конфиденциальности.</p>
        <p className={`formFeedback ${status.kind}`} role="status" aria-live="polite">
          {status.message}
        </p>
      </form>
    );
  }

  return (
    <form className="contactForm leadForm" onSubmit={handleSubmit} noValidate>
      <span>Бесплатная консультация</span>
      <h3>Опишите проблему — мастер свяжется с вами</h3>
      <label>
        Ваше имя
        <input name="name" type="text" placeholder="Имя" autoComplete="name" required />
      </label>
      <label>
        Телефон
        <input
          name="phone"
          type="tel"
          placeholder="+7 (___) ___-__-__"
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9+()\-\s]{10,}"
          required
        />
      </label>
      <label>
        Сообщение
        <textarea name="message" placeholder="Марка автомобиля и симптомы" rows={4} />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка…" : "Бесплатная консультация"} <span>→</span>
      </button>
      <small>Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности.</small>
      <p className={`formFeedback ${status.kind}`} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
