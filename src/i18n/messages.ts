import type { LocaleCode } from "./config";

// Translation dictionary — keyed by locale, then by message id.
// Every locale MUST expose the same set of keys. Typescript will
// enforce completeness for the default (pt-PT) dictionary.

export type Messages = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    mission: string;
    donate: string;
    impacts: string;
    stories: string;
    faq: string;
    donateNow: string;
    menu: string;
  };
  hero: { alt: string };
  video: { title: string; subtitle: string; cta: string; play: string };
  mission: {
    title: string;
    p1: string;
    p2: string;
    animals: string;
    meals: string;
    cared: string;
  };
  stats: { animalsLabel: string; mealsLabel: string };
  donate: {
    title: string;
    donate: string;
    ctaOnce: string;
    ctaMonthly: string;
    secure: string;
    cancelAnytime: string;
    selected: string;
  };
  urgency: { title: string; text: string; cta: string };
  goal: {
    raisedThisMonth: string;
    racao: string;
    medicamentos: string;
    veterinario: string;
    renda: string;
    outros: string;
    monthGoal: string;
    ofGoal: string;
  };
  impacts: { title: string; subtitle: string; items: string[] };
  stories: { title: string; subtitle: string };
  contrast: {
    no1: string;
    no2: string;
    no3: string;
    yes: string;
  };
  live: {
    badge: string;
    raisedThisMonth: string;
    ofGoal: string;
    goal: string;
  };
  testimonials: { title: string; stars: string; items: { name: string; role: string; text: string }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  banner: { cta: string; sub: string };
  footer: { tagline: string; disclaimer: string };
  checkout: {
    title: string;
    youAreDonating: string;
    oneTime: string;
    monthly: string;
    chooseOther: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    secure: string;
    donate: string;
    demoNote: string;
    close: string;
    successTitle: string;
    successBody: string;
    successClose: string;
  };
  funnel: {
    matchTitle: string;
    matchBody: string;
    countdownEnds: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    exitTitle: string;
    exitBody: string;
    exitCta: string;
    exitNo: string;
    donorTitle: string;
    someone: string;
    from: string;
    trustSecure: string;
    trustTransparent: string;
    trustImpact: string;
  };
  switcher: { language: string; currency: string };
};

const pt: Messages = {
  meta: {
    title: "Together We Feed — Juntos alimentamos vidas",
    description:
      "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa. Ajude-nos a salvar vidas.",
  },
  nav: { mission: "Missão", donate: "Doar", impacts: "Impactos", stories: "Histórias", faq: "FAQ", donateNow: "Doar agora", menu: "Abrir menu" },
  hero: { alt: "Together We Feed — juntos alimentamos vidas" },
  video: { title: "Conheça a Together We Feed", subtitle: "Assista e compreenda como a sua ajuda transforma vidas.", cta: "Quero ajudar", play: "Reproduzir vídeo de apresentação" },
  mission: {
    title: "Da missão ao impacto",
    p1: "A Together We Feed atua para levar alimento, água e cuidados essenciais a cães abandonados e em situação de risco no sul da Europa. Com o apoio de pessoas que acreditam nesta causa, já salvámos mais de 1.200 animais e garantimos mais de 150 mil refeições a cães e gatos de rua.",
    p2: "Hoje, mais de 150 animais estão sob o nosso cuidado, enquanto muitos outros continuam nas ruas, expostos à fome, à sede, ao calor extremo e à falta de medicamentos. Cada contribuição ajuda-nos a salvá-los.",
    animals: "1.200 animais",
    meals: "150 mil refeições",
    cared: "150 animais estão sob o nosso cuidado",
  },
  stats: { animalsLabel: "Animais ajudados", mealsLabel: "Mil refeições doadas" },
  donate: {
    title: "Escolha um valor e salve uma vida",
    donate: "Doar",
    ctaOnce: "Quero ajudar agora",
    ctaMonthly: "Tornar-me doador mensal",
    secure: "Doação segura · Pagamento encriptado · Cancela quando quiseres",
    cancelAnytime: "Cancela quando quiseres",
    selected: "Selecionado",
  },
  urgency: {
    title: "Eles precisam de ajuda hoje",
    text: "O calor, a fome e os cuidados veterinários não podem esperar. A sua contribuição ajuda-nos a alimentar, tratar e proteger cães que dependem de nós todos os dias.",
    cta: "Quero ajudar agora",
  },
  goal: {
    raisedThisMonth: "angariados este mês",
    racao: "Ração",
    medicamentos: "Medicamentos",
    veterinario: "Veterinário",
    renda: "Renda",
    outros: "Outros",
    monthGoal: "Meta do mês",
    ofGoal: "da meta",
  },
  impacts: {
    title: "Impacto do seu donativo",
    subtitle: "Veja como a sua doação pode salvar a vida destes pequenos!",
    items: [
      "Uma semana de alimento e esperança para um animal.",
      "Saúde e nutrição para 2 animais durante 10 dias.",
      "Um saco de ração de 10kg — alimenta 5 vidas durante 30 dias.",
      "Vacinas e desparasitantes que protegem 4 animais contra doenças.",
      "Tratamento completo e digno durante um mês para 3 animais.",
      "Cirurgias de urgência e recuperação de animais em estado crítico.",
    ],
  },
  stories: {
    title: "Histórias de Transformação",
    subtitle: "Estas são algumas das centenas de animais que conseguimos resgatar e reabilitar graças ao vosso apoio.",
  },
  contrast: {
    no1: "Sem si, as tigelas ficam vazias.",
    no2: "Sem si, o abrigo para. As contas vencem. O cuidado que salva todos os dias falha.",
    no3: "Sem si, mais de 500 cães resgatados, que já sofreram o abandono, ficam sem comida, sem tratamento e sem um lugar seguro para descansar.",
    yes: "Consigo, cada patinha encontra proteção. Cada vida recebe cuidado. Cada história ganha uma nova oportunidade de esperança 🐾💛",
  },
  live: { badge: "Em direto", raisedThisMonth: "angariados este mês", ofGoal: "da meta", goal: "Meta" },
  testimonials: {
    title: "Adoção que transforma vidas",
    stars: "5 estrelas",
    items: [
      { name: "Julia P.", role: "🐾 Adotou o Milo", text: "O Milo é incrível! Ele passou por muito, mas hoje é pura felicidade. Ver esta transformação só me faz agradecer ao Resgate todos os dias! 🙏" },
      { name: "Carla N.", role: "🐾 Adotou a Nina", text: "Recebi a Nina já recuperada e com todas as vacinas. O acompanhamento do abrigo antes e depois da adoção fez toda a diferença." },
      { name: "Rafael S.", role: "💙 Doador mensal", text: "Faço donativos todos os meses e recebo as atualizações com fotografias. Dá para ver exatamente onde o dinheiro foi parar." },
      { name: "Maria A.", role: "🐾 Adotou o Luna", text: "A Luna chegou tímida e hoje não se desgruda das crianças. Gratidão eterna a quem cuidou dela antes de nós." },
    ],
  },
  faq: {
    title: "Perguntas frequentes 🩵",
    items: [
      { q: "Como são utilizados os donativos?", a: "Os donativos financiam a alimentação, cuidados veterinários, medicamentos, tratamentos e as despesas básicas do abrigo. Cada valor recebido ajuda diretamente os mais de 500 animais resgatados." },
      { q: "Quem mantém e administra o abrigo?", a: "O abrigo é mantido por donativos e administrado pela Luana e por uma equipa dedicada de voluntários e colaboradores, que trabalham todos os dias para garantir o bem-estar dos animais." },
      { q: "Os donativos fazem realmente a diferença?", a: "Sim. Cada contribuição, por mais pequena que pareça, ajuda a manter o abrigo a funcionar — desde a ração diária aos cuidados veterinários. Já salvámos mais de 4.500 vidas graças ao apoio de pessoas como você." },
      { q: "Os donativos são seguros?", a: "Sim. O pagamento é processado por plataforma segura e auditada, com os mesmos padrões de qualquer compra online." },
      { q: "Como acompanho o impacto do meu donativo?", a: "Publicamos atualizações com frequência nas redes sociais e no site, mostrando melhorias, conquistas e histórias reais dos animais beneficiados. Transparência e gratidão são pilares da nossa missão." },
    ],
  },
  banner: { cta: "Transformar uma vida", sub: "Toda a doação é um ato de amor 🐾" },
  footer: { tagline: "Alimento, água e cuidados essenciais a cães abandonados no sul da Europa.", disclaimer: "Clone para análise · Não é uma página oficial de pagamento" },
  checkout: {
    title: "Concluir doação",
    youAreDonating: "Estás a doar",
    oneTime: "Único",
    monthly: "Mensal",
    chooseOther: "Escolher outro valor",
    name: "Nome",
    namePlaceholder: "O seu nome",
    email: "Email",
    emailPlaceholder: "o.seu@email.com",
    secure: "Pagamento encriptado e seguro. Receberá um recibo por email.",
    donate: "Doar",
    demoNote: "Demonstração — nenhum pagamento real é processado",
    close: "Fechar",
    successTitle: "Obrigado por ajudar! 🐾",
    successBody: "A sua doação foi registada. Este é um clone para análise — nenhum pagamento real foi processado.",
    successClose: "Fechar",
  },
  funnel: {
    matchTitle: "🔥 A sua doação é duplicada hoje",
    matchBody: "Cada euro que doares até ao fim da campanha é multiplicado por 2, graças a um grupo de protetores anónimos. Não desperdices este impacto.",
    countdownEnds: "A campanha termina em",
    days: "dias",
    hours: "h",
    minutes: "min",
    seconds: "seg",
    exitTitle: "Espera! Cada minuto conta 🐾",
    exitBody: "Mais de 150 cães dependem de nós hoje. Faz a tua doação agora e ela será duplicada por um grupo de protetores anónimos.",
    exitCta: "Quero doar e dobrar o impacto",
    exitNo: "Não, obrigado",
    donorTitle: "alguém acabou de doar",
    someone: "Alguém",
    from: "de",
    trustSecure: "Pagamento seguro",
    trustTransparent: "100% transparente",
    trustImpact: "Impacto real",
  },
  switcher: { language: "Idioma", currency: "Moeda" },
};

