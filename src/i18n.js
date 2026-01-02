import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      // --- MENU ---
      "nav_home": "HOME",
      "nav_about": "Sobre",
      "nav_portfolio": "Portfólio",
      "nav_orcamento": "Orçamento",
      "nav_contact": "Contato",

      // --- GERAL ---
      "btn_know_services": "CONHEÇA NOSSOS SERVIÇOS",
      "btn_check_work": "CONFIRA NOSSO TRABALHO",
      "btn_send": "Enviar",
      "btn_sending": "Enviando...",

      // --- HOME PAGE ---
      "hero_title": "VÍDEOS de ALTO IMPACTO para impulsionar seu negócio!",
      "hero_desc_1": "Na Comerc IA's nós temos o compromisso de entrega rápida, um material de extrema qualidade e ótimo custo-benefício!",
      "hero_desc_2": "Vídeos feitos por profissionais em Edição de Vídeo, com imagens e cenas geradas com Inteligência Artificial.",
      "desktop_title": "IMPULSIONE SEU NEGÓCIO COM PUBLICIDADE DE QUALIDADE!",
      "desktop_text": "Conteúdo bem feito, entrega rápida e total customização à sua necessidade",

      // --- ABOUT PAGE ---
      "about_seo_title": "Quem Somos - Produtora de Vídeos com IA",
      "about_seo_desc": "Criamos vídeos hiper-realistas para empresas: comerciais, reels, vídeos institucionais e treinamentos com avatares e narração em português.",
      "about_hero_title": "Transformamos ideias em vídeos que convertem",
      "about_hero_subtitle": "Na <1>Comerc IA's</1> criamos comerciais e conteúdos em vídeo que contam histórias reais e vendem sem precisar gritar. Unimos roteiro estratégico, avatares e narração natural em português com as melhores tecnologias de inteligência artificial.",
      "about_btn_portfolio": "Ver portfólio",
      "about_btn_budget": "Simular orçamento",
      "about_section_title": "Quem Somos",
      "about_lead": "Somos uma produtora especializada em vídeos comerciais e conteúdo corporativo com suporte de IA. Criamos roteiros orientados a resultados, produções hiper-realistas e narrativas que aumentam engajamento, autoridade e conversões.",
      
      // SERVIÇOS (Tradução completa)
      "about_service_1": "<1>Comerciais e reels para redes sociais</1> (Instagram, TikTok, YouTube) com linguagem dinâmica e foco em conversão.",
      "about_service_2": "<1>Vídeos institucionais e corporativos</1> com personagens e avatares que falam a mesma língua do seu público.",
      "about_service_3": "<1>Transformação de imagens em vídeos</1>: fotos estáticas que ganham movimento e narrativa.",
      "about_service_4": "<1>Mini-documentários e cases</1> com narração profissional para reforçar credibilidade.",
      "about_service_5": "<1>Videoclipes e peças criativas</1> com direção orientada por IA.",
      "about_service_6": "<1>Treinamentos e apresentações personalizadas</1> para times e clientes.",
      
      "about_summary": "Entregamos roteiros detalhados, narração natural em português, realismo impressionante e total adaptação ao seu briefing — rapidamente e com qualidade escalável.",
      "about_why_title": "Por que escolher a Comerc IAs",
      "about_why_1": "Roteiros orientados a resultado (engajamento → conversão).",
      "about_why_2": "Produção ágil e escalável sem perder personalidade.",
      "about_why_3": "Criações que respeitam a identidade da marca — nada que pareça “feito por IA”.",
      "about_cta_talk": "Fale com um de nossos especialistas!",
      "about_cta_examples": "Ver exemplos",

      // --- PORTFOLIO PAGE ---
      "portfolio_seo_title": "Portfólio - Vídeos com IA e Storytelling",
      "portfolio_seo_desc": "Veja exemplos reais dos nossos vídeos comerciais, campanhas de branding e efeitos visuais criados com Inteligência Artificial.",
      "portfolio_title": "Portfólio",
      "port_item_1_title": "Apresentação de Marca",
      "port_item_1_desc": "Apresentar sua marca ao mundo nunca foi tão fácil — e tão inovador — faça o seu cliente conhecer o seu trabalho de forma prática!",
      "port_item_2_title": "Vídeos Storytelling com IA",
      "port_item_2_desc": "Transformamos ideias criativas em roteiros impactantes, misturando humor, storytelling e total identidade da sua marca!",
      "port_item_3_title": "Branding e Propostas Criativas",
      "port_item_3_desc": "Neste exemplo, usamos IA para desenvolver diversos cenários surreais mantendo o logotipo e branding da marca!",
      "port_item_4_title": "Efeitos Especiais Para Prender a Atenção",
      "port_item_4_desc": "Conteúdos realistas e que prendem o lead até ouvir sua mensagem! Infinitas possibilidades!",
      "port_item_5_title": "Vídeo de Promoção ou Divulgação",
      "port_item_5_desc": "Uma campanha de promoção ou divulgação que prende o seu cliente! Humor, Identidade e Conversão!",

      // --- CONTACT PAGE & MODAL ---
      "contact_title": "Fale Conosco",
      "contact_other_ways": "Outras maneiras de entrar em contato!",
      "contact_response_time": "(A resposta pode ser mais rápida.)",

      // --- FORMS (Geral) ---
      "form_name": "Nome:",
      "form_phone": "Telefone:",
      "form_email": "E-mail:",
      "form_company": "Empresa:",
      "form_message": "Mensagem:",
      "form_success": "Obrigado! Sua mensagem foi enviada.",
      "form_error_generic": "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
      "form_error_connection": "Ocorreu um erro de conexão. Verifique sua rede.",

      // --- ORÇAMENTO PAGE ---
      "orcamento_seo_title": "Orçamento Online - Vídeos e Marketing",
      "orcamento_seo_desc": "Simule seu orçamento online para vídeos comerciais, gestão de redes sociais e serviços de design.",
      "orcamento_page_title": "Gerador de Orçamento",
      "orcamento_subtitle": "Escolha os serviços que você deseja!",
      "orcamento_cat_options": "opções",
      
      "btn_details": "Detalhes",
      "btn_close": "Fechar",
      "label_includes": "O que inclui:",
      "label_benefits": "Benefícios:",
      "label_formats": "Formatos:",
      "label_deadline": "Prazo:",
      "label_period": "Escolha o Período:",

      "form_title": "Suas Informações",
      "label_name": "Nome:",
      "label_email": "E-mail:",
      "label_company": "Nome da Empresa ou Instagram:",
      "label_phone": "Telefone:",
      "label_coupon": "Cupom de Desconto:",
      "label_message": "Mensagem / Briefing rápido:",
      "label_agree": "Aceito ser contactado pelas formas de contato fornecidas.",
      "btn_generate": "Gerar Orçamento",
      "label_obs": "Observações:",

      "result_title": "Seu Orçamento Final",
      "btn_print": "Imprimir",
      "btn_download": "Baixar",
      "label_discount_applied": "Desconto Aplicado:",
      "label_final_price": "Preço Final:",
      "label_selected_services": "Serviços Selecionados",
      "btn_share": "Compartilhar",
      "btn_back_top": "Voltar ao topo",
      
      "alert_fill_data": "Por favor, preencha todos os seus dados.",
      "alert_valid_email": "Digite um e-mail válido.",
      "alert_accept_terms": "Você precisa aceitar ser contactado para gerar o orçamento.",
      "alert_select_service": "Selecione pelo menos um serviço para gerar o orçamento.",
      "alert_success": "Orçamento gerado com sucesso! Verifique abaixo!",
      "alert_copy_success": "Orçamento copiado para a área de transferência!",
      
      "modal_share_title": "Compartilhar Orçamento",
      "modal_share_desc": "Copie o texto abaixo para compartilhar o orçamento:",
      "btn_copy": "Copiar"
    }
  },
  en: {
    translation: {
      // --- MENU ---
      "nav_home": "HOME",
      "nav_about": "About Us",
      "nav_portfolio": "Portfolio",
      "nav_orcamento": "Get a Quote",
      "nav_contact": "Contact",

      // --- GENERAL ---
      "btn_know_services": "KNOW OUR SERVICES",
      "btn_check_work": "CHECK OUR WORK",
      "btn_send": "Send",
      "btn_sending": "Sending...",

      // --- HOME PAGE ---
      "hero_title": "HIGH IMPACT VIDEOS to boost your business!",
      "hero_desc_1": "At Comerc IAs we are committed to fast delivery, extremely high quality material and great cost-benefit!",
      "hero_desc_2": "Videos made by professionals in Video Editing, with images and scenes generated with Artificial Intelligence.",
      "desktop_title": "BOOST YOUR BUSINESS WITH QUALITY ADVERTISING!",
      "desktop_text": "Well-crafted content, fast delivery and full customization to your needs",

      // --- ABOUT PAGE ---
      "about_seo_title": "About Us - AI Video Production",
      "about_seo_desc": "We create hyper-realistic videos for businesses: commercials, reels, institutional videos, and training with avatars and narration.",
      "about_hero_title": "We transform ideas into videos that convert",
      "about_hero_subtitle": "At <1>Comerc IA's</1> we create commercials and video content that tell real stories and sell without screaming. We combine strategic scripting, avatars, and natural narration with the best AI technologies.",
      "about_btn_portfolio": "See portfolio",
      "about_btn_budget": "Get a quote",
      "about_section_title": "Who We Are",
      "about_lead": "We are a production company specializing in commercial videos and corporate content supported by AI. We create result-oriented scripts, hyper-realistic productions, and narratives that increase engagement, authority, and conversions.",
      
      // SERVICES (Tradução corrigida)
      "about_service_1": "<1>Commercials and reels for social media</1> (Instagram, TikTok, YouTube) with dynamic language focused on conversion.",
      "about_service_2": "<1>Institutional and corporate videos</1> with characters and avatars that speak your audience's language.",
      "about_service_3": "<1>Transformation of images into videos</1>: static photos that gain movement and narrative.",
      "about_service_4": "<1>Mini-documentaries and case studies</1> with professional narration to reinforce credibility.",
      "about_service_5": "<1>Music videos and creative pieces</1> with AI-oriented direction.",
      "about_service_6": "<1>Personalized training and presentations</1> for teams and clients.",
      
      "about_summary": "We deliver detailed scripts, natural narration, impressive realism, and full adaptation to your briefing — quickly and with scalable quality.",
      "about_why_title": "Why choose Comerc IAs",
      "about_why_1": "Result-oriented scripts (engagement → conversion).",
      "about_why_2": "Agile and scalable production without losing personality.",
      "about_why_3": "Creations that respect brand identity — nothing that looks 'made by AI'.",
      "about_cta_talk": "Talk to one of our specialists!",
      "about_cta_examples": "See examples",

      // --- PORTFOLIO PAGE ---
      "portfolio_seo_title": "Portfolio - AI Videos and Storytelling",
      "portfolio_seo_desc": "See real examples of our commercial videos, branding campaigns, and visual effects created with Artificial Intelligence.",
      "portfolio_title": "Portfolio",
      "port_item_1_title": "Brand Presentation",
      "port_item_1_desc": "Presenting your brand to the world has never been easier — and so innovative — let your client know your work in a practical way!",
      "port_item_2_title": "Storytelling Videos with AI",
      "port_item_2_desc": "We transform creative ideas into impactful scripts, mixing humor, storytelling, and your brand's total identity!",
      "port_item_3_title": "Branding and Creative Proposals",
      "port_item_3_desc": "In this example, we use AI to develop several surreal scenarios while keeping the logo and brand branding!",
      "port_item_4_title": "Special Effects to Grab Attention",
      "port_item_4_desc": "Realistic content that holds the lead until they hear your message! Infinite possibilities!",
      "port_item_5_title": "Promotional or Disclosure Video",
      "port_item_5_desc": "A promotion or disclosure campaign that captivates your client! Humor, Identity, and Conversion!",

      // --- CONTACT PAGE & MODAL ---
      "contact_title": "Contact Us",
      "contact_other_ways": "Other ways to contact us!",
      "contact_response_time": "(Response time may be faster.)",

      // --- FORMS (General) ---
      "form_name": "Name:",
      "form_phone": "Phone:",
      "form_email": "E-mail:",
      "form_company": "Company:",
      "form_message": "Message:",
      "form_success": "Thank you! Your message has been sent.",
      "form_error_generic": "An error occurred while sending the message. Please try again.",
      "form_error_connection": "A connection error occurred. Please check your network.",

      // --- ORÇAMENTO PAGE & FORMS ---
      "orcamento_seo_title": "Online Quote - Video & Marketing",
      "orcamento_seo_desc": "Simulate your budget online for commercial videos, social media management, and design services.",
      "orcamento_page_title": "Budget Generator",
      "orcamento_subtitle": "Choose the services you desire!",
      "orcamento_cat_options": "options",
      
      "btn_details": "Details",
      "btn_close": "Close",
      "label_includes": "Includes:",
      "label_benefits": "Benefits:",
      "label_formats": "Formats:",
      "label_deadline": "Deadline:",
      "label_period": "Choose Period:",

      "form_title": "Your Information",
      "label_name": "Name:",
      "label_email": "E-mail:",
      "label_company": "Company Name or Instagram:",
      "label_phone": "Phone:",
      "label_coupon": "Discount Coupon:",
      "label_message": "Message / Quick Briefing:",
      "label_agree": "I agree to be contacted via the provided contact methods.",
      "btn_generate": "Generate Quote",
      "label_obs": "Notes:",

      "result_title": "Your Final Budget",
      "btn_print": "Print",
      "btn_download": "Download",
      "label_discount_applied": "Discount Applied:",
      "label_final_price": "Final Price:",
      "label_selected_services": "Selected Services",
      "btn_share": "Share",
      "btn_back_top": "Back to top",

      "alert_fill_data": "Please fill in all your details.",
      "alert_valid_email": "Please enter a valid email.",
      "alert_accept_terms": "You must agree to be contacted to generate the quote.",
      "alert_select_service": "Select at least one service to generate the quote.",
      "alert_success": "Budget generated successfully! Check below!",
      "alert_copy_success": "Budget copied to clipboard!",

      "modal_share_title": "Share Budget",
      "modal_share_desc": "Copy the text below to share the budget:",
      "btn_copy": "Copy"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    interpolation: { escapeValue: false },
    detection: { order: ['path', 'navigator'], lookupFromPathIndex: 0 }
  });

export default i18n;