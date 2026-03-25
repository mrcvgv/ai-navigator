export default function AdvertiseSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-3">You&apos;re all set!</h1>
        <p className="text-gray-400 mb-6">
          Your sponsored placement is being set up. We&apos;ll email you within 1 business day with
          next steps to configure your listing.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Questions? Reply to your receipt or email{" "}
          <a href="mailto:hi@creama.xyz" className="text-indigo-400 hover:underline">
            hi@creama.xyz
          </a>
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
        >
          Back to AI Navigator
        </a>
      </div>
    </main>
  );
}
