import { LeadForm } from "./lead-form";
import { MobileMenu } from "./mobile-menu";

const contacts = {
  phoneDisplay: "+7 (950) 701-82-52",
  phoneHref: "tel:+79507018252",
  address: "г. Москва, Ступинский проезд 5 стр. 6",
  email: "info@remontvariator.ru",
  emailHref: "mailto:info@remontvariator.ru",
  mapText: "г. Москва, Ступинский проезд 5 стр. 6",
};

const mapQuery = encodeURIComponent(contacts.mapText);

const stats = [
  { value: "16+", label: "лет специализации" },
  { value: "8 500+", label: "восстановленных CVT" },
  { value: "2–3", label: "дня средний ремонт" },
  { value: "96%", label: "клиентов рекомендуют" },
];

const services = [
  {
    number: "01",
    title: "Диагностика вариатора",
    text: "Проверяем ошибки, давление, состояние масла и точно определяем причину неисправности.",
  },
  {
    number: "02",
    title: "Снятие и монтаж",
    text: "Аккуратно снимаем коробку, сохраняем крепёж и подготавливаем агрегат к дефектовке.",
  },
  {
    number: "03",
    title: "Разборка и дефектовка",
    text: "Показываем износ деталей, согласовываем смету и фиксируем стоимость до начала ремонта.",
  },
  {
    number: "04",
    title: "Ремонт механической части",
    text: "Восстанавливаем конусы, ремень, подшипники и другие узлы вариатора.",
  },
  {
    number: "05",
    title: "Ремонт гидроблока и СУ",
    text: "Диагностируем гидравлическую систему, соленоиды и блок управления.",
  },
  {
    number: "06",
    title: "Ремонт электроники",
    text: "Устраняем электронные неисправности и восстанавливаем корректную работу CVT.",
  },
  {
    number: "07",
    title: "Сборка и установка",
    text: "Собираем коробку, устанавливаем, адаптируем и проверяем автомобиль в движении.",
  },
];

const process = [
  ["01", "Приёмка", "Выслушиваем симптомы и проводим первичный осмотр автомобиля."],
  ["02", "Диагностика", "За 30 минут определяем неисправность и готовим понятную смету."],
  ["03", "Согласование", "Фиксируем стоимость в заказ-наряде до начала работ."],
  ["04", "Ремонт", "Восстанавливаем вариатор и присылаем фотоотчёт по этапам."],
  ["05", "Проверка", "Выполняем адаптацию, тест-драйв и выдаём гарантию."],
];

const reviews = [
  {
    text: "Обратился с сильными рывками при разгоне. В сервисе быстро провели диагностику, объяснили причину поломки и согласовали стоимость ремонта. После ремонта вариатор работает плавно, как новый.",
    name: "Михаил Иванов",
    car: "Nissan X-Trail",
  },
  {
    text: "Очень понравился подход к работе — всё показали, рассказали и не навязывали лишние услуги. Заменили ремень и обслужили гидроблок, машина поехала намного лучше.",
    name: "Руслан Малинин",
    car: "Toyota RAV4",
  },
  {
    text: "Долго искал сервис именно по вариаторам и не пожалел, что приехал сюда. Сделали ремонт быстрее обещанного срока, дали гарантию и рекомендации по эксплуатации.",
    name: "Тимофей Зверев",
    car: "Mitsubishi Outlander",
  },
  {
    text: "На панели постоянно появлялась ошибка CVT, автомобиль начал дёргаться. Здесь быстро нашли проблему, устранили неисправность и адаптировали коробку. Уже несколько месяцев всё работает отлично.",
    name: "Георгий Беляев",
    car: "Subaru Forester",
  },
  {
    text: "Грамотные мастера и нормальные цены. До этого в другом сервисе предлагали менять весь вариатор, а здесь восстановили неисправный узел и сэкономили мне большую сумму.",
    name: "Александр Моисеев",
    car: "Honda CR-V",
  },
  {
    text: "Отличный сервис по ремонту вариаторов. Видно, что специалисты действительно разбираются в CVT: точная диагностика, аккуратная работа и подробный отчёт по ремонту.",
    name: "Захар Мельников",
    car: "Audi A4",
  },
];

