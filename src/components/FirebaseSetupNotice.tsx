export function FirebaseSetupNotice() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="max-w-lg rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="mb-2 text-lg font-semibold">
          Firebase još nije podešen
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Kopirajte <code className="rounded bg-muted px-1 py-0.5">.env.example</code> u{' '}
          <code className="rounded bg-muted px-1 py-0.5">.env</code> i
          popunite vrijednosti iz Firebase konzole (Project settings →
          General → Your apps → SDK setup and configuration), zatim
          restartujte dev server.
        </p>
        <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
{`VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`}
        </pre>
      </div>
    </div>
  )
}
