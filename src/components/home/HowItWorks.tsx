export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Post Your Request",
      description: "Tell us what needs fixing in 3 simple steps. Device type, issue, budget.",
      icon: "📋",
    },
    {
      number: 2,
      title: "Browse Expert Bids",
      description: "See bids from local repair specialists with ratings and reviews.",
      icon: "🔍",
    },
    {
      number: 3,
      title: "Get It Fixed",
      description: "Accept a bid, track progress in real-time, pay securely. Done!",
      icon: "✨",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold text-ink mb-4">
            How It Works
          </h2>
          <p className="text-lg text-ink-60">
            Three simple steps to get your devices repaired
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-cream-3 -translate-y-1/2 -translate-x-1/2 z-0"></div>
              )}

              {/* Card */}
              <div className="relative bg-card border border-cream-3 rounded-lg p-8 text-center hover:shadow-md transition">
                {/* Step Circle */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-light border-2 border-green rounded-full mb-6 mx-auto">
                  <span className="text-2xl">{step.icon}</span>
                </div>

                {/* Step Number */}
                <div className="absolute top-4 right-4 text-3xl font-display font-bold text-green-light">
                  {step.number}
                </div>

                <h3 className="text-2xl font-display font-bold text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-ink-60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
