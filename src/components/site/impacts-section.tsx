import { DONATION_OPTIONS } from "./donation-options";

export function ImpactsSection() {
  return (
    <section id="impactos" className="bg-white py-14 sm:py-20">
      <div className="twf-container">
        <h2 className="twf-section-title text-center text-navy-deep">
          Impacto do seu donativo
        </h2>
        <p className="twf-subtitle mx-auto max-w-2xl text-center">
          Veja como a sua doação pode salvar a vida destes pequenos!
        </p>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {DONATION_OPTIONS.map((opt) => (
            <article key={opt.id} className="twf-impact-row">
              <div className="font-display text-3xl font-extrabold text-grass sm:w-28 sm:text-4xl">
                {opt.label}
              </div>
              <p className="flex-1 text-center text-[15px] text-slate-700 sm:text-left sm:text-base">
                <span className="mr-1" aria-hidden="true">
                  🩵
                </span>
                {opt.impact}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
