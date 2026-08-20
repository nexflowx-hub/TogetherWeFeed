const NO_ITEMS = [
  "Sem si, as tigelas ficam vazias.",
  "Sem si, o abrigo para. As contas vencem. O cuidado que salva todos os dias falha.",
  "Sem si, mais de 500 cães resgatados, que já sofreram o abandono, ficam sem comida, sem tratamento e sem um lugar seguro para descansar.",
];

export function ContrastSection() {
  return (
    <section id="consigo" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {NO_ITEMS.map((text, i) => (
            <article
              key={i}
              className="relative flex flex-col gap-3 rounded-3xl bg-slate-soft p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-warn/10 text-xl font-bold text-rose-warn">
                ✕
              </div>
              <p className="text-[15px] leading-relaxed text-slate-700">
                <strong className="text-rose-warn">Sem si</strong>, {text.replace(/^Sem si, /, "")}
              </p>
            </article>
          ))}

          <article className="relative flex flex-col gap-3 rounded-3xl bg-mint-soft p-6 shadow-lg ring-2 ring-grass/30">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-grass/15 text-xl font-bold text-grass">
              ✓
            </div>
            <p className="text-[15px] leading-relaxed text-slate-700">
              <strong className="text-grass">Consigo</strong>,{" "}
              <strong className="text-navy-deep">
                cada patinha encontra proteção. Cada vida recebe cuidado. Cada
                história ganha uma nova oportunidade de esperança 🐾💛
              </strong>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
