import { ButtonLink } from "@/components/ui";

export function NotFoundContent() {
  return (
    <section className="section">
      <div className="container-x max-w-xl py-10 text-center">
        <p className="eyebrow eyebrow-dot justify-center">404</p>
        <h1 className="h-section mt-3">We couldn&apos;t find that page.</h1>
        <p className="lead mt-4">It may have moved. Try one of these instead.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/site-map/" variant="secondary">
            View Sitemap
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
