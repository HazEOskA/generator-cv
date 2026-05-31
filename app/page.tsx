"use client";

import { useState } from "react";

export default function CandidateForm() {
  const initialFormData = {
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    currentLocation: "",
    availability: "",
    education: "",
    experience: "",
    printingExp: "nie",
    languages: "",
    drivingLicense: "brak",
    cvConsent: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [status, setStatus] = useState<{ success: boolean; error: string | null }>({
    success: false,
    error: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData({
        ...formData,
        [target.name]: target.checked,
      });
      return;
    }

    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cvConsent) {
      setStatus({
        success: false,
        error: "Musisz wyrazić zgodę na przetwarzanie danych w celu prowadzenia rekrutacji.",
      });
      return;
    }

    setLoading(true);
    setStatus({ success: false, error: null });

    try {
      const response = await fetch("https://formspree.io/f/xjgzdoag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: "Formularz Rekrutacyjny - Praca w Drukarni",
        }),
      });

      if (response.ok) {
        setStatus({ success: true, error: null });
        setFormData(initialFormData);
      } else {
        const data = await response.json();
        setStatus({
          success: false,
          error: data.error || "Wystąpił błąd podczas wysyłania formularza.",
        });
      }
    } catch {
      setStatus({
        success: false,
        error: "Błąd połączenia z serwerem. Spróbuj ponownie za chwilę.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status.success) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <div className="text-emerald-400 text-5xl">✓</div>
          <h1 className="text-2xl font-bold">Dane zostały przesłane!</h1>
          <p className="text-slate-400">
            Dziękujemy. Twoja aplikacja została zarejestrowana. Skontaktujemy się z Tobą telefonicznie.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 flex flex-col items-center justify-center">
      <section className="w-full max-w-2xl bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 shadow-2xl space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400 font-semibold">
            Rekrutacja / Intake CV
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-2">
            Formularz Rekrutacyjny - Praca w Drukarni
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Wypełnij dane dokładnie. Na podstawie formularza przygotujemy Twoje zgłoszenie oraz CV dla pracodawcy.
          </p>
        </header>

        {status.error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
              Imię i nazwisko
            </label>
            <input
              required
              id="fullName"
              type="text"
              name="fullName"
              placeholder="np. Grzegorz Pawłowski"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-300">
                Numer telefonu
              </label>
              <input
                required
                id="phone"
                type="tel"
                name="phone"
                placeholder="np. +48 790 267 752"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Adres e-mail
              </label>
              <input
                required
                id="email"
                type="email"
                name="email"
                placeholder="np. kandydat@email.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="birthDate" className="text-sm font-medium text-slate-300">
                Data urodzenia
              </label>
              <input
                required
                id="birthDate"
                type="date"
                name="birthDate"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currentLocation" className="text-sm font-medium text-slate-300">
                Miejscowość / kraj pobytu
              </label>
              <input
                required
                id="currentLocation"
                type="text"
                name="currentLocation"
                placeholder="np. Rotterdam, Holandia"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                value={formData.currentLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="availability" className="text-sm font-medium text-slate-300">
              Dostępność od kiedy
            </label>
            <input
              required
              id="availability"
              type="text"
              name="availability"
              placeholder="np. od zaraz, od przyszłego tygodnia, od 15 czerwca"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.availability}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="education" className="text-sm font-medium text-slate-300">
              Wykształcenie
            </label>
            <input
              required
              id="education"
              type="text"
              name="education"
              placeholder="np. zawodowe, średnie, techniczne, wyższe"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.education}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="text-sm font-medium text-slate-300">
              Doświadczenie zawodowe
            </label>
            <textarea
              required
              id="experience"
              rows={5}
              name="experience"
              placeholder="Podaj nazwę firmy, stanowisko, okres pracy i główne obowiązki. Jeśli nie masz doświadczenia, wpisz: brak doświadczenia zawodowego."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="printingExp" className="text-sm font-medium text-slate-300">
              Czy masz doświadczenie w pracy w drukarni / na produkcji?
            </label>
            <select
              id="printingExp"
              name="printingExp"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.printingExp}
              onChange={handleChange}
            >
              <option value="nie">Nie, ale szybko się uczę</option>
              <option value="tak">Tak, pracowałem już w drukarni</option>
              <option value="produkcja">Pracowałem na innej produkcji / magazynie</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="languages" className="text-sm font-medium text-slate-300">
              Języki
            </label>
            <input
              required
              id="languages"
              type="text"
              name="languages"
              placeholder="np. polski ojczysty, angielski podstawowy, niderlandzki brak"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.languages}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="drivingLicense" className="text-sm font-medium text-slate-300">
              Prawo jazdy
            </label>
            <select
              id="drivingLicense"
              name="drivingLicense"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              value={formData.drivingLicense}
              onChange={handleChange}
            >
              <option value="brak">Brak</option>
              <option value="kat-b">Kat. B</option>
              <option value="inne">Inne</option>
            </select>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
            <input
              required
              type="checkbox"
              name="cvConsent"
              checked={formData.cvConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-blue-600"
            />
            <span>
              Wyrażam zgodę na przetwarzanie moich danych osobowych w celu prowadzenia rekrutacji.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-medium py-3 rounded-lg transition shadow-lg shadow-blue-600/20"
          >
            {loading ? "Wysyłanie..." : "Wyślij moje dane"}
          </button>
        </form>
      </section>
    </main>
  );
}
