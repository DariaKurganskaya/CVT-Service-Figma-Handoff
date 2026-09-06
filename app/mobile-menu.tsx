"use client";

import { useEffect, useRef, useState } from "react";

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
  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    const updateDockedState = () => setIsDocked(window.scrollY > 160);
    updateDockedState();
    window.addEventListener("scroll", updateDockedState, { passive: true });
    return () => window.removeEventListener("scroll", updateDockedState);
  }, []);

  return (
    <details className={`mobileMenu${isDocked ? " mobileMenuDocked" : ""}`} ref={detailsRef} onToggle={(event) => setIsOpen(event.currentTarget.open)}>
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