const en: Messages = {
  meta: {
    title: "Together We Feed — Together we feed lives",
    description: "Food, water and essential care for abandoned dogs in Southern Europe. Help us save lives.",
  },
  nav: { mission: "Mission", donate: "Donate", impacts: "Impact", stories: "Stories", faq: "FAQ", donateNow: "Donate now", menu: "Open menu" },
  hero: { alt: "Together We Feed — together we feed lives" },
  video: { title: "Meet Together We Feed", subtitle: "Watch and understand how your help transforms lives.", cta: "I want to help", play: "Play presentation video" },
  mission: {
    title: "From mission to impact",
    p1: "Together We Feed works to bring food, water and essential care to abandoned and at-risk dogs in Southern Europe. With the support of people who believe in this cause, we have already saved more than 1,200 animals and provided more than 150 thousand meals to street dogs and cats.",
    p2: "Today, more than 150 animals are under our care, while many others remain on the streets, exposed to hunger, thirst, extreme heat and a lack of medication. Every contribution helps us save them.",
    animals: "1,200 animals",
    meals: "150 thousand meals",
    cared: "150 animals are under our care",
  },
  stats: { animalsLabel: "Animals helped", mealsLabel: "Thousand meals donated" },
  donate: {
    title: "Choose an amount and save a life",
    donate: "Donate",
    ctaOnce: "I want to help now",
    ctaMonthly: "Become a monthly donor",
    secure: "Secure donation · Encrypted payment · Cancel anytime",
    cancelAnytime: "Cancel anytime",
    selected: "Selected",
  },
  urgency: {
    title: "They need help today",
    text: "Heat, hunger and veterinary care cannot wait. Your contribution helps us feed, treat and protect dogs that depend on us every day.",
    cta: "I want to help now",
  },
  goal: {
    raisedThisMonth: "raised this month",
    racao: "Food",
    medicamentos: "Medication",
    veterinario: "Veterinary",
    renda: "Rent",
    outros: "Other",
    monthGoal: "Monthly goal",
    ofGoal: "of goal",
  },
  impacts: {
    title: "Impact of your donation",
    subtitle: "See how your donation can save the lives of these little ones!",
    items: [
      "A week of food and hope for one animal.",
      "Health and nutrition for 2 animals for 10 days.",
      "A 10kg bag of kibble — feeds 5 lives for 30 days.",
      "Vaccines and dewormers that protect 4 animals against disease.",
      "Complete and dignified care for a month for 3 animals.",
      "Emergency surgeries and recovery of animals in critical condition.",
    ],
  },
  stories: {
    title: "Stories of Transformation",
    subtitle: "These are some of the hundreds of animals we have managed to rescue and rehabilitate thanks to your support.",
  },
  contrast: {
    no1: "Without you, the bowls stay empty.",
    no2: "Without you, the shelter stops. Bills pile up. The daily care that saves lives fails.",
    no3: "Without you, more than 500 rescued dogs, who already suffered abandonment, are left without food, without treatment and without a safe place to rest.",
    yes: "With you, every little paw finds protection. Every life receives care. Every story gets a new chance of hope 🐾💛",
  },
  live: { badge: "Live", raisedThisMonth: "raised this month", ofGoal: "of goal", goal: "Goal" },
  testimonials: {
    title: "Adoption that transforms lives",
    stars: "5 stars",
    items: [
      { name: "Julia P.", role: "🐾 Adopted Milo", text: "Milo is amazing! He went through a lot, but today he is pure happiness. Seeing this transformation just makes me thank the Rescue every day! 🙏" },
      { name: "Carla N.", role: "🐾 Adopted Nina", text: "I received Nina already recovered and with all her vaccines. The shelter's support before and after adoption made all the difference." },
      { name: "Rafael S.", role: "💙 Monthly donor", text: "I donate every month and receive updates with photos. You can see exactly where the money went." },
      { name: "Maria A.", role: "🐾 Adopted Luna", text: "Luna arrived shy and today she never leaves the kids' side. Eternal gratitude to everyone who cared for her before us." },
    ],
  },
  faq: {
    title: "Frequently asked questions 🩵",
    items: [
      { q: "How are donations used?", a: "Donations fund food, veterinary care, medication, treatments and the shelter's basic expenses. Every amount received directly helps the more than 500 rescued animals." },
      { q: "Who runs and manages the shelter?", a: "The shelter is sustained by donations and run by Luana and a dedicated team of volunteers and staff who work every day to ensure the animals' well-being." },
      { q: "Do donations really make a difference?", a: "Yes. Every contribution, no matter how small, helps keep the shelter running — from daily kibble to veterinary care. We've already saved more than 4,500 lives thanks to the support of people like you." },
      { q: "Are donations secure?", a: "Yes. Payment is processed by a secure, audited platform, with the same standards as any online purchase." },
      { q: "How do I follow the impact of my donation?", a: "We publish frequent updates on social media and on the site, showing improvements, milestones and real stories of the animals helped. Transparency and gratitude are pillars of our mission." },
    ],
  },
  banner: { cta: "Transform a life", sub: "Every donation is an act of love 🐾" },
  footer: { tagline: "Food, water and essential care for abandoned dogs in Southern Europe.", disclaimer: "Clone for analysis · Not an official payment page" },
  checkout: {
    title: "Complete donation",
    youAreDonating: "You are donating",
    oneTime: "One-time",
    monthly: "Monthly",
    chooseOther: "Choose another amount",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    secure: "Encrypted and secure payment. You will receive a receipt by email.",
    donate: "Donate",
    demoNote: "Demo — no real payment is processed",
    close: "Close",
    successTitle: "Thank you for helping! 🐾",
    successBody: "Your donation has been registered. This is a clone for analysis — no real payment was processed.",
    successClose: "Close",
  },
  funnel: {
    matchTitle: "🔥 Your donation is doubled today",
    matchBody: "Every euro you donate until the end of the campaign is multiplied by 2, thanks to a group of anonymous donors. Don't waste this impact.",
    countdownEnds: "Campaign ends in",
    days: "days",
    hours: "h",
    minutes: "min",
    seconds: "sec",
    exitTitle: "Wait! Every minute counts 🐾",
    exitBody: "More than 150 dogs depend on us today. Make your donation now and it will be doubled by a group of anonymous donors.",
    exitCta: "I want to donate and double the impact",
    exitNo: "No, thanks",
    donorTitle: "someone just donated",
    someone: "Someone",
    from: "from",
    trustSecure: "Secure payment",
    trustTransparent: "100% transparent",
    trustImpact: "Real impact",
  },
  switcher: { language: "Language", currency: "Currency" },
};

