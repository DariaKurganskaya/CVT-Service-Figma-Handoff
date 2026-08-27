"use client";

import { useRef, useState } from "react";

const menuItems = [
  { href: "#about", label: "О нас" },
  { href: "#services", label: "Услуги" },
  { href: "#process", label: "Как мы работаем" },
  { href: "#brands", label: "Марки авто" },
  { href: "#guarantee", label: "Гарантия" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function MobileMenu() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details className="mobileMenu" ref={detailsRef} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
      <summary aria-label={isOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={isOpen}>Меню</summary>
      <nav aria-label="Мобильная навигация">
        {menuItems.map((item) => (
          <a href={item.href} key={item.href} onClick={() => {
            detailsRef.current?.removeAttribute("open");
            setIsOpen(false);
          }}>
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
