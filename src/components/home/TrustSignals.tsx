export function TrustSignals() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "iPhone User",
      text: "Got my phone screen fixed same day. Amazing service!",
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Laptop Owner",
      text: "Professional repair at half the price of the Apple Store. Highly recommend!",
      avatar: "MJ",
    },
    {
      name: "Elena Rodriguez",
      role: "Repairer",
      text: "Great platform to connect with customers. Fair pricing and quick payouts.",
      avatar: "ER",
    },
  ];

  const badges = [
    { icon: "🔒", label: "Secure Payments" },
    { icon: "★", label: "Verified Experts" },
    { icon: "💚", label: "Eco-Friendly" },
    { icon: "⏱", label: "Fast Service" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Badges */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="text-center p-6 bg-cream rounded-lg"
            >
              <div className="text-4xl mb-3">{badge.icon}</div>
              <p className="font-semibold text-ink">{badge.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-4xl font-display font-bold text-ink text-center mb-12">
            Loved by Our Community
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-card border border-cream-3 rounded-lg p-6"
              >
                {/* Stars */}
                <div className="text-amber mb-4">★★★★★</div>

                {/* Quote */}
                <p className="text-ink-60 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-light flex items-center justify-center font-semibold text-green text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-xs text-ink-60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="bg-green-light border border-green rounded-lg p-12 text-center">
          <h3 className="text-3xl font-display font-bold text-green mb-6">
            Trusted by Thousands
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-display font-bold text-green mb-2">
                2,400+
              </div>
              <p className="text-green-dark">Successful Repairs</p>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-green mb-2">
                15K+
              </div>
              <p className="text-green-dark">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-green mb-2">
                1K+
              </div>
              <p className="text-green-dark">Verified Repairers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