const es: Messages = {
  meta: {
    title: "Together We Feed — Juntos alimentamos vidas",
    description: "Comida, agua y cuidados esenciales para perros abandonados en el sur de Europa. Ayúdanos a salvar vidas.",
  },
  nav: { mission: "Misión", donate: "Donar", impacts: "Impacto", stories: "Historias", faq: "FAQ", donateNow: "Donar ahora", menu: "Abrir menú" },
  hero: { alt: "Together We Feed — juntos alimentamos vidas" },
  video: { title: "Conoce Together We Feed", subtitle: "Mira y comprende cómo tu ayuda transforma vidas.", cta: "Quiero ayudar", play: "Reproducir vídeo de presentación" },
  mission: {
    title: "De la misión al impacto",
    p1: "Together We Feed trabaja para llevar comida, agua y cuidados esenciales a perros abandonados y en situación de riesgo en el sur de Europa. Con el apoyo de personas que creen en esta causa, ya hemos salvado más de 1.200 animales y proporcionado más de 150 mil comidas a perros y gatos de la calle.",
    p2: "Hoy, más de 150 animales están bajo nuestro cuidado, mientras muchos otros siguen en las calles, expuestos al hambre, la sed, el calor extremo y la falta de medicación. Cada contribución nos ayuda a salvarlos.",
    animals: "1.200 animales",
    meals: "150 mil comidas",
    cared: "150 animales están bajo nuestro cuidado",
  },
  stats: { animalsLabel: "Animales ayudados", mealsLabel: "Mil comidas donadas" },
  donate: {
    title: "Elige un importe y salva una vida",
    donate: "Donar",
    ctaOnce: "Quiero ayudar ahora",
    ctaMonthly: "Hacerme donante mensual",
    secure: "Donación segura · Pago cifrado · Cancela cuando quieras",
    cancelAnytime: "Cancela cuando quieras",
    selected: "Seleccionado",
  },
  urgency: {
    title: "Necesitan ayuda hoy",
    text: "El calor, el hambre y los cuidados veterinarios no pueden esperar. Tu contribución nos ayuda a alimentar, tratar y proteger a perros que dependen de nosotros cada día.",
    cta: "Quiero ayudar ahora",
  },
  goal: {
    raisedThisMonth: "recaudado este mes",
    racao: "Comida",
    medicamentos: "Medicación",
    veterinario: "Veterinario",
    renda: "Alquiler",
    outros: "Otros",
    monthGoal: "Meta del mes",
    ofGoal: "de la meta",
  },
  impacts: {
    title: "Impacto de tu donación",
    subtitle: "¡Mira cómo tu donación puede salvar la vida de estos pequeños!",
    items: [
      "Una semana de comida y esperanza para un animal.",
      "Salud y nutrición para 2 animales durante 10 días.",
      "Un saco de 10kg de pienso — alimenta a 5 vidas durante 30 días.",
      "Vacunas y desparasitantes que protegen a 4 animales contra enfermedades.",
      "Cuidado completo y digno durante un mes para 3 animales.",
      "Cirugías de urgencia y recuperación de animales en estado crítico.",
    ],
  },
  stories: {
    title: "Historias de Transformación",
    subtitle: "Estos son algunos de los cientos de animales que hemos logrado rescatar y rehabilitar gracias a tu apoyo.",
  },
  contrast: {
    no1: "Sin ti, los cuencos se quedan vacíos.",
    no2: "Sin ti, el refugio se detiene. Las cuentas se acumulan. El cuidado diario que salva vidas falla.",
    no3: "Sin ti, más de 500 perros rescatados, que ya sufrieron el abandono, se quedan sin comida, sin tratamiento y sin un lugar seguro para descansar.",
    yes: "Contigo, cada patita encuentra protección. Cada vida recibe cuidado. Cada historia gana una nueva oportunidad de esperanza 🐾💛",
  },
  live: { badge: "En directo", raisedThisMonth: "recaudado este mes", ofGoal: "de la meta", goal: "Meta" },
  testimonials: {
    title: "Adopción que transforma vidas",
    stars: "5 estrellas",
    items: [
      { name: "Julia P.", role: "🐾 Adoptó a Milo", text: "¡Milo es increíble! Pasó por mucho, pero hoy es pura felicidad. Ver esta transformación solo me hace agradecer al Rescate cada día. 🙏" },
      { name: "Carla N.", role: "🐾 Adoptó a Nina", text: "Recibí a Nina ya recuperada y con todas sus vacunas. El acompañamiento del refugio antes y después de la adopción marcó la diferencia." },
      { name: "Rafael S.", role: "💙 Donante mensual", text: "Dono todos los meses y recibo actualizaciones con fotos. Se puede ver exactamente a dónde fue el dinero." },
      { name: "Maria A.", role: "🐾 Adoptó a Luna", text: "Luna llegó tímida y hoy no se separa de los niños. Gratitud eterna a quienes la cuidaron antes de nosotros." },
    ],
  },
  faq: {
    title: "Preguntas frecuentes 🩵",
    items: [
      { q: "¿Cómo se utilizan las donaciones?", a: "Las donaciones financian la comida, cuidados veterinarios, medicación, tratamientos y los gastos básicos del refugio. Cada importe recibido ayuda directamente a los más de 500 animales rescatados." },
      { q: "¿Quién mantiene y administra el refugio?", a: "El refugio se sostiene con donaciones y lo gestiona Luana junto a un equipo dedicado de voluntarios y colaboradores que trabajan cada día por el bienestar de los animales." },
      { q: "¿Las donaciones really hacen la diferencia?", a: "Sí. Cada contribución, por pequeña que parezca, ayuda a mantener el refugio funcionando — desde el pienso diario hasta los cuidados veterinarios. Ya hemos salvado más de 4.500 vidas gracias al apoyo de personas como tú." },
      { q: "¿Las donaciones son seguras?", a: "Sí. El pago se procesa en una plataforma segura y auditada, con los mismos estándares que cualquier compra online." },
      { q: "¿Cómo sigo el impacto de mi donación?", a: "Publicamos actualizaciones con frecuencia en redes sociales y en la web, mostrando mejoras, hitos e historias reales de los animales beneficiados. La transparencia y la gratitud son pilares de nuestra misión." },
    ],
  },
  banner: { cta: "Transformar una vida", sub: "Cada donación es un acto de amor 🐾" },
  footer: { tagline: "Comida, agua y cuidados esenciales para perros abandonados en el sur de Europa.", disclaimer: "Clon para análisis · No es una página oficial de pago" },
  checkout: {
    title: "Completar donación",
    youAreDonating: "Estás donando",
    oneTime: "Única",
    monthly: "Mensual",
    chooseOther: "Elegir otro importe",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    secure: "Pago cifrado y seguro. Recibirás un recibo por email.",
    donate: "Donar",
    demoNote: "Demo — no se procesa ningún pago real",
    close: "Cerrar",
    successTitle: "¡Gracias por ayudar! 🐾",
    successBody: "Tu donación ha sido registrada. Este es un clon para análisis — no se procesó ningún pago real.",
    successClose: "Cerrar",
  },
  funnel: {
    matchTitle: "🔥 Tu donación se duplica hoy",
    matchBody: "Cada euro que dones hasta el final de la campaña se multiplica por 2, gracias a un grupo de donantes anónimos. No desperdicies este impacto.",
    countdownEnds: "La campaña termina en",
    days: "días",
    hours: "h",
    minutes: "min",
    seconds: "seg",
    exitTitle: "¡Espera! Cada minuto cuenta 🐾",
    exitBody: "Más de 150 perros dependen de nosotros hoy. Haz tu donación ahora y se duplicará gracias a un grupo de donantes anónimos.",
    exitCta: "Quiero donar y duplicar el impacto",
    exitNo: "No, gracias",
    donorTitle: "alguien acaba de donar",
    someone: "Alguien",
    from: "de",
    trustSecure: "Pago seguro",
    trustTransparent: "100% transparente",
    trustImpact: "Impacto real",
  },
  switcher: { language: "Idioma", currency: "Moneda" },
};

