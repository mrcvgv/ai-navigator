export default function ProSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">⚡</div>
        <h1 className="text-3xl font-bold mb-3">Welcome to Pro!</h1>
        <p className="text-gray-400 mb-6">
          Your Pro subscription is now active. All Pro features are unlocked.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Manage your subscription anytime via the receipt email from Stripe.
          Questions?{" "}
          <a href="mailto:hi@creama.xyz" className="text-amber-400 hover:underline">
            hi@creama.xyz
          </a>
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl font-bold transition-colors"
        >
          Start Exploring
        </a>
      </div>
    </main>
  );
}
