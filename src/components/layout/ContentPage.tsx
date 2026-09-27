import { Breadcrumb } from "@/components/ui/Overlays";

export function ContentPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-navy-900/60">{intro}</p>

      <div className="mt-10 flex max-w-2xl flex-col gap-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-lg font-semibold text-navy-900">{s.heading}</h2>
            <p className="mt-2 text-navy-900/70 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-12 max-w-2xl text-xs text-navy-900/40">
        This page contains fictional content created for a portfolio/demo project and does not represent a real company policy.
      </p>
    </div>
  );
}