const brands = [
  { name: "Nissan", src: "/brands/nissan.png" },
  { name: "Toyota", src: "/brands/toyota.png" },
  { name: "Mitsubishi", src: "/brands/mitsubishi.png" },
  { name: "Subaru", src: "/brands/subaru.png" },
  { name: "Honda", src: "/brands/honda.png" },
  { name: "Audi", src: "/brands/audi.png" },
  { name: "Renault", src: "/brands/renault.png" },
  { name: "Volkswagen", src: "/brands/volkswagen.png" },
  { name: "Jeep", src: "/brands/jeep.png" },
  { name: "Kia", src: "/brands/kia.png" },
  { name: "Hyundai", src: "/brands/hyundai.png" },
  { name: "Volvo", src: "/brands/volvo.png" },
];

const socialLinks = [
  { name: "MAX", href: "https://web.max.ru/", icon: "/social/max.png" },
  { name: "Telegram", href: "https://t.me/inkom10", icon: "/social/telegram.png" },
  { name: "WhatsApp", href: "https://wa.me/79014037963", icon: "/social/whatsapp.png" },
];

function SocialLinks({ className }: { className: string }) {
  return (
    <div className={className} aria-label="Мессенджеры">
      {socialLinks.map((social) => (
        <a href={social.href} aria-label={social.name} title={social.name} target="_blank" rel="noopener noreferrer" key={social.name}>
          <img src={social.icon} alt="" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function SectionCta() {
  return (
    <div className="sectionCta">
      <div>
        <strong>Бесплатная консультация</strong>
        <span>Записаться на бесплатную проверку</span>
      </div>
      <a href="#diagnostic-form">Бесплатная консультация <span>→</span></a>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="heroShade" aria-hidden="true" />

        <header className="siteHeader shell">
          <a className="brand" href="#top" aria-label="CVT Сервис — на главную">
            <img src="/client-logo-clean.png" alt="CVT Сервис — ремонт вариаторов" />
          </a>

          <a className="headerPhone" href={contacts.phoneHref}>
            {contacts.phoneDisplay}
          </a>

          <div className="headerMeta">
            <span className="headerAddress"><strong>Ступинский проезд 5 стр. 6</strong><br />Москва</span>
            <span className="headerHours">Пн–Вс: с 08:00<br />до 21:00</span>
          </div>

          <SocialLinks className="headerSocials" />
          <MobileMenu />
        </header>

        <div className="heroContent shell">
          <div className="heroCard">
            <p className="eyebrow">специализированный сервис cvt</p>
            <h1 aria-label="Профессиональный ремонт вариаторов (CVT) авто разных марок с гарантией до 24 месяцев">
              <span>Профессиональный ремонт</span>
              <span>вариаторов (CVT) авто</span>
              <span>разных марок с гарантией</span>
              <span className="heroTitleRed">до 24 месяцев</span>
            </h1>

            <h2>Бесплатно за 30 минут найдём причину неисправности*, и согласуем стоимость до начала ремонта</h2>
            <p>
              Ремонтируем вариаторы абсолютно всех марок авто. Показываем каждый этап работ,
              заранее согласовываем смету и даём гарантию до 2 лет.
            </p>
          </div>

          <LeadForm variant="hero" />

          <div className="heroStats" aria-label="Показатели сервиса">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="sectionNav" aria-label="Навигация по странице">
        <div className="shell">
          <a href="#about">О нас</a>
          <a href="#process">Как мы работаем</a>
          <a href="#services">Виды работ</a>
          <a href="#brands">Марки авто</a>
          <a href="#guarantee">Гарантия</a>
          <a href="#reviews">Отзывы</a>
          <a href="#contacts">Контакты</a>
        </div>
      </nav>

      <section className="about section" id="about">
        <div className="shell aboutGrid">
          <div className="sectionHeading">
            <p className="eyebrow">о нас</p>
            <h2>Мы эксперты<br />в области ремонта<br /><span>вариаторов</span></h2>
          </div>

          <div className="aboutCopy">
            <p className="largeCopy">
              Уже более 16 лет занимаемся диагностикой, обслуживанием и восстановлением вариаторов CVT автомобилей абсолютно всех марок авто. Перед ремонтом проводим диагностику и дефектовку, показываем состояние деталей, согласуем перечень работ и стоимость, а также выполняем:
            </p>
            <ul className="aboutList">
              <li>Диагностика механической части, гидроблока и электроники</li>
              <li>Фото- и видеоотчёт по дефектовке</li>
              <li>Согласование стоимости до начала ремонта</li>
              <li>Гарантия на выполненные работы и установленные запчасти</li>
            </ul>
            <a className="aboutCtaButton" href="#diagnostic-form">
              Записаться на диагностику <span>→</span>
            </a>
          </div>

          <figure className="aboutPhoto">
            <img src="/service-diagnostic.webp" alt="Специалист проводит диагностику вариатора" />
            <figcaption>Специализация — только CVT</figcaption>
          </figure>

          <div className="metricRail">
            <div><small>диагностика</small><strong>30 минут</strong></div>
            <div><small>срок ремонта</small><strong>2–3 дня</strong></div>
            <div><small>смета</small><strong>до работ</strong></div>
            <div><small>гарантия</small><strong>до 24 мес.</strong></div>
          </div>
          <SectionCta />
        </div>
      </section>

      <section className="services section" id="services">
        <div className="shell">
          <div className="splitHeading">
            <div className="sectionHeading">
              <p className="eyebrow">наши услуги</p>
              <h2>Всё необходимое<br />для восстановления <span>CVT</span></h2>
            </div>
            <p>
              Вариатор — одна из самых сложных частей современного автомобиля,
              поэтому его не стоит ремонтировать в обычном автосервисе. Для этого есть мы.
            </p>
          </div>

          <div className="serviceGrid">
            {services.map((service, index) => (
              <article className={`serviceItem${index === services.length - 1 ? " serviceItemWide" : ""}`} key={service.number}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#diagnostic-form" aria-label={`Записаться: ${service.title}`}>→</a>
              </article>
            ))}
          </div>

          <p className="finePrint">
            Цена зависит от модели коробки, степени износа и необходимости замены деталей.
            После диагностики фиксируем стоимость в заказ-наряде.
          </p>
          <SectionCta />
        </div>
      </section>

      <section className="process section" id="process">
        <div className="shell">
          <div className="processGrid">
            <div className="processVisual">
              <img src="/process-repair-real.jpg" alt="Мастер непосредственно ремонтирует вариатор в сервисе" />
              <div className="visualBadge"><strong>30</strong><span>минут<br />на диагностику*</span></div>
            </div>

            <div className="processContent">
              <div className="sectionHeading">
                <p className="eyebrow">как мы работаем</p>
                <h2>Понятный ремонт<br /><span>без сюрпризов</span></h2>
              </div>
              <div className="processList">
                {process.map(([number, title, text]) => (
                  <div className="processStep" key={number}>
                    <span>{number}</span>
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SectionCta />
        </div>
      </section>

      <section className="brands section" id="brands">
        <div className="shell">
          <div className="splitHeading compact">
            <div className="sectionHeading">
              <p className="eyebrow">работаем с разными марками</p>
              <h2>Знаем особенности<br /><span>каждого вариатора</span></h2>
            </div>
            <p>Диагностируем и восстанавливаем CVT автомобилей разных производителей.</p>
          </div>
          <div className="brandGrid">
            {brands.map((brand) => (
              <figure key={brand.name} title={brand.name}>
                <img src={brand.src} alt={`Логотип ${brand.name}`} />
              </figure>
            ))}
          </div>
          <SectionCta />
        </div>
      </section>

      <section className="guarantee section" id="guarantee">
        <div className="shell">
          <div className="guaranteeCard">
            <div className="guaranteeLead">
              <p className="eyebrow">гарантия</p>
              <h2>Отвечаем за<br />результат ремонта</h2>
              <p>
                Условия гарантии заранее прописываем в документах — срок зависит
                от выполненных работ и установленных деталей.
              </p>
              <a className="lightButton" href="#diagnostic-form">БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ <span>→</span></a>
            </div>
            <div className="guaranteeBenefits">
              <article><span>01</span><strong>до 24 месяцев</strong><p>На выполненные работы и восстановленные узлы вариатора.</p></article>
              <article><span>02</span><strong>на запчасти</strong><p>Подтверждаем происхождение деталей и фиксируем их в заказ-наряде.</p></article>
              <article><span>03</span><strong>всё официально</strong><p>Вы получаете договор, акт выполненных работ и понятные условия.</p></article>
              <div className="guaranteeNote"><b>✓</b><span><strong>Стоимость и гарантия фиксируются до ремонта</strong><small>Никаких устных обещаний и неожиданных доплат после выдачи автомобиля.</small></span></div>
            </div>
          </div>
          <SectionCta />
        </div>
      </section>

      <section className="reviews section" id="reviews">
        <div className="shell">
          <div className="splitHeading compact">
            <div className="sectionHeading">
              <p className="eyebrow">отзывы</p>
              <h2>Что говорят<br /><span>наши клиенты</span></h2>
            </div>
            <p>Здесь вы можете ознакомиться с отзывами о нашей работе.</p>
          </div>
          <div className="reviewGrid">
            {reviews.slice(0, 3).map((review) => (
              <article className="reviewCard" key={review.name}>
                <div className="stars" aria-label="5 из 5">★★★★★</div>
                <p>«{review.text}»</p>
                <footer><strong>{review.name}</strong><span>{review.car}</span></footer>
              </article>
            ))}
          </div>
          <SectionCta />
        </div>
      </section>

      <section className="contact section" id="contacts">
        <div className="shell contactWrap">
          <div className="contactGrid">
            <div className="contactInfo">
              <p className="eyebrow">контакты</p>
              <h2>Остались вопросы?<br /><span>Позвоните мастеру</span></h2>
              <p>
                Мы не просто ремонтируем вариаторы, а занимаемся любимым делом.
                Наши мастера регулярно повышают квалификацию и знают устройство
                новейших автомобилей.
              </p>
              <a className="bigPhone" href={contacts.phoneHref}>{contacts.phoneDisplay}</a>
              <div className="contactRows">
                <div><small>Адрес сервиса</small><strong>{contacts.address}</strong></div>
                <div><small>Часы работы</small><strong>Пн–Вс: 08:00–21:00</strong></div>
                <div className="contactEmail"><small>Почта</small><a href={contacts.emailHref}>{contacts.email}</a></div>
              </div>
            </div>

            <LeadForm variant="contact" />
          </div>

          <div className="mapCard">
            <div className="mapCaption">
              <span>Как нас найти</span>
              <strong>{contacts.address}</strong>
              <a href={`https://yandex.ru/maps/?text=${mapQuery}`} target="_blank" rel="noopener noreferrer">Построить маршрут →</a>
            </div>
            <iframe
              src={`https://yandex.ru/map-widget/v1/?text=${mapQuery}&z=16`}
              title={`Интерактивная карта — ${contacts.address}`}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <SectionCta />
        </div>
      </section>

      <footer className="footer">
        <div className="shell footerInner">
          <div className="footerAbout">
            <a className="footerBrand" href="#top" aria-label="CVT Сервис — наверх"><img src="/client-logo-clean.png" alt="CVT Сервис — ремонт вариаторов" /></a>
            <p>Специализированный ремонт вариаторов в Москве и области.</p>
            <SocialLinks className="footerSocials" />
          </div>

          <nav className="footerMenu" aria-label="Навигация в подвале">
            <strong>Меню</strong>
            <a href="#about">О нас</a>
            <a href="#services">Услуги</a>
            <a href="#process">Как мы работаем</a>
            <a href="#guarantee">Гарантия</a>
            <a href="#reviews">Отзывы</a>
            <a href="#contacts">Контакты</a>
          </nav>

          <div className="footerContacts">
            <strong>Контакты</strong>
            <a className="footerPhone" href={contacts.phoneHref}>{contacts.phoneDisplay}</a>
            <span>{contacts.address}</span>
            <span>Пн–Вс: 08:00–21:00</span>
            <a href={contacts.emailHref}>{contacts.email}</a>
          </div>

          <div className="footerBottom"><small>© 2026 CVT Сервис. Все права защищены.</small><small>Политика конфиденциальности · Политика обработки cookie</small></div>
        </div>
      </footer>

      <a className="floatingCall" href={contacts.phoneHref} aria-label="Позвонить мастеру">☎</a>
    </main>
  );
}
