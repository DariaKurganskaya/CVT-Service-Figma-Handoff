"use client";

import { useEffect, useState } from "react";

type FloatingCallProps = {
  href: string;
};

export function FloatingCall({ href }: FloatingCallProps) {
  const [isNearContacts, setIsNearContacts] = useState(false);

  useEffect(() => {
    const contacts = document.getElementById("contacts");
    if (!contacts || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearContacts(entry.isIntersecting),
      { rootMargin: "0px 0px -120px 0px" },
    );

    observer.observe(contacts);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      className={`floatingCall${isNearContacts ? " floatingCallHidden" : ""}`}
      href={href}
      aria-label="Позвонить мастеру"
      aria-hidden={isNearContacts}
      tabIndex={isNearContacts ? -1 : undefined}
    >
      ☎
    </a>
  );
}
