import GpaCalculator from '@/components/gpa-calculator';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">
            Thiruvalluvar University GPA Calculator
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Calculate GPA for a single student or upload a file for bulk processing.
          </p>
        </header>
        <GpaCalculator />
      </div>
    </div>
  );
}
