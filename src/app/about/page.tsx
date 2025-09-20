import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <GraduationCap className="h-10 w-10 text-primary" />
            About the GPA Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This application is designed to help students and faculty of Thiruvalluvar University easily calculate and analyze Grade Point Average (GPA) and Cumulative Grade Point Average (CGPA).
          </p>
          <p>
            Our goal is to provide a simple, fast, and reliable tool that removes the hassle of manual calculations. You can upload an Excel sheet containing student marks, and the application will instantly process the data, providing detailed results, including individual semester GPAs and overall CGPA for each student.
          </p>
          <p>
            Key features include:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-2">
            <li>Automatic GPA and CGPA calculation based on Thiruvalluvar University's grading system.</li>
            <li>Easy data import using Excel files.</li>
            <li>A dashboard to view and sort results (All students, Top 10, Bottom 10).</li>
            <li>Individual, detailed marksheets for each student.</li>
            <li>A searchable interface to quickly find student results.</li>
          </ul>
          <p>
            This tool is built with modern web technologies to ensure a responsive and user-friendly experience on any device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
