"use client";

import { useRef } from "react";

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

  return (
    <details className="mobileMenu" ref={detailsRef}>
      <summary aria-label="Открыть меню">Меню</summary>
      <nav aria-label="Мобильная навигация">
        {menuItems.map((item) => (
          <a href={item.href} key={item.href} onClick={() => detailsRef.current?.removeAttribute("open")}>
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
