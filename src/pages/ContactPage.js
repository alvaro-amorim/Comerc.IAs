import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ContactForm from '../components/forms/ContactForm';
import ContactInfo from '../components/ContactInfo';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  const currentLang = useMemo(() => {
    if (lang === 'pt' || lang === 'en') return lang;
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [lang, i18n.language]);

  const inventedCopy = useMemo(
    () => ({
      badge: 'Contato',
      title: 'Vamos transformar sua ideia em um material que vende.',
      subtitle:
        'Conte seu objetivo e eu retorno com um caminho claro: conceito, referências, prazo e o melhor formato pra sua campanha.',
      ctaBudget: 'Fazer orçamento',
      ctaWhats: 'WhatsApp',
      formTitle: 'Envie sua mensagem',
      formDesc:
        'Para eu te responder com precisão, me diga: nicho, objetivo (venda, marca, tráfego), prazo e onde vai postar.',
      infoTitle: 'Atendimento',
      infoDesc:
        'Se preferir, fale direto por WhatsApp. Respondemos rápido em dias úteis e já organizamos o briefing com você.',
      quickTitle: 'O que acontece depois?',
      quick1Title: 'Briefing em 2 minutos',
      quick1Desc: 'Você envia o essencial e eu devolvo um plano de execução.',
      quick2Title: 'Proposta enxuta',
      quick2Desc: 'Formato, prazo e valor — sem enrolação, com clareza.',
      quick3Title: 'Produção e entrega',
      quick3Desc: 'Criativos, vídeos e páginas no padrão premium.',
      trustTitle: 'Resultados que importam',
      trustDesc:
        'Projetos com foco em conversão, retenção e percepção de marca. Direção + estética + execução rápida.',
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
          quote:
            'Em uma semana a percepção da marca mudou. O criativo ficou “premium” e o atendimento ficou mais fácil.',
        },
        {
          name: 'Vitta Store',
          role: 'E-commerce • Performance',
          quote:
            'A estética ficou absurda. Melhorou CTR e o público passou a confiar mais na oferta.',
        },
        {
          name: 'NeoFit Studio',
          role: 'Fitness • Conteúdo',
          quote:
            'Ritmo de entrega muito acima do normal. Os vídeos ficaram com energia e clareza de CTA.',
        },
      ],
      bottomTitle: 'Quer acelerar o processo?',
      bottomDesc:
        'Se você já quer chegar no objetivo final, faça o orçamento e eu te conduzo pelas opções.',
      bottomBtn: 'Ir para orçamento',
    }),
    []
  );

  return (
    <>
      <SEO
        title={t('contact_seo_title', 'Contato | Comerc IA’s')}
        description={t(
          'contact_seo_desc',
          'Fale com a Comerc IA’s: orçamento, dúvidas e produção de criativos, vídeos e sites com padrão premium.'
        )}
        href={`/${currentLang}/contact`}
      />

      <section id="contact-page" className="c-contact">
        <div className="c-contact__wrap">
          {/* HERO */}
          <header className="c-contact__hero">
            <div className="c-contact__heroBg" aria-hidden="true" />
            <div className="c-contact__heroContent">
              <div className="c-contact__badge">{t('contact_badge', inventedCopy.badge)}</div>

              <h1 className="c-contact__title">
                {t('contact_title', inventedCopy.title)}
              </h1>

              <p className="c-contact__subtitle">
                {t('contact_subtitle', inventedCopy.subtitle)}
              </p>

              <div className="c-contact__heroCtas">
                <Link className="c-contactBtn c-contactBtn--primary" to={`/${currentLang}/orcamento`}>
                  {t('btn_budget_fallback', inventedCopy.ctaBudget)}
                </Link>

                <a
                  className="c-contactBtn c-contactBtn--secondary"
                  href="https://wa.me/5532984869192"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('btn_whatsapp_fallback', inventedCopy.ctaWhats)}
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
                  {t('contact_form_title', inventedCopy.formTitle)}
                </h2>
                <span className="c-contactChip">{t('contact_fast_reply', 'Resposta rápida')}</span>
              </div>

              <p className="c-contactCard__desc">
                {t('contact_form_desc', inventedCopy.formDesc)}
              </p>

              <div className="c-contactDivider" />

              <ContactForm />

              {/* mini bloco premium (sem marcador) */}
              <div className="c-contactInlineNote">
                Dica: se você tiver referência (site, vídeo, reel), cole o link na mensagem — eu uso isso para acertar o estilo
                mais rápido.
              </div>
            </article>

            {/* INFO */}
            <aside className="c-contactCard c-contactCard--info">
              <div className="c-contactSticky">
                <div className="c-contactCard__head">
                  <h2 className="c-contactCard__title">
                    {t('contact_other_ways', inventedCopy.infoTitle)}
                  </h2>
                </div>

                <p className="c-contactCard__desc">
                  {t('contact_response_time', inventedCopy.infoDesc)}
                </p>

                <ContactInfo />

                <div className="c-contactMiniCta">
                  <div className="c-contactMiniCta__text">
                    <h3 className="c-contactMiniCta__title">
                      {t('contact_mini_cta_title', inventedCopy.bottomTitle)}
                    </h3>
                    <p className="c-contactMiniCta__desc">
                      {t('contact_mini_cta_desc', inventedCopy.bottomDesc)}
                    </p>
                  </div>

                  <Link className="c-contactBtn c-contactBtn--primary" to={`/${currentLang}/orcamento`}>
                    {t('btn_budget_fallback', inventedCopy.bottomBtn)}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* TRUST / PROCESS */}
          <div className="c-contactSplit">
            <div className="c-contactCard c-contactCard--soft">
              <div className="c-contactCard__head">
                <h2 className="c-contactCard__title">{inventedCopy.quickTitle}</h2>
                <span className="c-contactChip">Fluxo</span>
              </div>

              <div className="c-contactSteps">
                <div className="c-contactStep">
                  <div className="c-contactStep__num">01</div>
                  <div>
                    <h3 className="c-contactStep__title">{inventedCopy.quick1Title}</h3>
                    <p className="c-contactStep__desc">{inventedCopy.quick1Desc}</p>
                  </div>
                </div>

                <div className="c-contactStep">
                  <div className="c-contactStep__num">02</div>
                  <div>
                    <h3 className="c-contactStep__title">{inventedCopy.quick2Title}</h3>
                    <p className="c-contactStep__desc">{inventedCopy.quick2Desc}</p>
                  </div>
                </div>

                <div className="c-contactStep">
                  <div className="c-contactStep__num">03</div>
                  <div>
                    <h3 className="c-contactStep__title">{inventedCopy.quick3Title}</h3>
                    <p className="c-contactStep__desc">{inventedCopy.quick3Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="c-contactCard c-contactCard--dark">
              <div className="c-contactDarkGlow" aria-hidden="true" />
              <div className="c-contactCard__head">
                <h2 className="c-contactCard__title c-contactCard__title--dark">{inventedCopy.trustTitle}</h2>
                <span className="c-contactChip c-contactChip--dark">Premium</span>
              </div>
              <p className="c-contactCard__desc c-contactCard__desc--dark">{inventedCopy.trustDesc}</p>

              <ul className="c-contactBullets">
                {inventedCopy.trustBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div className="c-contactCard c-contactCard--testimonials">
            <div className="c-contactCard__head">
              <h2 className="c-contactCard__title">{inventedCopy.testimonialsTitle}</h2>
              <span className="c-contactChip">Prova social</span>
            </div>

            <div className="c-contactTestimonials">
              {inventedCopy.testimonials.map((tt) => (
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
                {t('contact_bottom_title', 'Pronto para elevar o nível da sua presença digital?')}
              </h2>
              <p className="c-contactCtaBar__desc">
                {t(
                  'contact_bottom_desc',
                  'Me diga o que você quer vender e eu monto uma direção criativa com entrega premium.'
                )}
              </p>
            </div>

            <a
              className="c-contactBtn c-contactBtn--primary"
              href="https://wa.me/5532984869192"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('btn_whatsapp_fallback', 'Chamar no WhatsApp')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
