"use client";
import { useState } from "react";

export default function CandidateForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    birthDate: "",
    education: "",
    experience: "",
    printingExp: "nie",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zapisujemy kandydata do localStorage dla demonstracji i szybkiego testu na Vercelu
    const existing = JSON.parse(localStorage.getItem("candidates") || "[]");
    existing.push({ ...formData, id: Date.now(), date: new Date().toLocaleDateString("pl-PL") });
    localStorage.setItem("candidates", JSON.stringify(existing));
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-4">
          <div className="text-emerald-400 text-5xl">✓</div>
          <h1 className="text-2xl font-bold">Dziękujemy, Grzegorz!</h1>
          <p className="text-slate-400">Twoje dane zostały przesłane do rekrutera. Skontaktujemy się z Tobą po weryfikacji.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Generator CV - Drukarnia</h1>
          <p className="text-sm text-slate-400 mt-1">Wypełnij poniższe pola, abyśmy mogli rozpatrzyć Twoją kandydaturę.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Imię i Nazwisko</label>
            <input required type="text" placeholder="np. Grzegorz Pawłowski" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Numer telefonu</label>
              <input required type="tel" placeholder="np. +48 790 267 752" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Data urodzenia</label>
              <input required type="date" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Wykształcenie</label>
            <input required type="text" placeholder="np. Średnie techniczne, zawodowe" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Doświadczenie zawodowe (co robiłeś w życiu?)</label>
            <textarea required rows={4} placeholder="Opisz krótko gdzie wcześniej pracowałeś i jakie miałeś obowiązki..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Czy masz doświadczenie w pracy w drukarni / na produkcji?</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" value={formData.printingExp} onChange={e => setFormData({...formData, printingExp: e.target.value})}>
              <option value="nie">Nie, ale szybko się uczę</option>
              <option value="tak">Tak, pracowałem już w drukarni</option>
              <option value="produkcja">Pracowałem na innej produkcji / magazynie</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-lg shadow-blue-600/20">
            Wyślij Moje Dane
          </button>
        </form>
      </div>
    </div>
  );
}