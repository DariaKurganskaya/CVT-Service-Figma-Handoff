"use client";

import { FormEvent } from "react";
import { legalLinks } from "./legal-data";

type LeadFormProps = {
  variant: "hero" | "contact";
};

export function LeadForm({ variant }: LeadFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  if (variant === "hero") {
    return (
      <form className="diagnosticForm leadForm" id="lead-form" onSubmit={handleSubmit} noValidate>
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
          <button type="submit">Записаться</button>
        </div>
        <p className="formConsent">
          Нажимая на кнопку, вы подтверждаете согласие с <a href={legalLinks.privacy}>политикой обработки персональных данных</a> и <a href={legalLinks.consent}>согласием на обработку персональных данных</a>.
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
      <button type="submit">Бесплатная консультация <span>→</span></button>
      <small>
        Нажимая на кнопку, вы подтверждаете согласие с <a href={legalLinks.privacy}>политикой обработки персональных данных</a> и <a href={legalLinks.consent}>согласием на обработку персональных данных</a>.
      </small>
    </form>
  );
}
