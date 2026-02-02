import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar, Footer } from '@/components';
import { getCanonicalBaseUrl } from '@/lib/SEO/seo';

const siteUrl = getCanonicalBaseUrl();

export const metadata: Metadata = {
  title: 'Regulamin',
  description:
    'Regulamin serwisu Drelix. Warunki korzystania ze strony, informacje o sprzedawcy i prawach konsumenta zgodnie z prawem polskim i UE. Wadowice.',
  alternates: { canonical: `${siteUrl}/terms` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/terms`,
    siteName: 'Drelix - Odzież Robocza i Ochronna',
    title: 'Regulamin | Drelix',
    description: 'Regulamin serwisu i warunki korzystania. Drelix Wadowice.',
    locale: 'pl_PL',
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
            Regulamin serwisu
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Ostatnia aktualizacja: 31 stycznia 2026
          </p>

          <div className="space-y-8 text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline">
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                1. Postanowienia ogólne
              </h2>
              <p>
                Niniejszy regulamin określa zasady korzystania z serwisu
                internetowego prowadzonego przez <strong>Drelix</strong> (odzież
                robocza i ochronna), Emila Zegadłowicza 43, 34-100 Wadowice,
                Polska.
              </p>
              <p>
                Serwis ma charakter informacyjny i prezentuje ofertę oraz dane
                kontaktowe. Korzystanie ze strony oznacza akceptację niniejszego
                regulaminu oraz{' '}
                <Link href="/privacy">Polityki prywatności</Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                2. Sprzedawca i kontakt
              </h2>
              <p>
                Sprzedawcą / usługodawcą jest <strong>Drelix</strong>, Emila
                Zegadłowicza 43, 34-100 Wadowice, Polska. Kontakt: e-mail{' '}
                <a href="mailto:annabadura7@gmail.com">annabadura7@gmail.com</a>
                , telefon +48 725 695 933.
              </p>
              <p>
                W sprawach zamówień, reklamacji i praw konsumenta prosimy o
                kontakt pod powyższymi danymi.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                3. Korzystanie z serwisu
              </h2>
              <p>
                Użytkownik zobowiązuje się do korzystania z serwisu w sposób
                zgodny z prawem, dobrymi obyczajami oraz niniejszym regulaminem.
                Zabronione jest m.in. naruszanie praw autorskich,
                rozpowszechnianie treści bezprawnych oraz utrudnianie działania
                serwisu.
              </p>
              <p>
                Treści serwisu (teksty, grafiki, układ) są chronione prawem
                autorskim. Wykorzystanie poza dozwolonym użytkiem wymaga zgody
                administratora.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                4. Prawa konsumenta (B2C) i sprzedaż stacjonarna
              </h2>
              <p>
                <strong>
                  Sprzedaż prowadzona jest wyłącznie w lokalu stacjonarnym.
                </strong>{' '}
                Umowy sprzedaży zawierane są w sklepie stacjonarnym, a nie na
                odległość ani poza lokalem przedsiębiorstwa. Strona internetowa
                ma charakter wyłącznie informacyjny i prezentuje ofertę; zakupy
                i płatności odbywają się w sklepie.
              </p>
              <p>
                Płatności w sklepie stacjonarnym mogą być dokonywane gotówką,
                kartą płatniczą lub innymi udostępnionymi metodami.
              </p>
              <p>
                Do sprzedaży w sklepie stacjonarnym oraz do umów z konsumentami
                (osobami fizycznymi w celach niezwiązanych z działalnością
                zawodową) mają zastosowanie przepisy prawa polskiego i Unii
                Europejskiej o ochronie konsumentów, w tym:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Ustawa z dnia 23 kwietnia 1964 r. – Kodeks cywilny (Dz.U. 1964
                  nr 16 poz. 93 z późn. zm.),
                </li>
                <li>
                  Ustawa z dnia 30 maja 2014 r. o prawach konsumenta i o
                  odpowiedzialności za szkodę wyrządzoną przez produkt
                  niebezpieczny (Dz.U. 2014 poz. 827 z późn. zm.),
                </li>
                <li>
                  Dyrektywa 2011/83/UE w sprawie praw konsumentów oraz
                  rozporządzenia i dyrektywy UE w sprawie konsumentów.
                </li>
              </ul>
              <p className="mt-4">
                Prawo odstąpienia od umowy w terminie 14 dni przysługuje
                wyłącznie w przypadkach przewidzianych przez przepisy prawa (np.
                przy umowach zawieranych na odległość lub poza lokalem
                przedsiębiorstwa), o ile takie umowy zostaną zawarte. W
                przypadku sprzedaży stacjonarnej w lokalu sklepu prawo
                odstąpienia nie przysługuje z mocy ustawy. Konsument ma
                natomiast prawo do reklamacji towaru (rękojmia) oraz prawo do
                skorzystania z pozasądowych sposobów rozpatrywania reklamacji i
                dochodzenia roszczeń (np. stały polubowny sąd konsumencki,
                mediacja).
              </p>
              <p className="mt-4">
                Sklep nie przewiduje dobrowolnych zwrotów towarów
                pełnowartościowych zakupionych w sklepie stacjonarnym, poza
                przypadkami wynikającymi z przepisów prawa (np. rękojmia,
                gwarancja).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                5. Ograniczenie odpowiedzialności
              </h2>
              <p>
                Administrator dokłada starań, aby treści serwisu były aktualne i
                poprawne. Nie ponosi jednak odpowiedzialności za ewentualne
                błędy, przerwy w działaniu serwisu ani za szkody wynikłe z
                korzystania z informacji zamieszczonych na stronie, z
                zastrzeżeniem przypadków wyłączonych przez prawo (np. wina
                umyślna, wina nieumyślna w zakresie dozwolonym przez ustawę).
              </p>
              <p>
                Odnośniki do stron zewnętrznych służą wyłącznie informacji;
                administrator nie odpowiada za treści i polityki tych serwisów.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                6. Rozstrzyganie sporów i prawo właściwe
              </h2>
              <p>
                W sprawach spornych wynikających z umów z konsumentami konsument
                może skorzystać z platformy ODR Komisji Europejskiej:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
              <p>
                Prawo właściwe dla umów z konsumentami pozostaje zgodne z
                przepisami UE i Polski (w tym rozporządzeniem Rzym I). Dla
                przedsiębiorców strony mogą uzgodnić prawo polskie i sądy
                polskie (np. właściwe dla siedziby sprzedawcy).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
                7. Zmiany regulaminu
              </h2>
              <p>
                Administrator zastrzega sobie prawo do zmiany regulaminu.
                Aktualna wersja jest zawsze dostępna na tej stronie z podaniem
                daty „Ostatnia aktualizacja”. Dalsze korzystanie z serwisu po
                opublikowaniu zmian oznacza akceptację nowego regulaminu.
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
