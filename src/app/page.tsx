import Navbar from "@/components/Navbar";
import ScrollSequence from "@/components/ScrollSequence";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-background">
      <Navbar />
      <ScrollSequence />
      
      {/* Footer / Extra spacing if needed, but ScrollSequence handles the 500vh */}
      <div className="h-32 flex items-center justify-center bg-background border-t border-primary/10 mt-auto">
        <p className="font-sans text-sm text-muted">
          © {new Date().getFullYear()} Hotel Bheemasena. Built with ❤️ for VIT-AP students.
        </p>
      </div>
    </main>
  );
}
