import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  pt: {
    translation: {
      // --- MENU ---
      "nav_home": "HOME",
      "nav_about": "Sobre a Produtora",
      "nav_portfolio": "Portfólio de Vídeos",
      "nav_orcamento": "Orçamento Online",
      "nav_contact": "Contato",

      // --- GERAL ---
      "btn_know_services": "CONHEÇA NOSSOS SERVIÇOS",
      "btn_check_work": "CONFIRA NOSSO PORTFÓLIO",
      "btn_send": "Enviar Mensagem",
      "btn_sending": "Enviando...",

      // --- HOME PAGE (SEO CRÍTICO) ---
      // Adicionado "Comerc IA's" e "Produtora" para reforçar a marca
      "hero_title": "Comerc IA's: VÍDEOS de ALTO IMPACTO para impulsionar seu negócio!",
      "hero_desc_1": "Sua produtora de vídeo ágil: entrega rápida, material de qualidade cinematográfica e o melhor custo-benefício do mercado.",
      "hero_desc_2": "Especialistas em Edição de Vídeo e Marketing, utilizando Inteligência Artificial para criar comerciais que vendem.",
      "desktop_title": "IMPULSIONE SEU NEGÓCIO COM VÍDEOS COMERCIAIS!",
      "desktop_text": "Conteúdo audiovisual estratégico, entrega rápida e total customização para sua empresa.",

      // --- ABOUT PAGE ---
      "about_seo_title": "Quem Somos - Comerc IA's Produtora de Vídeos",
      "about_seo_desc": "Conheça a Comerc IA's, produtora especializada em vídeos comerciais, avatares virtuais e marketing com Inteligência Artificial.",
      "about_hero_title": "Transformamos ideias em vídeos que convertem",
      "about_hero_subtitle": "Na <1>Comerc IA's</1>, unimos criatividade humana e inteligência artificial para produzir comerciais, avatares e conteúdos que contam histórias e vendem.",
      "about_btn_portfolio": "Ver Exemplos de Vídeos",
      "about_btn_budget": "Simular Orçamento",
      "about_section_title": "Sobre a Comerc IA's",
      "about_lead": "Somos uma produtora audiovisual tech-driven. Criamos roteiros focados em retenção, produções hiper-realistas e narrativas que aumentam a autoridade da sua marca.",
      
      // SERVIÇOS
      "about_service_1": "<1>Comerciais e Reels Virais</1> para Instagram, TikTok e YouTube com foco em vendas.",
      "about_service_2": "<1>Vídeos Institucionais</1> com porta-vozes e avatares digitais ultra-realistas.",
      "about_service_3": "<1>Motion Graphics e Animação</1>: transformamos fotos estáticas em vídeos dinâmicos.",
      "about_service_4": "<1>Mini-documentários e VSLs</1> com narração profissional neural.",
      "about_service_5": "<1>Videoclipes e Campanhas</1> com direção de arte assistida por IA.",
      "about_service_6": "<1>Treinamentos Corporativos</1> escaláveis para times e clientes.",
      
      "about_summary": "Tecnologia de ponta a serviço do seu marketing. Entregamos qualidade de estúdio com a agilidade da IA.",
      "about_why_title": "Por que escolher a Comerc IA's?",
      "about_why_1": "Estratégia de Vídeo Marketing focada em conversão.",
      "about_why_2": "Produção 10x mais rápida que produtoras tradicionais.",
      "about_why_3": "Identidade visual única: seu vídeo não parece 'genérico de IA'.",
      "about_cta_talk": "Fale com um Produtor",
      "about_cta_examples": "Ver Cases de Sucesso",

      // --- PORTFOLIO PAGE ---
      "portfolio_seo_title": "Portfólio - Vídeos Comerciais e Avatares",
      "portfolio_seo_desc": "Assista aos nossos cases: comerciais de TV, reels para redes sociais e vídeos institucionais criados pela Comerc IA's.",
      "portfolio_title": "Nossos Trabalhos",
      "port_item_1_title": "Apresentação de Marca (Institucional)",
      "port_item_1_desc": "Apresentação institucional moderna e inovadora para posicionar sua marca no mercado.",
      "port_item_2_title": "Vídeos Storytelling para Redes Sociais",
      "port_item_2_desc": "Roteiros criativos com humor e storytelling para engajar seguidores no Instagram e TikTok.",
      "port_item_3_title": "Branding e Identidade Visual com IA",
      "port_item_3_desc": "Cenários surreais e fotografia de produto gerada por IA, mantendo a consistência da marca.",
      "port_item_4_title": "VFX e Efeitos Visuais para Anúncios",
      "port_item_4_desc": "Retenção máxima com efeitos visuais que prendem a atenção nos primeiros segundos.",
      "port_item_5_title": "Vídeo Promocional de Varejo",
      "port_item_5_desc": "Campanhas de varejo e promoções com foco total em conversão e Call-to-Action.",

      // --- CONTACT PAGE & MODAL ---
      "contact_title": "Fale Conosco",
      "contact_other_ways": "Canais de Atendimento",
      "contact_response_time": "(Respondemos geralmente em menos de 1 hora)",

      // --- FORMS (Geral) ---
      "form_name": "Seu Nome:",
      "form_phone": "WhatsApp / Telefone:",
      "form_email": "Seu Melhor E-mail:",
      "form_company": "Nome da Empresa / Instagram:",
      "form_message": "Como podemos ajudar?",
      "form_success": "Recebemos sua mensagem! Em breve entraremos em contato.",
      "form_error_generic": "Erro ao enviar. Por favor, nos chame no WhatsApp.",
      "form_error_connection": "Erro de conexão. Verifique sua internet.",

      // --- ORÇAMENTO PAGE ---
      "orcamento_seo_title": "Orçamento de Vídeo Online - Calculadora Rápida",
      "orcamento_seo_desc": "Simule o preço do seu vídeo comercial ou pacote de social media instantaneamente com a Comerc IA's.",
      "orcamento_page_title": "Calculadora de Orçamento de Vídeo",
      "orcamento_subtitle": "Selecione os serviços para seu projeto:",
      "orcamento_cat_options": "serviços disponíveis",
      
      "btn_details": "Ver Detalhes",
      "btn_close": "Fechar",
      "label_includes": "O que está incluso:",
      "label_benefits": "Vantagens:",
      "label_formats": "Formatos de Entrega:",
      "label_deadline": "Prazo Estimado:",
      "label_period": "Frequência:",

      "form_title": "Finalizar Orçamento",
      "label_name": "Nome Completo:",
      "label_email": "E-mail Corporativo:",
      "label_company": "Link do Instagram ou Site:",
      "label_phone": "WhatsApp:",
      "label_coupon": "Possui Cupom?",
      "label_message": "Detalhes extras do projeto (Opcional):",
      "label_agree": "Concordo em receber o contato da equipe comercial.",
      "btn_generate": "Gerar Orçamento PDF",
      "label_obs": "Notas Importantes:",

      "result_title": "Estimativa de Investimento",
      "btn_print": "Imprimir / Salvar PDF",
      "btn_download": "Baixar Texto",
      "label_discount_applied": "Desconto Promocional:",
      "label_final_price": "Investimento Total:",
      "label_selected_services": "Resumo do Projeto",
      "btn_share": "Compartilhar",
      "btn_back_top": "Voltar ao topo",
      
      "alert_fill_data": "Por favor, preencha seus dados de contato.",
      "alert_valid_email": "Digite um e-mail válido.",
      "alert_accept_terms": "É necessário aceitar o contato para gerar o orçamento.",
      "alert_select_service": "Selecione ao menos um serviço de vídeo ou design.",
      "alert_success": "Orçamento gerado! Confira os valores abaixo.",
      "alert_copy_success": "Resumo copiado para a área de transferência!",
      
      "modal_share_title": "Compartilhar Orçamento",
      "modal_share_desc": "Copie o resumo abaixo:",
      "btn_copy": "Copiar Texto"
    }
  },
  en: {
    translation: {
      // --- MENU ---
      "nav_home": "HOME",
      "nav_about": "About Us",
      "nav_portfolio": "Video Portfolio",
      "nav_orcamento": "Get a Quote",
      "nav_contact": "Contact",

      // --- GENERAL ---
      "btn_know_services": "DISCOVER OUR SERVICES",
      "btn_check_work": "CHECK OUR PORTFOLIO",
      "btn_send": "Send Message",
      "btn_sending": "Sending...",

      // --- HOME PAGE ---
      "hero_title": "Comerc IA's: HIGH IMPACT VIDEOS to boost your business!",
      "hero_desc_1": "Your agile video production partner: fast delivery, cinematic quality, and the best cost-benefit in the market.",
      "hero_desc_2": "Experts in Video Editing and Marketing, using Artificial Intelligence to create commercials that sell.",
      "desktop_title": "BOOST YOUR BUSINESS WITH COMMERCIAL VIDEOS!",
      "desktop_text": "Strategic audiovisual content, fast delivery, and full customization for your company.",

      // --- ABOUT PAGE ---
      "about_seo_title": "About Us - Comerc IA's AI Video Production",
      "about_seo_desc": "Meet Comerc IA's, a production company specializing in commercial videos, virtual avatars, and AI marketing.",
      "about_hero_title": "We transform ideas into videos that convert",
      "about_hero_subtitle": "At <1>Comerc IA's</1>, we combine human creativity and artificial intelligence to produce commercials, avatars, and content that tell stories and sell.",
      "about_btn_portfolio": "See Video Examples",
      "about_btn_budget": "Simulate Budget",
      "about_section_title": "About Comerc IA's",
      "about_lead": "We are a tech-driven audiovisual production company. We create retention-focused scripts, hyper-realistic productions, and narratives that increase your brand authority.",
      
      // SERVICES
      "about_service_1": "<1>Commercials and Viral Reels</1> for Instagram, TikTok, and YouTube focused on sales.",
      "about_service_2": "<1>Institutional Videos</1> with spokespersons and ultra-realistic digital avatars.",
      "about_service_3": "<1>Motion Graphics and Animation</1>: we transform static photos into dynamic videos.",
      "about_service_4": "<1>Mini-documentaries and VSLs</1> with professional neural narration.",
      "about_service_5": "<1>Music Videos and Campaigns</1> with AI-assisted art direction.",
      "about_service_6": "<1>Corporate Training</1> scalable for teams and clients.",
      
      "about_summary": "Cutting-edge technology at the service of your marketing. We deliver studio quality with AI agility.",
      "about_why_title": "Why choose Comerc IA's?",
      "about_why_1": "Video Marketing Strategy focused on conversion.",
      "about_why_2": "Production 10x faster than traditional production companies.",
      "about_why_3": "Unique visual identity: your video won't look like 'generic AI'.",
      "about_cta_talk": "Talk to a Producer",
      "about_cta_examples": "See Success Cases",

      // --- PORTFOLIO PAGE ---
      "portfolio_seo_title": "Portfolio - Commercial Videos and Avatars",
      "portfolio_seo_desc": "Watch our cases: TV commercials, social media reels, and institutional videos created by Comerc IA's.",
      "portfolio_title": "Our Work",
      "port_item_1_title": "Brand Presentation (Institutional)",
      "port_item_1_desc": "Modern and innovative institutional presentation to position your brand in the market.",
      "port_item_2_title": "Storytelling Videos for Social Media",
      "port_item_2_desc": "Creative scripts with humor and storytelling to engage followers on Instagram and TikTok.",
      "port_item_3_title": "Branding and Visual Identity with AI",
      "port_item_3_desc": "Surreal scenarios and AI-generated product photography, maintaining brand consistency.",
      "port_item_4_title": "VFX and Visual Effects for Ads",
      "port_item_4_desc": "Maximum retention with visual effects that grab attention in the first few seconds.",
      "port_item_5_title": "Retail Promotional Video",
      "port_item_5_desc": "Retail campaigns and promotions with total focus on conversion and Call-to-Action.",

      // --- CONTACT PAGE & MODAL ---
      "contact_title": "Contact Us",
      "contact_other_ways": "Support Channels",
      "contact_response_time": "(We usually respond in less than 1 hour)",

      // --- FORMS (General) ---
      "form_name": "Your Name:",
      "form_phone": "WhatsApp / Phone:",
      "form_email": "Your Best E-mail:",
      "form_company": "Company Name / Instagram:",
      "form_message": "How can we help?",
      "form_success": "Message received! We will contact you shortly.",
      "form_error_generic": "Error sending. Please contact us on WhatsApp.",
      "form_error_connection": "Connection error. Check your internet.",

      // --- ORÇAMENTO PAGE & FORMS ---
      "orcamento_seo_title": "Online Video Quote - Fast Calculator",
      "orcamento_seo_desc": "Simulate the price of your commercial video or social media package instantly with Comerc IA's.",
      "orcamento_page_title": "Video Budget Calculator",
      "orcamento_subtitle": "Select services for your project:",
      "orcamento_cat_options": "available services",
      
      "btn_details": "See Details",
      "btn_close": "Close",
      "label_includes": "What's included:",
      "label_benefits": "Benefits:",
      "label_formats": "Delivery Formats:",
      "label_deadline": "Estimated Deadline:",
      "label_period": "Frequency:",

      "form_title": "Finalize Quote",
      "label_name": "Full Name:",
      "label_email": "Corporate E-mail:",
      "label_company": "Instagram or Website Link:",
      "label_phone": "WhatsApp:",
      "label_coupon": "Have a Coupon?",
      "label_message": "Extra Project Details (Optional):",
      "label_agree": "I agree to be contacted by the sales team.",
      "btn_generate": "Generate PDF Quote",
      "label_obs": "Important Notes:",

      "result_title": "Investment Estimate",
      "btn_print": "Print / Save PDF",
      "btn_download": "Download Text",
      "label_discount_applied": "Promotional Discount:",
      "label_final_price": "Total Investment:",
      "label_selected_services": "Project Summary",
      "btn_share": "Share",
      "btn_back_top": "Back to top",

      "alert_fill_data": "Please fill in your contact details.",
      "alert_valid_email": "Please enter a valid email.",
      "alert_accept_terms": "You must agree to be contacted to generate the quote.",
      "alert_select_service": "Select at least one video or design service.",
      "alert_success": "Budget generated! Check the values below.",
      "alert_copy_success": "Summary copied to clipboard!",

      "modal_share_title": "Share Budget",
      "modal_share_desc": "Copy the summary below:",
      "btn_copy": "Copy Text"
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