const fr: Messages = {
  meta: {
    title: "Together We Feed — Ensemble, nourrissons des vies",
    description: "Nourriture, eau et soins essentiels pour les chiens abandonnés du sud de l'Europe. Aidez-nous à sauver des vies.",
  },
  nav: { mission: "Mission", donate: "Faire un don", impacts: "Impact", stories: "Histoires", faq: "FAQ", donateNow: "Donner maintenant", menu: "Ouvrir le menu" },
  hero: { alt: "Together We Feed — ensemble, nourrissons des vies" },
  video: { title: "Découvrez Together We Feed", subtitle: "Regardez et comprenez comment votre aide transforme des vies.", cta: "Je veux aider", play: "Lire la vidéo de présentation" },
  mission: {
    title: "De la mission à l'impact",
    p1: "Together We Feed agit pour apporter nourriture, eau et soins essentiels aux chiens abandonnés et en danger dans le sud de l'Europe. Avec le soutien de personnes qui croient en cette cause, nous avons déjà sauvé plus de 1 200 animaux et fourni plus de 150 mille repas à des chiens et chats de rue.",
    p2: "Aujourd'hui, plus de 150 animaux sont sous notre garde, tandis que beaucoup d'autres restent dans la rue, exposés à la faim, la soif, la chaleur extrême et au manque de médicaments. Chaque contribution nous aide à les sauver.",
    animals: "1 200 animaux",
    meals: "150 mille repas",
    cared: "150 animaux sont sous notre garde",
  },
  stats: { animalsLabel: "Animaux aidés", mealsLabel: "Milliers de repas donnés" },
  donate: {
    title: "Choisissez un montant et sauvez une vie",
    donate: "Donner",
    ctaOnce: "Je veux aider maintenant",
    ctaMonthly: "Devenir donateur mensuel",
    secure: "Don sécurisé · Paiement chiffré · Annulez à tout moment",
    cancelAnytime: "Annulez à tout moment",
    selected: "Sélectionné",
  },
  urgency: {
    title: "Ils ont besoin d'aide aujourd'hui",
    text: "La chaleur, la faim et les soins vétérinaires ne peuvent pas attendre. Votre contribution nous aide à nourrir, soigner et protéger les chiens qui dépendent de nous chaque jour.",
    cta: "Je veux aider maintenant",
  },
  goal: {
    raisedThisMonth: "collectés ce mois-ci",
    racao: "Nourriture",
    medicamentos: "Médicaments",
    veterinario: "Vétérinaire",
    renda: "Loyer",
    outros: "Autres",
    monthGoal: "Objectif du mois",
    ofGoal: "de l'objectif",
  },
  impacts: {
    title: "Impact de votre don",
    subtitle: "Voyez comment votre don peut sauver la vie de ces petits !",
    items: [
      "Une semaine de nourriture et d'espoir pour un animal.",
      "Santé et nutrition pour 2 animaux pendant 10 jours.",
      "Un sac de 10kg de croquettes — nourrit 5 vies pendant 30 jours.",
      "Vaccins et antiparasitaires qui protègent 4 animaux contre les maladies.",
      "Soins complets et dignes pendant un mois pour 3 animaux.",
      "Chirurgies d'urgence et rétablissement d'animaux en état critique.",
    ],
  },
  stories: {
    title: "Histoires de Transformation",
    subtitle: "Voici quelques-uns des centaines d'animaux que nous avons pu sauver et réhabiliter grâce à votre soutien.",
  },
  contrast: {
    no1: "Sans vous, les gamelles restent vides.",
    no2: "Sans vous, le refuge s'arrête. Les factures s'accumulent. Le soin quotidien qui sauve des vies faillit.",
    no3: "Sans vous, plus de 500 chiens sauvés, qui ont déjà souffert d'abandon, sont privés de nourriture, de soins et d'un endroit sûr pour se reposer.",
    yes: "Avec vous, chaque petite patte trouve protection. Chaque vie reçoit des soins. Chaque histoire obtient une nouvelle chance d'espoir 🐾💛",
  },
  live: { badge: "En direct", raisedThisMonth: "collectés ce mois-ci", ofGoal: "de l'objectif", goal: "Objectif" },
  testimonials: {
    title: "L'adoption qui transforme des vies",
    stars: "5 étoiles",
    items: [
      { name: "Julia P.", role: "🐾 A adopté Milo", text: "Milo est incroyable ! Il a traversé beaucoup, mais aujourd'hui il est pur bonheur. Voir cette transformation me fait remercier le Refuge chaque jour ! 🙏" },
      { name: "Carla N.", role: "🐾 A adopté Nina", text: "J'ai reçu Nina déjà rétablie et avec tous ses vaccins. L'accompagnement du refuge avant et après l'adoption a fait toute la différence." },
      { name: "Rafael S.", role: "💙 Donateur mensuel", text: "Je fais un don chaque mois et je reçois des mises à jour avec photos. On voit exactement où est allé l'argent." },
      { name: "Maria A.", role: "🐾 A adopté Luna", text: "Luna est arrivée timide et aujourd'hui elle ne quitte plus les enfants. Gratitude éternelle envers ceux qui en ont pris soin avant nous." },
    ],
  },
  faq: {
    title: "Questions fréquentes 🩵",
    items: [
      { q: "Comment les dons sont-ils utilisés ?", a: "Les dons financent la nourriture, les soins vétérinaires, les médicaments, les traitements et les dépenses de base du refuge. Chaque somme reçue aide directement les plus de 500 animaux sauvés." },
      { q: "Qui gère et administre le refuge ?", a: "Le refuge est financé par les dons et géré par Luana et une équipe dévouée de bénévoles et collaborateurs qui travaillent chaque jour au bien-être des animaux." },
      { q: "Les dons font-ils vraiment une différence ?", a: "Oui. Chaque contribution, même modeste, aide à faire vivre le refuge — des croquettes quotidiennes aux soins vétérinaires. Nous avons déjà sauvé plus de 4 500 vies grâce au soutien de personnes comme vous." },
      { q: "Les dons sont-ils sécurisés ?", a: "Oui. Le paiement est traité par une plateforme sécurisée et auditée, avec les mêmes normes que tout achat en ligne." },
      { q: "Comment suivre l'impact de mon don ?", a: "Nous publions fréquemment des mises à jour sur les réseaux sociaux et le site, montrant les améliorations, les étapes clés et les histoires réelles des animaux aidés. La transparence et la gratitude sont des piliers de notre mission." },
    ],
  },
  banner: { cta: "Transformer une vie", sub: "Chaque don est un acte d'amour 🐾" },
  footer: { tagline: "Nourriture, eau et soins essentiels pour les chiens abandonnés du sud de l'Europe.", disclaimer: "Clone pour analyse · Page de paiement non officielle" },
  checkout: {
    title: "Finaliser le don",
    youAreDonating: "Vous donnez",
    oneTime: "Unique",
    monthly: "Mensuel",
    chooseOther: "Choisir un autre montant",
    name: "Nom",
    namePlaceholder: "Votre nom",
    email: "Email",
    emailPlaceholder: "votre@email.com",
    secure: "Paiement chiffré et sécurisé. Vous recevrez un reçu par email.",
    donate: "Donner",
    demoNote: "Démo — aucun paiement réel n'est traité",
    close: "Fermer",
    successTitle: "Merci pour votre aide ! 🐾",
    successBody: "Votre don a été enregistré. Ceci est un clone pour analyse — aucun paiement réel n'a été traité.",
    successClose: "Fermer",
  },
  funnel: {
    matchTitle: "🔥 Votre don est doublé aujourd'hui",
    matchBody: "Chaque euro donné jusqu'à la fin de la campagne est multiplié par 2, grâce à un groupe de donateurs anonymes. Ne gaspillez pas cet impact.",
    countdownEnds: "La campagne se termine dans",
    days: "jours",
    hours: "h",
    minutes: "min",
    seconds: "sec",
    exitTitle: "Attendez ! Chaque minute compte 🐾",
    exitBody: "Plus de 150 chiens dépendent de nous aujourd'hui. Faites votre don maintenant et il sera doublé par un groupe de donateurs anonymes.",
    exitCta: "Je veux donner et doubler l'impact",
    exitNo: "Non, merci",
    donorTitle: "quelqu'un vient de donner",
    someone: "Quelqu'un",
    from: "de",
    trustSecure: "Paiement sécurisé",
    trustTransparent: "100% transparent",
    trustImpact: "Impact réel",
  },
  switcher: { language: "Langue", currency: "Devise" },
};

