import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ContactForm from '../components/forms/ContactForm';
import ContactInfo from '../components/ContactInfo';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams();

  const currentLang = useMemo(() => {
    if (lang === 'pt' || lang === 'en') return lang;
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [lang, i18n.language]);

  const content = useMemo(() => {
    const pt = {
      seoTitle: 'Contato | Comerc IA’s',
      seoDesc: 'Fale com a Comerc IA’s: orçamento, dúvidas e produção de criativos, vídeos e sites com padrão premium.',
      
      badge: 'Contato',
      title: 'Vamos transformar sua ideia em um material que vende.',
      subtitle: 'Conte seu objetivo e eu retorno com um caminho claro: conceito, referências, prazo e o melhor formato pra sua campanha.',
      
      ctaBudget: 'Fazer orçamento',
      ctaWhats: 'WhatsApp',
      
      formTitle: 'Envie sua mensagem',
      formTag: 'Resposta rápida',
      formDesc: 'Para eu te responder com precisão, me diga: nicho, objetivo (venda, marca, tráfego), prazo e onde vai postar.',
      formNote: 'Dica: se você tiver referência (site, vídeo, reel), cole o link na mensagem — eu uso isso para acertar o estilo mais rápido.',
      
      infoTitle: 'Outros canais',
      infoDesc: 'Se preferir, fale direto por WhatsApp. Respondemos rápido em dias úteis e já organizamos o briefing com você.',
      
      miniCtaTitle: 'Quer acelerar o processo?',
      miniCtaDesc: 'Se você já quer chegar no objetivo final, faça o orçamento e eu te conduzo pelas opções.',
      miniCtaBtn: 'Ir para orçamento',
      
      processTitle: 'O que acontece depois?',
      steps: [
        { num: '01', title: 'Briefing em 15 minutos', desc: 'Você envia o essencial e eu devolvo um plano de execução.' },
        { num: '02', title: 'Proposta enxuta', desc: 'Formato, prazo e valor — sem enrolação, com clareza.' },
        { num: '03', title: 'Produção e entrega', desc: 'Criativos, vídeos e páginas no padrão premium.' },
      ],
      
      trustTitle: 'Resultados que importam',
      trustDesc: 'Projetos com foco em conversão, retenção e percepção de marca. Direção + estética + execução rápida.',
      trustBullets: [
        'Criativos e vídeos com “cara de marca grande”',
        'Landing pages e sites pensados para conversão',
        'Roteiro, motion, design e entrega com consistência',
      ],
      
      testimonialsTitle: 'Depoimentos',
      testimonials: [
        {
          name: 'Clínica Aurora',
          role: 'Saúde • Tráfego local',
          quote: 'Em uma semana a percepção da marca mudou. O criativo ficou “premium” e o atendimento ficou mais fácil.',
        },
        {
          name: 'Vitta Store',
          role: 'E-commerce • Performance',
          quote: 'A estética ficou absurda. Melhorou CTR e o público passou a confiar mais na oferta.',
        },
        {
          name: 'NeoFit Studio',
          role: 'Fitness • Conteúdo',
          quote: 'Ritmo de entrega muito acima do normal. Os vídeos ficaram com energia e clareza de CTA.',
        },
      ],
      
      bottomTitle: 'Pronto para elevar o nível da sua presença digital?',
      bottomDesc: 'Me diga o que você quer vender e eu monto uma direção criativa com entrega premium.',
      bottomBtn: 'Chamar no WhatsApp',
    };

    const en = {
      seoTitle: 'Contact | Comerc IA’s',
      seoDesc: 'Contact Comerc IA’s: quotes, questions, and premium production of creatives, videos, and websites.',
      
      badge: 'Contact',
      title: 'Let’s turn your idea into an asset that sells.',
      subtitle: 'Tell us your goal and we’ll return with a clear path: concept, references, timeline, and the best format for your campaign.',
      
      ctaBudget: 'Get a quote',
      ctaWhats: 'WhatsApp',
      
      formTitle: 'Send a message',
      formTag: 'Fast reply',
      formDesc: 'For a precise answer, tell me: niche, goal (sales, branding, traffic), deadline, and where you will post it.',
      formNote: 'Tip: if you have a reference (site, video, reel), paste the link in the message — I use it to nail the style faster.',
      
      infoTitle: 'Other channels',
      infoDesc: 'If you prefer, talk directly via WhatsApp. We reply fast on business days and organize the briefing with you.',
      
      miniCtaTitle: 'Want to speed it up?',
      miniCtaDesc: 'If you want to get straight to the point, generate a quote and I will guide you through the options.',
      miniCtaBtn: 'Go to Quote',
      
      processTitle: 'What happens next?',
      steps: [
        { num: '01', title: '15-minute Briefing', desc: 'You send the essentials, and I return an execution plan.' },
        { num: '02', title: 'Lean Proposal', desc: 'Format, timeline, and value — no fluff, just clarity.' },
        { num: '03', title: 'Production & Delivery', desc: 'Creatives, videos, and pages with a premium standard.' },
      ],
      
      trustTitle: 'Results that matter',
      trustDesc: 'Projects focused on conversion, retention, and brand perception. Direction + aesthetics + fast execution.',
      trustBullets: [
        'Creatives and videos with a "big brand" look',
        'Landing pages and sites designed for conversion',
        'Script, motion, design, and consistent delivery',
      ],
      
      testimonialsTitle: 'Testimonials',
      testimonials: [
        {
          name: 'Aurora Clinic',
          role: 'Health • Local Ads',
          quote: 'Brand perception changed in a week. The creative looked "premium" and customer service became easier.',
        },
        {
          name: 'Vitta Store',
          role: 'E-commerce • Performance',
          quote: 'The aesthetics are insane. CTR improved and the audience started trusting the offer more.',
        },
        {
          name: 'NeoFit Studio',
          role: 'Fitness • Content',
          quote: 'Delivery pace way above average. The videos have energy and clear CTAs.',
        },
      ],
      
      bottomTitle: 'Ready to level up your digital presence?',
      bottomDesc: 'Tell me what you want to sell, and I will build a creative direction with premium delivery.',
      bottomBtn: 'Chat on WhatsApp',
    };

    return currentLang === 'en' ? en : pt;
  }, [currentLang]);

  return (
    <>
      <SEO
        title={content.seoTitle}
        description={content.seoDesc}
        href={`/${currentLang}/contact`}
      />

      <section id="contact-page" className="c-contact">
        <div className="c-contact__wrap">
          {/* HERO */}
          <header className="c-contact__hero">
            <div className="c-contact__heroBg" aria-hidden="true" />
            <div className="c-contact__heroContent">
              <div className="c-contact__badge">{content.badge}</div>

              <h1 className="c-contact__title">
                {content.title}
              </h1>

              <p className="c-contact__subtitle">
                {content.subtitle}
              </p>

              <div className="c-contact__heroCtas">
                <Link className="c-contactBtn c-contactBtn--primary" to={`/${currentLang}/orcamento`}>
                  {content.ctaBudget}
                </Link>

                <a
                  className="c-contactBtn c-contactBtn--secondary"
                  href="https://wa.me/5532984869192"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.ctaWhats}
                </a>
              </div>
            </div>
          </header>

          {/* GRID */}
          <div className="c-contact__grid">
            {/* FORM */}
            <article className="c-contactCard c-contactCard--form">
              <div className="c-contactCard__head">
                <h2 className="c-contactCard__title">
                  {content.formTitle}
                </h2>
                <span className="c-contactChip">{content.formTag}</span>
              </div>

              <p className="c-contactCard__desc">
                {content.formDesc}
              </p>

              <div className="c-contactDivider" />

              <ContactForm />

              <div className="c-contactInlineNote">
                {content.formNote}
              </div>
            </article>

            {/* INFO */}
            <aside className="c-contactCard c-contactCard--info">
              <div className="c-contactSticky">
                <div className="c-contactCard__head">
                  <h2 className="c-contactCard__title">
                    {content.infoTitle}
                  </h2>
                </div>

                <p className="c-contactCard__desc">
                  {content.infoDesc}
                </p>

                <ContactInfo />

                <div className="c-contactMiniCta">
                  <div className="c-contactMiniCta__text">
                    <h3 className="c-contactMiniCta__title">
                      {content.miniCtaTitle}
                    </h3>
                    <p className="c-contactMiniCta__desc">
                      {content.miniCtaDesc}
                    </p>
                  </div>

                  <Link className="c-contactBtn c-contactBtn--primary" to={`/${currentLang}/orcamento`}>
                    {content.miniCtaBtn}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* TRUST / PROCESS */}
          <div className="c-contactSplit">
            <div className="c-contactCard c-contactCard--soft">
              <div className="c-contactCard__head">
                <h2 className="c-contactCard__title">{content.processTitle}</h2>
                <span className="c-contactChip">Fluxo</span>
              </div>

              <div className="c-contactSteps">
                {content.steps.map((step) => (
                  <div className="c-contactStep" key={step.num}>
                    <div className="c-contactStep__num">{step.num}</div>
                    <div>
                      <h3 className="c-contactStep__title">{step.title}</h3>
                      <p className="c-contactStep__desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="c-contactCard c-contactCard--dark">
              <div className="c-contactDarkGlow" aria-hidden="true" />
              <div className="c-contactCard__head">
                <h2 className="c-contactCard__title c-contactCard__title--dark">{content.trustTitle}</h2>
                <span className="c-contactChip c-contactChip--dark">Premium</span>
              </div>
              <p className="c-contactCard__desc c-contactCard__desc--dark">{content.trustDesc}</p>

              <ul className="c-contactBullets">
                {content.trustBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div className="c-contactCard c-contactCard--testimonials">
            <div className="c-contactCard__head">
              <h2 className="c-contactCard__title">{content.testimonialsTitle}</h2>
              <span className="c-contactChip">Prova social</span>
            </div>

            <div className="c-contactTestimonials">
              {content.testimonials.map((tt) => (
                <div key={tt.name} className="c-contactTestimonial">
                  <p className="c-contactTestimonial__quote">“{tt.quote}”</p>
                  <div className="c-contactTestimonial__meta">
                    <strong>{tt.name}</strong>
                    <span>{tt.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA BAR FINAL */}
          <div className="c-contactCtaBar">
            <div className="c-contactCtaBar__left">
              <h2 className="c-contactCtaBar__title">
                {content.bottomTitle}
              </h2>
              <p className="c-contactCtaBar__desc">
                {content.bottomDesc}
              </p>
            </div>

            <a
              className="c-contactBtn c-contactBtn--primary"
              href="https://wa.me/5532984869192"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.bottomBtn}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;