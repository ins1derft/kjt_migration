export default function NotFound() {
  return (
    <main className="container-shell py-12">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold text-muted-foreground">404</p>
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist or is in draft.</p>
      </div>
    </main>
  );
}
