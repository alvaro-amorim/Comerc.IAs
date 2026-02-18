import React, { useEffect, useMemo, useRef, useState } from "react";
import data from "../data/precos.json";

// =====================
// Utils
// =====================
function slugify(str = "") {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function moneyBRL(value) {
  const num = Number(value || 0);
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function safeBase64Encode(str) {
  // URL-safe base64
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function safeBase64Decode(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  return decodeURIComponent(escape(atob(b64)));
}

function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message);
  // se você tiver um número fixo, troque para: https://wa.me/55DDDNÚMERO?text=...
  return `https://wa.me/?text=${text}`;
}

// =====================
// Data normalization
// =====================
function normalizeCatalog(raw) {
  const categorias = raw?.orcamento?.categorias || [];
  const flat = [];

  for (const cat of categorias) {
    const catName = cat?.nome || "Categoria";
    const services = cat?.servicos || [];
    for (const s of services) {
      const id = `${slugify(catName)}__${slugify(s.titulo_venda || s.titulo || "servico")}`;
      const price = typeof s.preco === "number" ? s.preco : null;

      flat.push({
        id,
        categoria: catName,
        titulo: s.titulo || s.titulo_venda || "Serviço",
        tituloVenda: s.titulo_venda || s.titulo || "Serviço",
        descricao: s.descricao || "",
        inclui: s.inclui || [],
        beneficios: s.beneficios || [],
        prazo: s.prazo_entrega || "",
        revisoes: s.revisoes_incluidas ?? null,
        formatos: s.formato_entrega || [],
        preco: price,
        precoOriginal: typeof s.preco_original === "number" ? s.preco_original : null,
        precosPorPeriodo: s.precos_por_periodo || null,
      });
    }
  }

  return { categorias, flat, hero: raw?.orcamento?.hero || null, observacoes: raw?.orcamento?.observacoes || "" };
}

// =====================
// Quiz scoring
// =====================
const QUIZ = [
  {
    key: "objetivo",
    title: "Qual seu objetivo agora?",
    options: [
      { value: "vendas", label: "Vender mais (promoção / campanha / tráfego)" },
      { value: "autoridade", label: "Aumentar autoridade e consistência no Instagram" },
      { value: "institucional", label: "Apresentação institucional (marca / empresa / serviço)" },
      { value: "lançamento", label: "Lançamento (produto novo / novidade)" },
    ],
  },
  {
    key: "formato",
    title: "Qual formato você quer priorizar?",
    options: [
      { value: "video", label: "Vídeo (Reels/Shorts)" },
      { value: "imagens", label: "Imagens (feed/stories/anúncios)" },
      { value: "mensal", label: "Plano mensal (conteúdo contínuo)" },
      { value: "site", label: "Site/landing (presença profissional)" },
      { value: "personagem", label: "Personagem/mascote (marca memorável)" },
    ],
  },
  {
    key: "prazo",
    title: "Quando você precisa disso?",
    options: [
      { value: "urgente", label: "Urgente (até 2 dias)" },
      { value: "semana", label: "Nesta semana" },
      { value: "calma", label: "Sem pressa (planejado)" },
    ],
  },
  {
    key: "orcamento",
    title: "Qual faixa de investimento você imagina?",
    options: [
      { value: "baixo", label: "Até R$ 150" },
      { value: "medio", label: "R$ 150 a R$ 500" },
      { value: "alto", label: "Acima de R$ 500" },
    ],
  },
];

function scoreService(service, answers) {
  let score = 0;

  const cat = (service.categoria || "").toLowerCase();
  const title = (service.tituloVenda || service.titulo || "").toLowerCase();

  // Formato
  if (answers.formato === "video") score += cat.includes("vídeo") || cat.includes("videos") ? 50 : -5;
  if (answers.formato === "imagens") score += cat.includes("imagem") ? 50 : -5;
  if (answers.formato === "mensal") score += cat.includes("planos") ? 60 : -10;
  if (answers.formato === "site") score += title.includes("website") || title.includes("site") ? 60 : -10;
  if (answers.formato === "personagem") score += cat.includes("personagem") ? 60 : -10;

  // Objetivo
  if (answers.objetivo === "vendas") {
    score += cat.includes("vídeo") ? 20 : 0;
    score += cat.includes("imagem") ? 15 : 0;
    score += title.includes("poster") ? 10 : 0;
  }
  if (answers.objetivo === "autoridade") {
    score += cat.includes("planos") ? 30 : 0;
    score += cat.includes("imagem") ? 10 : 0;
    score += cat.includes("vídeo") ? 10 : 0;
  }
  if (answers.objetivo === "institucional") {
    score += title.includes("website") || title.includes("corporativo") ? 30 : 0;
    score += title.includes("premium") || title.includes("pro") ? 10 : 0;
    score += cat.includes("personagem") ? 10 : 0;
  }
  if (answers.objetivo === "lançamento") {
    score += cat.includes("vídeo") ? 25 : 0;
    score += cat.includes("imagem") ? 20 : 0;
    score += cat.includes("planos") ? 10 : 0;
  }

  // Prazo
  if (answers.prazo === "urgente") {
    const prazo = (service.prazo || "").toLowerCase();
    score += prazo.includes("1 dia") || prazo.includes("2 dias") || prazo.includes("acelerado") ? 15 : 0;
  }

  // Orçamento
  const p = service.preco;
  if (typeof p === "number") {
    if (answers.orcamento === "baixo") score += p <= 150 ? 15 : -10;
    if (answers.orcamento === "medio") score += p > 150 && p <= 500 ? 15 : 0;
    if (answers.orcamento === "alto") score += p >= 500 ? 10 : 0;
  } else if (service.precosPorPeriodo?.length) {
    // planos (mensal etc)
    const mensal = service.precosPorPeriodo.find((x) => x.periodo === "Mensal")?.preco_mensal_efetivo;
    if (typeof mensal === "number") {
      if (answers.orcamento === "baixo") score += mensal <= 150 ? 15 : -10;
      if (answers.orcamento === "medio") score += mensal > 150 && mensal <= 500 ? 15 : 0;
      if (answers.orcamento === "alto") score += mensal >= 500 ? 10 : 0;
    }
  }

  // Pequeno bônus para serviços bem descritos e “vendáveis”
  if ((service.beneficios || []).length >= 3) score += 3;
  if ((service.inclui || []).length >= 3) score += 3;

  return score;
}

// =====================
// Main Component
// =====================
export default function OrcamentoFunnel() {
  const catalog = useMemo(() => normalizeCatalog(data), []);
  const services = catalog.flat;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ objetivo: "", formato: "", prazo: "", orcamento: "" });

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [periodoPlano, setPeriodoPlano] = useState("Mensal");
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState("");

  const resultsRef = useRef(null);

  // Read query param ?itens=base64(...)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const itens = sp.get("itens");
    if (itens) {
      try {
        const decoded = safeBase64Decode(itens);
        const ids = decoded.split(",").map((s) => s.trim()).filter(Boolean);
        const set = new Set(ids);
        setSelectedIds(set);
      } catch {
        // ignora
      }
    }
  }, []);

  // Persist selection (opcional)
  useEffect(() => {
    const arr = Array.from(selectedIds);
    localStorage.setItem("comerc_orcamento_itens", JSON.stringify(arr));
  }, [selectedIds]);

  useEffect(() => {
    // load persisted if none selected
    if (selectedIds.size > 0) return;
    try {
      const raw = localStorage.getItem("comerc_orcamento_itens");
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) setSelectedIds(new Set(arr));
    } catch {}
  }, []); // eslint-disable-line

  const quizDone = Object.values(answers).every(Boolean);

  const ranked = useMemo(() => {
    if (!quizDone) return [];
    const scored = services
      .map((s) => ({ s, score: scoreService(s, answers) }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((x) => x.s);
  }, [quizDone, services, answers]);

  const selectedServices = useMemo(() => {
    const map = new Map(services.map((s) => [s.id, s]));
    return Array.from(selectedIds).map((id) => map.get(id)).filter(Boolean);
  }, [selectedIds, services]);

  const total = useMemo(() => {
    let sum = 0;

    for (const s of selectedServices) {
      if (typeof s.preco === "number") sum += s.preco;
      else if (s.precosPorPeriodo?.length) {
        const chosen = s.precosPorPeriodo.find((x) => x.periodo === periodoPlano);
        sum += chosen?.preco_total_com_desc ?? chosen?.preco_total_sem_desc ?? 0;
      }
    }
    return sum;
  }, [selectedServices, periodoPlano]);

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function shareLink() {
    const ids = Array.from(selectedIds);
    const encoded = safeBase64Encode(ids.join(","));
    const url = new URL(window.location.href);
    url.searchParams.set("itens", encoded);

    navigator.clipboard?.writeText(url.toString());
    alert("Link copiado! Você pode mandar pro cliente.");
  }

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildResumoTexto() {
    const lines = [];
    lines.push("Orçamento – Comerc IAs");
    lines.push("");
    lines.push("Serviços selecionados:");
    for (const s of selectedServices) {
      if (typeof s.preco === "number") {
        lines.push(`- ${s.tituloVenda} (${s.categoria}) — ${moneyBRL(s.preco)}`);
      } else if (s.precosPorPeriodo?.length) {
        const chosen = s.precosPorPeriodo.find((x) => x.periodo === periodoPlano);
        const price = chosen?.preco_total_com_desc ?? chosen?.preco_total_sem_desc ?? 0;
        lines.push(`- ${s.tituloVenda} (${s.categoria}) — ${periodoPlano}: ${moneyBRL(price)}`);
      } else {
        lines.push(`- ${s.tituloVenda} (${s.categoria})`);
      }
    }
    lines.push("");
    lines.push(`Total estimado: ${moneyBRL(total)}`);
    if (mensagem.trim()) {
      lines.push("");
      lines.push("Mensagem do cliente:");
      lines.push(mensagem.trim());
    }
    return lines.join("\n");
  }

  function openWhatsApp() {
    const msg = buildResumoTexto() + "\n\nQuero fechar isso. Pode me orientar no melhor caminho?";
    window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
  }

  function copyResumo() {
    const text = buildResumoTexto();
    navigator.clipboard?.writeText(text);
    alert("Resumo copiado.");
  }

  function resetQuiz() {
    setAnswers({ objetivo: "", formato: "", prazo: "", orcamento: "" });
    setStep(0);
  }

  const hero = catalog.hero;

  return (
    <div className="of-page">
      <header className="of-hero">
        <div className="of-hero-badge">{hero?.badge || "Orçamento Instantâneo"}</div>
        <h1 className="of-hero-title">{hero?.titulo || "Monte seu orçamento em 2 minutos"}</h1>
        <p className="of-hero-subtitle">
          {hero?.subtitulo ||
            "Selecione serviços, responda um quiz rápido e gere um resumo pronto para mandar no WhatsApp."}
        </p>

        <div className="of-hero-pills">
          {(hero?.destaques || ["Quiz rápido", "Serviços detalhados", "Link compartilhável"]).map((t) => (
            <span key={t} className="of-pill">{t}</span>
          ))}
        </div>

        <div className="of-hero-cta">
          <a className="of-btn primary" href="#quiz">Começar pelo Quiz</a>
          <a className="of-btn ghost" href="#servicos">Ver todos os serviços</a>
        </div>

        <div className="of-hero-note">{hero?.nota || "Dica: comece com 1–2 serviços e avance."}</div>
      </header>

      {/* ===================== QUIZ ===================== */}
      <section id="quiz" className="of-section">
        <div className="of-section-head">
          <h2>Encontre o serviço ideal (quiz rápido)</h2>
          <p>Responda 4 perguntas e eu te mostro a melhor combinação para vender mais com conteúdo visual.</p>
        </div>

        <div className="of-quiz">
          <div className="of-quiz-steps">
            {QUIZ.map((q, i) => (
              <button
                key={q.key}
                className={`of-step ${i === step ? "active" : ""} ${answers[q.key] ? "done" : ""}`}
                onClick={() => setStep(i)}
                type="button"
              >
                <span className="of-step-dot" />
                <span className="of-step-label">{q.title}</span>
              </button>
            ))}
          </div>

          <div className="of-quiz-card">
            <div className="of-quiz-title">{QUIZ[step].title}</div>
            <div className="of-quiz-options">
              {QUIZ[step].options.map((opt) => {
                const selected = answers[QUIZ[step].key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    className={`of-option ${selected ? "selected" : ""}`}
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [QUIZ[step].key]: opt.value }));
                      setStep((s) => clamp(s + 1, 0, QUIZ.length - 1));
                      setTimeout(scrollToResults, 150);
                    }}
                    type="button"
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="of-quiz-actions">
              <button
                className="of-btn ghost"
                type="button"
                onClick={() => setStep((s) => clamp(s - 1, 0, QUIZ.length - 1))}
                disabled={step === 0}
              >
                Voltar
              </button>

              <button className="of-btn ghost" type="button" onClick={resetQuiz}>
                Reiniciar
              </button>

              <button
                className="of-btn primary"
                type="button"
                onClick={() => {
                  if (!quizDone) return;
                  scrollToResults();
                }}
                disabled={!quizDone}
                title={!quizDone ? "Responda todas as perguntas" : "Ver recomendações"}
              >
                Ver recomendações
              </button>
            </div>
          </div>
        </div>

        <div ref={resultsRef} className="of-results">
          <h3>Recomendação dinâmica</h3>
          {!quizDone ? (
            <p className="of-muted">Responda todas as perguntas para eu montar um caminho recomendado.</p>
          ) : (
            <>
              <p className="of-muted">
                Baseado no que você respondeu, aqui estão as melhores opções para começar (clique para adicionar ao orçamento).
              </p>

              <div className="of-grid">
                {ranked.map((s) => (
                  <ServiceCard key={s.id} service={s} selected={selectedIds.has(s.id)} onToggle={() => toggleSelect(s.id)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===================== APRESENTAÇÃO INTERATIVA ===================== */}
      <section id="servicos" className="of-section">
        <div className="of-section-head">
          <h2>Apresentação interativa dos serviços</h2>
          <p>Abra as categorias, compare opções e adicione ao orçamento com 1 clique.</p>
        </div>

        <div className="of-categories">
          {catalog.categorias.map((cat) => {
            const catName = cat?.nome || "Categoria";
            const catServices = (cat?.servicos || []).map((s) => {
              const id = `${slugify(catName)}__${slugify(s.titulo_venda || s.titulo || "servico")}`;
              return services.find((x) => x.id === id);
            }).filter(Boolean);

            return (
              <details key={catName} className="of-accordion">
                <summary>
                  <span className="of-acc-title">{catName}</span>
                  <span className="of-acc-meta">{catServices.length} opções</span>
                </summary>
                <div className="of-grid">
                  {catServices.map((s) => (
                    <ServiceCard
                      key={s.id}
                      service={s}
                      selected={selectedIds.has(s.id)}
                      onToggle={() => toggleSelect(s.id)}
                    />
                  ))}
                </div>
              </details>
            );
          })}
        </div>

        <div className="of-process">
          <h3>Como funciona (bem rápido)</h3>
          <div className="of-process-row">
            <div className="of-process-item">
              <div className="of-process-n">1</div>
              <div>
                <strong>Você escolhe</strong>
                <div className="of-muted">Quiz ou seleção manual</div>
              </div>
            </div>
            <div className="of-process-item">
              <div className="of-process-n">2</div>
              <div>
                <strong>Eu produzo</strong>
                <div className="of-muted">Conteúdo visual com padrão profissional</div>
              </div>
            </div>
            <div className="of-process-item">
              <div className="of-process-n">3</div>
              <div>
                <strong>Você publica e vende</strong>
                <div className="of-muted">Peças prontas para anúncios e orgânico</div>
              </div>
            </div>
          </div>

          <div className="of-notebox">
            <strong>Observação:</strong> {catalog.observacoes || "Descontos progressivos em combos e parcerias."}
          </div>
        </div>
      </section>

      {/* ===================== ORÇAMENTO ===================== */}
      <section id="orcamento" className="of-section">
        <div className="of-section-head">
          <h2>Seu orçamento (pronto pra mandar)</h2>
          <p>Selecione serviços, escolha período (se for plano) e gere um resumo profissional.</p>
        </div>

        <div className="of-budget">
          <div className="of-budget-left">
            <div className="of-budget-card">
              <div className="of-budget-title">Itens selecionados</div>

              {selectedServices.length === 0 ? (
                <p className="of-muted">Ainda nada selecionado. Volte no quiz ou abra as categorias e clique em “Adicionar”.</p>
              ) : (
                <ul className="of-list">
                  {selectedServices.map((s) => (
                    <li key={s.id} className="of-list-item">
                      <div className="of-li-main">
                        <div className="of-li-title">{s.tituloVenda}</div>
                        <div className="of-li-sub">{s.categoria}</div>
                      </div>

                      <div className="of-li-right">
                        <div className="of-li-price">
                          {typeof s.preco === "number"
                            ? moneyBRL(s.preco)
                            : s.precosPorPeriodo?.length
                              ? moneyBRL(
                                  (s.precosPorPeriodo.find((x) => x.periodo === periodoPlano)?.preco_total_com_desc) ??
                                  (s.precosPorPeriodo.find((x) => x.periodo === periodoPlano)?.preco_total_sem_desc) ??
                                  0
                                )
                              : "—"}
                        </div>
                        <button className="of-mini" type="button" onClick={() => toggleSelect(s.id)}>
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="of-divider" />

              <div className="of-row">
                <div>
                  <div className="of-muted">Período (para planos)</div>
                  <select
                    className="of-select"
                    value={periodoPlano}
                    onChange={(e) => setPeriodoPlano(e.target.value)}
                  >
                    <option value="Mensal">Mensal</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>

                <div className="of-total">
                  <div className="of-muted">Total estimado</div>
                  <div className="of-total-value">{moneyBRL(total)}</div>
                </div>
              </div>

              <div className="of-divider" />

              <label className="of-label">
                <span>Conte sua ideia (opcional)</span>
                <textarea
                  className="of-textarea"
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Ex: Quero 2 Reels por semana para divulgar promoção X…"
                />
              </label>

              <label className="of-label">
                <span>E-mail (opcional, pra você copiar/colar depois)</span>
                <input
                  className="of-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </label>

              <div className="of-actions">
                <button className="of-btn primary" type="button" onClick={openWhatsApp} disabled={selectedServices.length === 0}>
                  Enviar no WhatsApp
                </button>
                <button className="of-btn ghost" type="button" onClick={copyResumo} disabled={selectedServices.length === 0}>
                  Copiar resumo
                </button>
                <button className="of-btn ghost" type="button" onClick={shareLink} disabled={selectedServices.length === 0}>
                  Copiar link do orçamento
                </button>
              </div>

              {email?.trim() && selectedServices.length > 0 ? (
                <div className="of-notebox">
                  <strong>Dica:</strong> cole o resumo no e-mail e envie para <em>{email.trim()}</em>.
                </div>
              ) : null}
            </div>
          </div>

          <div className="of-budget-right">
            <div className="of-budget-card">
              <div className="of-budget-title">Por que isso converte?</div>
              <ul className="of-bullets">
                <li><strong>Decisão guiada:</strong> quiz reduz indecisão e acelera o “sim”.</li>
                <li><strong>Transparência:</strong> detalhes + entregáveis + prazo + revisões.</li>
                <li><strong>CTA pronto:</strong> WhatsApp com mensagem pronta e link compartilhável.</li>
              </ul>

              <div className="of-divider" />

              <div className="of-budget-title">Sugestões de combos (1 clique)</div>
              <div className="of-combos">
                <button
                  className="of-combo"
                  type="button"
                  onClick={() => addCombo(setSelectedIds, services, ["vídeos", "imagens"], "combo-engajamento")}
                >
                  Combo Engajamento (vídeo + artes)
                </button>
                <button
                  className="of-combo"
                  type="button"
                  onClick={() => addCombo(setSelectedIds, services, ["planos"], "combo-mensal")}
                >
                  Combo Mensal (plano)
                </button>
                <button
                  className="of-combo"
                  type="button"
                  onClick={() => addCombo(setSelectedIds, services, ["website"], "combo-presenca")}
                >
                  Combo Presença (site)
                </button>
              </div>

              <div className="of-notebox">
                <strong>Importante:</strong> você pode deixar essa página em uma rota separada e mandar o link direto pro cliente.
              </div>
            </div>
          </div>
        </div>

        <footer className="of-footer">
          <div className="of-muted">
            Feito para a Comerc IAs — funil de orçamento com quiz + vitrine interativa + link compartilhável.
          </div>
        </footer>
      </section>
    </div>
  );
}

// =====================
// Components
// =====================
function ServiceCard({ service, selected, onToggle }) {
  const hasPlan = Array.isArray(service.precosPorPeriodo) && service.precosPorPeriodo.length > 0;

  return (
    <div className={`of-card ${selected ? "selected" : ""}`}>
      <div className="of-card-top">
        <div className="of-card-cat">{service.categoria}</div>
        <div className="of-card-title">{service.tituloVenda}</div>

        <div className="of-card-price">
          {typeof service.preco === "number" ? (
            <>
              <span className="of-price-now">{moneyBRL(service.preco)}</span>
              {typeof service.precoOriginal === "number" && service.precoOriginal > service.preco ? (
                <span className="of-price-old">{moneyBRL(service.precoOriginal)}</span>
              ) : null}
            </>
          ) : hasPlan ? (
            <span className="of-price-now">Plano (ver períodos)</span>
          ) : (
            <span className="of-price-now">Sob consulta</span>
          )}
        </div>

        <p className="of-card-desc">{service.descricao}</p>
      </div>

      <div className="of-card-mid">
        {service.beneficios?.length ? (
          <div className="of-mini-list">
            <div className="of-mini-title">Benefícios</div>
            <ul>
              {service.beneficios.slice(0, 3).map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        ) : null}

        {service.inclui?.length ? (
          <div className="of-mini-list">
            <div className="of-mini-title">Inclui</div>
            <ul>
              {service.inclui.slice(0, 3).map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ) : null}

        <div className="of-meta">
          {service.prazo ? <span className="of-tag">Prazo: {service.prazo}</span> : null}
          {service.revisoes != null ? <span className="of-tag">Revisões: {service.revisoes}</span> : null}
        </div>

        {hasPlan ? (
          <details className="of-plan">
            <summary>Ver preços por período</summary>
            <div className="of-plan-grid">
              {service.precosPorPeriodo.map((p) => (
                <div key={p.periodo} className="of-plan-item">
                  <div className="of-plan-title">{p.periodo}</div>
                  <div className="of-plan-price">{moneyBRL(p.preco_total_com_desc ?? p.preco_total_sem_desc)}</div>
                  <div className="of-muted">{p.desconto_perc ? `${p.desconto_perc}% off` : "Sem desconto"}</div>
                </div>
              ))}
            </div>
          </details>
        ) : null}
      </div>

      <div className="of-card-actions">
        <button className={`of-btn ${selected ? "ghost" : "primary"}`} type="button" onClick={onToggle}>
          {selected ? "Remover" : "Adicionar ao orçamento"}
        </button>
      </div>
    </div>
  );
}

// Combo helper: adiciona 1-2 itens “representativos” conforme intenção
function addCombo(setSelectedIds, services, matchWords = [], mode = "") {
  const lowerWords = matchWords.map((w) => w.toLowerCase());

  const filtered = services.filter((s) => {
    const hay = `${s.categoria} ${s.tituloVenda} ${s.titulo}`.toLowerCase();
    return lowerWords.some((w) => hay.includes(w));
  });

  const pick = [];
  if (mode === "combo-engajamento") {
    // tenta pegar 1 vídeo + 1 pack imagens
    const video = filtered.find((s) => (s.categoria || "").toLowerCase().includes("vídeo"));
    const imgs = filtered.find((s) => (s.categoria || "").toLowerCase().includes("imagem"));
    if (video) pick.push(video.id);
    if (imgs) pick.push(imgs.id);
  } else {
    // pega o primeiro (mais “representativo”)
    if (filtered[0]) pick.push(filtered[0].id);
  }

  setSelectedIds((prev) => {
    const next = new Set(prev);
    pick.forEach((id) => next.add(id));
    return next;
  });
}
