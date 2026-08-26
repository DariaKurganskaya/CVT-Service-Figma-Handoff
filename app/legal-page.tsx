import Link from "next/link";
import { legalSiteData } from "./legal-data";

type LegalPageProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="legalPage">
      <article className="legalDocument">
        <Link className="legalBack" href="/">← Вернуться на главную</Link>
        <p className="legalEyebrow">CVT Сервис · {legalSiteData.domain}</p>
        <h1>{title}</h1>
        <p className="legalVersion">{legalSiteData.documentVersion}</p>
        <div className="legalBody">{children}</div>
        <footer className="legalFooter">
          <p>Контакт для связи с сервисом: <a href={`mailto:${legalSiteData.email}`}>{legalSiteData.email}</a>, <a href="tel:+79507018252">{legalSiteData.phone}</a>.</p>
          <Link href="/">На главную</Link>
        </footer>
      </article>
    </main>
  );
}
