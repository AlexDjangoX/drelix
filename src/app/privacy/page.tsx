import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';
import { getCanonicalBaseUrl } from '@/lib/seo/seo';

const siteUrl = getCanonicalBaseUrl();

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description:
    'Polityka prywatności Drelix. Informacje o przetwarzaniu danych osobowych zgodnie z RODO i ustawą o ochronie danych osobowych. Kontakt: Wadowice.',
  alternates: { canonical: `${siteUrl}/privacy` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/privacy`,
    siteName: 'Drelix - Odzież Robocza i Ochronna',
    title: 'Polityka prywatności | Drelix',
    description:
      'Polityka prywatności i informacje o ochronie danych osobowych. Drelix Wadowice.',
    locale: 'pl_PL',
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className="pt-24 pb-16 lg:pt-28 lg:pb-24"
        id="main-content"
        role="main"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-2">
            Polityka prywatności
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Ostatnia aktualizacja: 31 stycznia 2026
          </p>

          <div className="space-y-8 text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline">
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                1. Administrator danych
              </h2>
              <p>
                Administratorem Twoich danych osobowych jest{' '}
                <strong>Drelix</strong> (odzież robocza i ochronna), Emila
                Zegadłowicza 43, 34-100 Wadowice, Polska.
              </p>
              <p>
                Kontakt: e-mail{' '}
                <a href="mailto:annabadura7@gmail.com">annabadura7@gmail.com</a>
                , telefon +48 725 695 933.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                2. Podstawa prawna i cele przetwarzania (RODO)
              </h2>
              <p>
                Przetwarzamy dane osobowe zgodnie z{' '}
                <strong>
                  Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679
                  (RODO)
                </strong>{' '}
                oraz
                <strong>
                  {' '}
                  ustawą z dnia 10 maja 2018 r. o ochronie danych osobowych
                </strong>{' '}
                (Dz.U. 2018 poz. 1000 z późn. zm.).
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Kontakt przez formularz / e-mail:</strong> podstawą
                  jest w przeważającej mierze realizacja czynności na żądanie
                  osoby, której dane dotyczą, przed zawarciem umowy (art. 6 ust.
                  1 lit. b RODO). Zgoda (art. 6 ust. 1 lit. a RODO) ma
                  zastosowanie wyłącznie wtedy, gdy zapytanie nie dotyczy
                  potencjalnej umowy. Cele: odpowiedź na zapytanie, obsługa
                  klienta.
                </li>
                <li>
                  <strong>
                    Funkcjonowanie strony (logi, pliki cookies niezbędne):
                  </strong>{' '}
                  podstawą jest prawnie uzasadniony interes administratora (art.
                  6 ust. 1 lit. f RODO) – zapewnienie bezpieczeństwa i
                  poprawnego działania serwisu.
                </li>
                <li>
                  <strong>
                    Cookies analityczne lub marketingowe (jeśli stosowane):
                  </strong>{' '}
                  podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a RODO),
                  wyrażona w ustawieniach cookies.
                </li>
                <li>
                  <strong>Dane w sklepie stacjonarnym:</strong> dane osobowe
                  mogą być także przetwarzane w związku ze sprzedażą w sklepie
                  stacjonarnym, reklamacjami oraz obowiązkami wynikającymi z
                  przepisów prawa (np. rachunkowość, fakturowanie).
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                3. Odbiorcy danych i przekazywanie poza EOG
              </h2>
              <p>
                Dane mogą być udostępniane podmiotom świadczącym usługi
                techniczne (hosting, e-mail, narzędzia analityczne), które
                działają na nasze zlecenie i tylko w zakresie niezbędnym. Nie
                sprzedajemy danych osobowych.
              </p>
              <p>
                W przypadku przekazywania danych do państw spoza EOG stosujemy
                mechanizmy przewidziane w RODO (np. standardowe klauzule umowne
                zatwierdzone przez Komisję Europejską).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                4. Okres przechowywania
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Dane z formularza kontaktowego: do czasu zakończenia sprawy
                  oraz ewentualnie do przedawnienia roszczeń lub obowiązków
                  prawnych.
                </li>
                <li>
                  Logi serwera: zgodnie z polityką hostingu, zwykle do kilku
                  tygodni.
                </li>
                <li>
                  Cookies: zgodnie z ustawieniami (sesyjne – do zamknięcia
                  przeglądarki; stałe – zgodnie z tabelą cookies).
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                5. Twoje prawa
              </h2>
              <p>
                Przysługują Ci prawa wynikające z RODO: dostęp do danych (art.
                15), sprostowanie (art. 16), usunięcie – „prawo do bycia
                zapomnianym” (art. 17), ograniczenie przetwarzania (art. 18),
                przenoszenie danych (art. 20), sprzeciw (art. 21), cofnięcie
                zgody (bez wpływu na legalność przetwarzania przed cofnięciem).
              </p>
              <p>
                Możesz złożyć skargę do organu nadzorczego:{' '}
                <strong>Prezes Urzędu Ochrony Danych Osobowych (PUODO)</strong>,
                ul. Stawki 2, 00-193 Warszawa,{' '}
                <a
                  href="https://uodo.gov.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  uodo.gov.pl
                </a>
                .
              </p>
              <p>
                W sprawach danych osobowych pisz na:{' '}
                <a href="mailto:annabadura7@gmail.com">annabadura7@gmail.com</a>
                .
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                6. Pliki cookies i technologia śledząca
              </h2>
              <p>
                Strona może używać plików cookies w celu zapewnienia działania
                serwisu (np. sesja, preferencje), analityki oraz – po Twojej
                zgodzie – marketingu. W przypadku stosowania cookies
                analitycznych lub marketingowych strona udostępnia baner cookies
                umożliwiający wyrażenie lub cofnięcie zgody przed ich użyciem.
              </p>
              <p>
                Więcej informacji o cookies i Twoich wyborach znajdziesz w
                ustawieniach przeglądarki oraz w dokumentacji RODO i dyrektywy
                ePrivacy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                7. Zmiany polityki
              </h2>
              <p>
                Aktualizacje polityki prywatności będą publikowane na tej
                stronie z podaniem daty „Ostatnia aktualizacja”. Zalecamy
                okresowe sprawdzanie treści.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-primary hover:underline font-medium">
              ← Powrót na stronę główną
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
