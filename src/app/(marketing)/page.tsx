import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedRepairers } from "@/components/home/FeaturedRepairers";
import { TrustSignals } from "@/components/home/TrustSignals";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <HowItWorks />
        <FeaturedRepairers />
        <TrustSignals />
      </main>
      <Footer />
    </>
  );
}