const de: Messages = {
  meta: {
    title: "Together We Feed — Gemeinsam Leben ernähren",
    description: "Futter, Wasser und grundlegende Pflege für ausgesetzte Hunde in Südeuropa. Helfen Sie uns, Leben zu retten.",
  },
  nav: { mission: "Mission", donate: "Spenden", impacts: "Wirkung", stories: "Geschichten", faq: "FAQ", donateNow: "Jetzt spenden", menu: "Menü öffnen" },
  hero: { alt: "Together We Feed — gemeinsam Leben ernähren" },
  video: { title: "Lernen Sie Together We Feed kennen", subtitle: "Sehen Sie und verstehen Sie, wie Ihre Hilfe Leben verändert.", cta: "Ich möchte helfen", play: "Präsentationsvideo abspielen" },
  mission: {
    title: "Von der Mission zur Wirkung",
    p1: "Together We Feed bringt Futter, Wasser und grundlegende Pflege zu ausgesetzten und gefährdeten Hunden in Südeuropa. Mit der Unterstützung von Menschen, die an diese Sache glauben, haben wir bereits über 1.200 Tiere gerettet und über 150 Tausend Mahlzeiten für Straßenhunde und -katzen bereitgestellt.",
    p2: "Heute stehen über 150 Tiere unter unserer Obhut, während viele andere noch auf der Straße sind — ausgesetzt Hunger, Durst, extremer Hitze und fehlenden Medikamenten. Jeder Beitrag hilft uns, sie zu retten.",
    animals: "1.200 Tiere",
    meals: "150 Tausend Mahlzeiten",
    cared: "150 Tiere stehen unter unserer Obhut",
  },
  stats: { animalsLabel: "Tiere geholfen", mealsLabel: "Tausend Mahlzeiten gespendet" },
  donate: {
    title: "Wählen Sie einen Betrag und retten Sie ein Leben",
    donate: "Spenden",
    ctaOnce: "Ich möchte jetzt helfen",
    ctaMonthly: "Monatlicher Spender werden",
    secure: "Sichere Spende · Verschlüsselte Zahlung · Jederzeit kündbar",
    cancelAnytime: "Jederzeit kündbar",
    selected: "Ausgewählt",
  },
  urgency: {
    title: "Sie brauchen heute Hilfe",
    text: "Hitze, Hunger und tierärztliche Versorgung können nicht warten. Ihr Beitrag hilft uns, Hunde zu füttern, zu behandeln und zu schützen, die jeden Tag auf uns angewiesen sind.",
    cta: "Ich möchte jetzt helfen",
  },
  goal: {
    raisedThisMonth: "diesen Monat gesammelt",
    racao: "Futter",
    medicamentos: "Medikamente",
    veterinario: "Tierarzt",
    renda: "Miete",
    outros: "Sonstiges",
    monthGoal: "Monatsziel",
    ofGoal: "vom Ziel",
  },
  impacts: {
    title: "Wirkung Ihrer Spende",
    subtitle: "Sehen Sie, wie Ihre Spende das Leben dieser Kleinen retten kann!",
    items: [
      "Eine Woche Futter und Hoffnung für ein Tier.",
      "Gesundheit und Ernährung für 2 Tiere über 10 Tage.",
      "Ein 10kg-Futtersack — ernährt 5 Leben für 30 Tage.",
      "Impfungen und Entwurmung, die 4 Tiere vor Krankheiten schützen.",
      "Vollständige und würdige Pflege für einen Monat für 3 Tiere.",
      "Notoperationen und Genesung von Tieren in kritischem Zustand.",
    ],
  },
  stories: {
    title: "Geschichten der Verwandlung",
    subtitle: "Dies sind einige der Hunderte von Tieren, die wir dank Ihrer Unterstützung retten und rehabilitieren konnten.",
  },
  contrast: {
    no1: "Ohne Sie bleiben die Näpfe leer.",
    no2: "Ohne Sie stoppt das Tierheim. Rechnungen häufen sich. Die tägliche Pflege, die Leben rettet, fällt aus.",
    no3: "Ohne Sie bleiben über 500 gerettete Hunde, die bereits das Ausgesetztsein erlitten haben, ohne Futter, ohne Behandlung und ohne einen sicheren Ort zum Ausruhen.",
    yes: "Mit Ihnen findet jedes Pfötchen Schutz. Jedes Leben erhält Pflege. Jede Geschichte bekommt eine neue Chance der Hoffnung 🐾💛",
  },
  live: { badge: "Live", raisedThisMonth: "diesen Monat gesammelt", ofGoal: "vom Ziel", goal: "Ziel" },
  testimonials: {
    title: "Adoption, die Leben verwandelt",
    stars: "5 Sterne",
    items: [
      { name: "Julia P.", role: "🐾 Hat Milo adoptiert", text: "Milo ist unglaublich! Er hat viel durchgemacht, aber heute ist er reines Glück. Diese Verwandlung zu sehen, lässt mich dem Retter jeden Tag danken! 🙏" },
      { name: "Carla N.", role: "🐾 Hat Nina adoptiert", text: "Ich habe Nina bereits erholt und mit allen Impfungen erhalten. Die Begleitung des Tierheims vor und nach der Adoption machte den Unterschied." },
      { name: "Rafael S.", role: "💙 Monatlicher Spender", text: "Ich spende jeden Monat und erhalte Updates mit Fotos. Man sieht genau, wo das Geld hingegangen ist." },
      { name: "Maria A.", role: "🐾 Hat Luna adoptiert", text: "Luna kam schüchtern und heute lässt sie die Kinder nicht mehr los. Ewige Dankbarkeit an alle, die sich vor uns um sie gekümmert haben." },
    ],
  },
  faq: {
    title: "Häufige Fragen 🩵",
    items: [
      { q: "Wie werden die Spenden verwendet?", a: "Spenden finanzieren Futter, tierärztliche Versorgung, Medikamente, Behandlungen und die Grundkosten des Tierheims. Jeder erhaltene Betrag hilft direkt den über 500 geretteten Tieren." },
      { q: "Wer führt und verwaltet das Tierheim?", a: "Das Tierheim wird durch Spenden getragen und von Luana sowie einem engagierten Team von Freiwilligen und Mitarbeitern geführt, die täglich für das Wohl der Tiere arbeiten." },
      { q: "Machen Spenden wirklich einen Unterschied?", a: "Ja. Jeder Beitrag, wie klein auch immer, hilft, das Tierheim am Laufen zu halten — vom täglichen Futter bis zur tierärztlichen Versorgung. Wir haben dank der Unterstützung von Menschen wie Ihnen bereits über 4.500 Leben gerettet." },
      { q: "Sind Spenden sicher?", a: "Ja. Die Zahlung wird über eine sichere, geprüfte Plattform abgewickelt, nach denselben Standards wie jeder Online-Kauf." },
      { q: "Wie verfolge ich die Wirkung meiner Spende?", a: "Wir veröffentlichen häufig Updates in sozialen Medien und auf der Website, die Verbesserungen, Meilensteine und echte Geschichten der geholfenen Tiere zeigen. Transparenz und Dankbarkeit sind Pfeiler unserer Mission." },
    ],
  },
  banner: { cta: "Ein Leben verwandeln", sub: "Jede Spende ist ein Akt der Liebe 🐾" },
  footer: { tagline: "Futter, Wasser und grundlegende Pflege für ausgesetzte Hunde in Südeuropa.", disclaimer: "Klon zur Analyse · Keine offizielle Zahlungsseite" },
  checkout: {
    title: "Spende abschließen",
    youAreDonating: "Sie spenden",
    oneTime: "Einmalig",
    monthly: "Monatlich",
    chooseOther: "Anderen Betrag wählen",
    name: "Name",
    namePlaceholder: "Ihr Name",
    email: "Email",
    emailPlaceholder: "ihr@email.com",
    secure: "Verschlüsselte und sichere Zahlung. Sie erhalten eine Quittung per Email.",
    donate: "Spenden",
    demoNote: "Demo — keine echte Zahlung wird verarbeitet",
    close: "Schließen",
    successTitle: "Danke für Ihre Hilfe! 🐾",
    successBody: "Ihre Spende wurde registriert. Dies ist ein Klon zur Analyse — keine echte Zahlung wurde verarbeitet.",
    successClose: "Schließen",
  },
  funnel: {
    matchTitle: "🔥 Ihre Spende wird heute verdoppelt",
    matchBody: "Jeder Euro, den Sie bis Kampagnenende spenden, wird mit 2 multipliziert, dank einer Gruppe anonymer Spender. Verschenken Sie diese Wirkung nicht.",
    countdownEnds: "Die Kampagne endet in",
    days: "Tage",
    hours: "Std",
    minutes: "Min",
    seconds: "Sek",
    exitTitle: "Warten Sie! Jede Minute zählt 🐾",
    exitBody: "Mehr als 150 Hunde sind heute auf uns angewiesen. Spenden Sie jetzt und Ihr Betrag wird von einer Gruppe anonymer Spender verdoppelt.",
    exitCta: "Ich möchte spenden und die Wirkung verdoppeln",
    exitNo: "Nein, danke",
    donorTitle: "jemand hat gerade gespendet",
    someone: "Jemand",
    from: "aus",
    trustSecure: "Sichere Zahlung",
    trustTransparent: "100% transparent",
    trustImpact: "Reale Wirkung",
  },
  switcher: { language: "Sprache", currency: "Währung" },
};

