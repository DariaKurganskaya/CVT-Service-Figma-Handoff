import Link from "next/link";
import { siteData } from "./legal-data";

type LegalPageProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <main className="legalPage">
      <article className="legalDocument">
        <Link className="legalBack" href="/">← Вернуться на главную</Link>
        <p className="legalEyebrow">CVT Сервис · {siteData.domain}</p>
        <h1>{title}</h1>
        <p className="legalVersion">{siteData.documentVersion}</p>
        <div className="legalBody">{children}</div>
        <footer className="legalFooter">
          <p>Контакт для связи с сервисом: <a href={siteData.contacts.emailHref}>{siteData.contacts.email}</a>, <a href={siteData.contacts.phoneHref}>{siteData.contacts.phoneDisplay}</a>.</p>
          <Link href="/">На главную</Link>
        </footer>
      </article>
    </main>
  );
}
