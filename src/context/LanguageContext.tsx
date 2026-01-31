"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type Language = 'pl' | 'en';

interface Translations {
  nav: {
    about: string;
    products: string;
    whyUs: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    scrollToMap: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  about: {
    title: string;
    description: string;
    experience: string;
    quality: string;
    trust: string;
    storePhoto: string;
  };
  products: {
    title: string;
    subtitle: string;
    viewAll: string;
    catalogTitle: string;
    catalogSubtitle: string;
    catalogCount: string;
    catalogOther: string;
    viewFullCatalog: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    quality: { title: string; description: string };
    range: { title: string; description: string };
    expert: { title: string; description: string };
    prices: { title: string; description: string };
    local: { title: string; description: string };
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    hoursValue: string;
    form: {
      name: string;
      email: string;
      message: string;
      send: string;
      success: string;
      error: string;
      placeholderMessage: string;
      sending: string;
    };
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    quickLinksTitle: string;
    followUs: string;
  };
  productNames: {
    helmets: string;
    vests: string;
    gloves: string;
    polbuty: string;
    trzewiki: string;
    sandaly: string;
    kalosze: string;
    footwear: string;
    clothing: string;
    koszula: string;
    caps: string;
    aprons: string;
    sweatshirts: string;
    jackets: string;
    eyewear: string;
    earProtection: string;
    masks: string;
    harnesses: string;
    firstAid: string;
    rainwear: string;
    thermalWear: string;
    kneeProtection: string;
    signage: string;
    accessories: string;
    wkladki: string;
    polar: string;
  };
}

const translations: Record<Language, Translations> = {
  pl: {
    nav: {
      about: 'O nas',
      products: 'Produkty',
      whyUs: 'Dlaczego my',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Profesjonalna Odzież Robocza',
      subtitle:
        'Twoje bezpieczeństwo jest naszym priorytetem. Oferujemy najwyższej jakości odzież ochronną dla każdej branży.',
      cta: 'Zobacz produkty',
      scrollToMap: 'Zobacz mapę i lokalizację',
      trust1: 'Produkty CE',
      trust2: 'Normy EN',
      trust3: 'Odzież BHP',
    },
    about: {
      title: 'O nas',
      description:
        'Drelix to zaufany dostawca odzieży roboczej i ochronnej w Wadowicach. Od lat zapewniamy profesjonalistom z różnych branż najwyższej jakości produkty, które chronią i wspierają w codziennej pracy.',
      experience: 'Lat doświadczenia',
      quality: 'Produktów wysokiej jakości',
      trust: 'Zadowolonych klientów',
      storePhoto: 'Zdjęcie sklepu',
    },
    products: {
      title: 'Nasze produkty',
      subtitle: 'Szeroki wybór odzieży ochronnej i roboczej dla każdej branży',
      viewAll: 'Zobacz wszystkie',
      catalogTitle: 'Katalog produktów',
      catalogSubtitle: 'Pełna oferta sklepu – odzież robocza i ochronna, BHP.',
      catalogCount: 'produktów',
      catalogOther: 'Inne',
      viewFullCatalog: 'Zobacz pełny katalog',
    },
    whyUs: {
      title: 'Dlaczego my?',
      subtitle: 'Wybierając Drelix, wybierasz jakość i profesjonalizm',
      quality: {
        title: 'Najwyższa jakość',
        description:
          'Wszystkie nasze produkty spełniają najwyższe standardy bezpieczeństwa',
      },
      range: {
        title: 'Szeroki asortyment',
        description: 'Ponad 500 produktów dla każdej branży i zastosowania',
      },
      expert: {
        title: 'Fachowe doradztwo',
        description:
          'Nasz zespół pomoże dobrać idealne rozwiązanie dla Twoich potrzeb',
      },
      prices: {
        title: 'Konkurencyjne ceny',
        description: 'Najlepsza jakość w przystępnej cenie',
      },
      local: {
        title: 'Lokalna firma',
        description: 'Działamy w Wadowicach i znamy potrzeby lokalnego rynku',
      },
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Skontaktuj się z nami lub odwiedź nasz sklep',
      address: 'Adres',
      phone: 'Telefon',
      email: 'Email',
      hours: 'Godziny otwarcia',
      hoursValue: 'Pon-Pt: 8:00-17:00, Sob: 8:00-13:00',
      form: {
        name: 'Imię i nazwisko',
        email: 'Email',
        message: 'Wiadomość',
        send: 'Wyślij wiadomość',
        success: 'Wiadomość została wysłana!',
        error: 'Nie udało się wysłać. Spróbuj ponownie lub napisz na kontakt@drelix.pl.',
        placeholderMessage: 'Twoja wiadomość...',
        sending: 'Wysyłanie...',
      },
    },
    footer: {
      rights: 'Wszelkie prawa zastrzeżone',
      quickLinksTitle: 'Szybkie linki',
      followUs: 'Śledź nas',
      privacy: 'Polityka prywatności',
      terms: 'Regulamin',
    },
    productNames: {
      helmets: 'Kaski ochronne',
      vests: 'Kamizelki odblaskowe',
      gloves: 'Rękawice robocze',
      polbuty: 'Półbuty',
      trzewiki: 'Trzewiki',
      sandaly: 'Sandały',
      kalosze: 'Kalosze / gumofilce',
      footwear: 'Obuwie ochronne',
      clothing: 'Odzież ochronna',
      koszula: 'Koszule robocze',
      caps: 'Czapki',
      aprons: 'Fartuchy / Zapaski',
      sweatshirts: 'Bluzy',
      jackets: 'Kurtki',
      polar: 'Polary',
      eyewear: 'Okulary ochronne',
      earProtection: 'Ochrona słuchu',
      masks: 'Maski i półmaski',
      harnesses: 'Szelki bezpieczeństwa',
      firstAid: 'Apteczki pierwszej pomocy',
      rainwear: 'Odzież przeciwdeszczowa',
      thermalWear: 'Odzież termiczna',
      kneeProtection: 'Nakolanniki',
      signage: 'Znaki bezpieczeństwa',
      accessories: 'Akcesoria BHP',
      wkladki: 'Wkładki do butów',
    },
  },
  en: {
    nav: {
      about: 'About',
      products: 'Products',
      whyUs: 'Why Us',
      contact: 'Contact',
    },
    hero: {
      title: 'Professional Safety Clothing',
      subtitle:
        'Your safety is our priority. We offer the highest quality protective clothing for every industry.',
      cta: 'View Products',
      scrollToMap: 'View location map',
      trust1: 'CE-marked products',
      trust2: 'EN compliant',
      trust3: 'Quality workwear',
    },
    about: {
      title: 'About Us',
      description:
        'Drelix is a trusted supplier of work and protective clothing in Wadowice. For years, we have been providing professionals from various industries with the highest quality products that protect and support their daily work.',
      experience: 'Years of experience',
      quality: 'Quality products',
      trust: 'Satisfied customers',
      storePhoto: 'Store photo',
    },
    products: {
      title: 'Our Products',
      subtitle:
        'Wide selection of protective and work clothing for every industry',
      viewAll: 'View All',
      catalogTitle: 'Product catalog',
      catalogSubtitle: 'Full store offer – work and protective clothing, PPE.',
      catalogCount: 'products',
      catalogOther: 'Other',
      viewFullCatalog: 'View full catalog',
    },
    whyUs: {
      title: 'Why Choose Us?',
      subtitle: 'Choosing Drelix means choosing quality and professionalism',
      quality: {
        title: 'Highest Quality',
        description: 'All our products meet the highest safety standards',
      },
      range: {
        title: 'Wide Range',
        description: 'Over 500 products for every industry and application',
      },
      expert: {
        title: 'Expert Advice',
        description:
          'Our team will help you find the perfect solution for your needs',
      },
      prices: {
        title: 'Competitive Prices',
        description: 'Best quality at affordable prices',
      },
      local: {
        title: 'Local Business',
        description: 'We operate in Wadowice and understand local market needs',
      },
    },
    contact: {
      title: 'Contact',
      subtitle: 'Get in touch with us or visit our store',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      hours: 'Opening Hours',
      hoursValue: 'Mon-Fri: 8:00-17:00, Sat: 8:00-13:00',
      form: {
        name: 'Full name',
        email: 'Email',
        message: 'Message',
        send: 'Send Message',
        success: 'Message sent successfully!',
        error: 'Something went wrong. Please try again or email kontakt@drelix.pl.',
        placeholderMessage: 'Your message...',
        sending: 'Sending...',
      },
    },
    footer: {
      rights: 'All rights reserved',
      quickLinksTitle: 'Quick Links',
      followUs: 'Follow Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    productNames: {
      helmets: 'Safety Helmets',
      vests: 'High-Visibility Vests',
      gloves: 'Work Gloves',
      polbuty: 'Safety shoes (półbuty)',
      trzewiki: 'Work boots (trzewiki)',
      sandaly: 'Sandals',
      kalosze: 'Rubber boots / wellingtons',
      footwear: 'Safety Footwear',
      clothing: 'Protective Clothing',
      koszula: 'Work Shirts',
      caps: 'Caps',
      aprons: 'Aprons',
      sweatshirts: 'Sweatshirts',
      jackets: 'Jackets',
      polar: 'Fleece',
      eyewear: 'Safety Glasses',
      earProtection: 'Hearing Protection',
      masks: 'Masks & Respirators',
      harnesses: 'Safety Harnesses',
      firstAid: 'First Aid Kits',
      rainwear: 'Rainwear',
      thermalWear: 'Thermal Clothing',
      kneeProtection: 'Knee Pads',
      signage: 'Safety Signs',
      accessories: 'Safety Accessories',
      wkladki: 'Shoe Insoles',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = 'drelix-language';

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'pl';
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'pl' || stored === 'en') return stored;
  return 'pl';
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