const it: Messages = {
  meta: {
    title: "Together We Feed — Insieme nutriamo vite",
    description: "Cibo, acqua e cure essenziali per cani abbandonati nel sud dell'Europa. Aiutaci a salvare vite.",
  },
  nav: { mission: "Missione", donate: "Dona", impacts: "Impatto", stories: "Storie", faq: "FAQ", donateNow: "Dona ora", menu: "Apri menu" },
  hero: { alt: "Together We Feed — insieme nutriamo vite" },
  video: { title: "Scopri Together We Feed", subtitle: "Guarda e capisci come il tuo aiuto trasforma vite.", cta: "Voglio aiutare", play: "Riproduci video di presentazione" },
  mission: {
    title: "Dalla missione all'impatto",
    p1: "Together We Feed porta cibo, acqua e cure essenziali ai cani abbandonati e in difficoltà nel sud dell'Europa. Con il sostegno di persone che credono in questa causa, abbiamo già salvato più di 1.200 animali e fornito più di 150 mila pasti a cani e gatti di strada.",
    p2: "Oggi più di 150 animali sono sotto le nostre cure, mentre molti altri restano in strada, esposti a fame, sete, calore estremo e mancanza di medicine. Ogni contributo ci aiuta a salvarli.",
    animals: "1.200 animali",
    meals: "150 mila pasti",
    cared: "150 animali sono sotto le nostre cure",
  },
  stats: { animalsLabel: "Animali aiutati", mealsLabel: "Migliaia di pasti donati" },
  donate: {
    title: "Scegli un importo e salva una vita",
    donate: "Dona",
    ctaOnce: "Voglio aiutare ora",
    ctaMonthly: "Diventa donatore mensile",
    secure: "Donazione sicura · Pagamento cifrato · Cancella quando vuoi",
    cancelAnytime: "Cancella quando vuoi",
    selected: "Selezionato",
  },
  urgency: {
    title: "Hanno bisogno di aiuto oggi",
    text: "Il caldo, la fame e le cure veterinarie non possono aspettare. Il tuo contributo ci aiuta a nutrire, curare e proteggere cani che dipendono da noi ogni giorno.",
    cta: "Voglio aiutare ora",
  },
  goal: {
    raisedThisMonth: "raccolti questo mese",
    racao: "Cibo",
    medicamentos: "Farmaci",
    veterinario: "Veterinario",
    renda: "Affitto",
    outros: "Altri",
    monthGoal: "Obiettivo del mese",
    ofGoal: "dell'obiettivo",
  },
  impacts: {
    title: "Impatto della tua donazione",
    subtitle: "Guarda come la tua donazione può salvare la vita di questi piccoli!",
    items: [
      "Una settimana di cibo e speranza per un animale.",
      "Salute e nutrimento per 2 animali per 10 giorni.",
      "Un sacco di 10kg di crocchette — nutre 5 vite per 30 giorni.",
      "Vaccini e antiparassitari che proteggono 4 animali dalle malattie.",
      "Cure complete e dignitose per un mese per 3 animali.",
      "Chirurgie d'urgenza e recupero di animali in condizioni critiche.",
    ],
  },
  stories: {
    title: "Storie di Trasformazione",
    subtitle: "Questi sono alcuni delle centinaia di animali che siamo riusciti a salvare e riabilitare grazie al tuo sostegno.",
  },
  contrast: {
    no1: "Senza di te, le ciotole restano vuote.",
    no2: "Senza di te, il rifugio si ferma. Le bollette si accumulano. La cura quotidiana che salva vite viene a mancare.",
    no3: "Senza di te, più di 500 cani salvati, che hanno già sofferto l'abbandono, restano senza cibo, senza cure e senza un posto sicuro per riposare.",
    yes: "Con te, ogni zampetta trova protezione. Ogni vita riceve cura. Ogni storia ottiene una nuova occasione di speranza 🐾💛",
  },
  live: { badge: "In diretta", raisedThisMonth: "raccolti questo mese", ofGoal: "dell'obiettivo", goal: "Obiettivo" },
  testimonials: {
    title: "Adozione che trasforma vite",
    stars: "5 stelle",
    items: [
      { name: "Julia P.", role: "🐾 Ha adottato Milo", text: "Milo è incredibile! Ha passato molto, ma oggi è pura felicità. Vedere questa trasformazione mi fa ringraziare il Rifugio ogni giorno! 🙏" },
      { name: "Carla N.", role: "🐾 Ha adottato Nina", text: "Ho ricevuto Nina già ristabilita e con tutte le vaccinazioni. L'accompagnamento del rifugio prima e dopo l'adozione ha fatto la differenza." },
      { name: "Rafael S.", role: "💙 Donatore mensile", text: "Dono ogni mese e ricevo aggiornamenti con foto. Si vede esattamente dove sono andati i soldi." },
      { name: "Maria A.", role: "🐾 Ha adottato Luna", text: "Luna è arrivata timida e oggi non si stacca dai bambini. Gratitudine eterna a chi se n'è preso cura prima di noi." },
    ],
  },
  faq: {
    title: "Domande frequenti 🩵",
    items: [
      { q: "Come vengono utilizzate le donazioni?", a: "Le donazioni finanziano il cibo, le cure veterinarie, i farmaci, i trattamenti e le spese base del rifugio. Ogni importo ricevuto aiuta direttamente i più di 500 animali salvati." },
      { q: "Chi gestisce e amministra il rifugio?", a: "Il rifugio è sostenuto dalle donazioni e gestito da Luana e un team dedicato di volontari e collaboratori che lavorano ogni giorno per il benessere degli animali." },
      { q: "Le donazioni fanno davvero la differenza?", a: "Sì. Ogni contributo, per quanto piccolo, aiuta a mantenere il rifugio in funzione — dalle crocchette quotidiane alle cure veterinarie. Abbiamo già salvato più di 4.500 vite grazie al sostegno di persone come te." },
      { q: "Le donazioni sono sicure?", a: "Sì. Il pagamento è gestito da una piattaforma sicura e auditata, con gli stessi standard di qualsiasi acquisto online." },
      { q: "Come seguo l'impatto della mia donazione?", a: "Pubblichiamo aggiornamenti frequenti sui social e sul sito, mostrando miglioramenti, traguardi e storie reali degli animali aiutati. Trasparenza e gratitudine sono pilastri della nostra missione." },
    ],
  },
  banner: { cta: "Trasforma una vita", sub: "Ogni donazione è un atto d'amore 🐾" },
  footer: { tagline: "Cibo, acqua e cure essenziali per cani abbandonati nel sud dell'Europa.", disclaimer: "Clone per analisi · Non è una pagina di pagamento ufficiale" },
  checkout: {
    title: "Completa la donazione",
    youAreDonating: "Stai donando",
    oneTime: "Unica",
    monthly: "Mensile",
    chooseOther: "Scegli un altro importo",
    name: "Nome",
    namePlaceholder: "Il tuo nome",
    email: "Email",
    emailPlaceholder: "tua@email.com",
    secure: "Pagamento cifrato e sicuro. Riceverai una ricevuta via email.",
    donate: "Dona",
    demoNote: "Demo — nessun pagamento reale viene processato",
    close: "Chiudi",
    successTitle: "Grazie per il tuo aiuto! 🐾",
    successBody: "La tua donazione è stata registrata. Questo è un clone per analisi — nessun pagamento reale è stato processato.",
    successClose: "Chiudi",
  },
  funnel: {
    matchTitle: "🔥 La tua donazione è raddoppiata oggi",
    matchBody: "Ogni euro che doni fino alla fine della campagna viene moltiplicato per 2, grazie a un gruppo di donatori anonimi. Non sprecare questo impatto.",
    countdownEnds: "La campagna termina in",
    days: "giorni",
    hours: "h",
    minutes: "min",
    seconds: "sec",
    exitTitle: "Aspetta! Ogni minuto conta 🐾",
    exitBody: "Più di 150 cani dipendono da noi oggi. Fai la tua donazione ora e sarà raddoppiata da un gruppo di donatori anonimi.",
    exitCta: "Voglio donare e raddoppiare l'impatto",
    exitNo: "No, grazie",
    donorTitle: "qualcuno ha appena donato",
    someone: "Qualcuno",
    from: "da",
    trustSecure: "Pagamento sicuro",
    trustTransparent: "100% trasparente",
    trustImpact: "Impatto reale",
  },
  switcher: { language: "Lingua", currency: "Valuta" },
};

export const MESSAGES: Record<LocaleCode, Messages> = {
  "pt-PT": pt,
  "pt-BR": pt, // pt-BR reuses pt dictionary (differences are minor for this copy)
  "en-US": en,
  "en-GB": en, // en-GB reuses en dictionary
  "es-ES": es,
  "fr-FR": fr,
  "de-DE": de,
  "it-IT": it,
};

export type { Messages };
