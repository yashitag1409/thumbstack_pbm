export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-6">
      <div className="glass-panel rounded-2xl border border-card-border bg-card p-10 text-center shadow-xl max-w-lg w-full">
        <h1 className="book-title text-6xl font-bold text-primary mb-4">404</h1>

        <p className="text-lg text-muted mb-6">
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-white font-medium transition hover:opacity-90"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
