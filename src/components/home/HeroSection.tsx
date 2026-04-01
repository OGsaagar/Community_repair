import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-card flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-light border border-green rounded-full">
            <div className="w-2 h-2 rounded-full bg-green"></div>
            <span className="text-sm font-semibold text-green">Open in your area</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-6xl lg:text-7xl font-display font-bold text-ink mb-6 leading-tight">
          Repair. Reuse.{" "}
          <span className="text-green">Reconnect.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-ink-60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with local repair specialists in minutes. Get your devices fixed fast, 
          fair, and sustainably. Support local experts. Build community.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/request"
            className="px-8 py-4 bg-green text-white rounded-lg font-semibold hover:bg-green-mid transition shadow-md"
          >
            Get a Repair Quote
          </Link>
          <Link
            href="/signup?role=repairer"
            className="px-8 py-4 border-2 border-green text-green rounded-lg font-semibold hover:bg-green-light transition"
          >
            Become a Repairer
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-cream-3">
          <div>
            <div className="text-4xl font-display font-bold text-green">2,400+</div>
            <div className="text-sm text-ink-60 mt-2">Repairs Done</div>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-amber">98%</div>
            <div className="text-sm text-ink-60 mt-2">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-blue">50+</div>
            <div className="text-sm text-ink-60 mt-2">Cities Served</div>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-ink">$2.5M</div>
            <div className="text-sm text-ink-60 mt-2">Saved from Landfills</div>
          </div>
        </div>
      </div>
    </div>
  );
}
