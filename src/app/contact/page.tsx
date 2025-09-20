import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <Mail className="h-10 w-10 text-primary" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            For any questions, feedback, or support, please feel free to reach out to us via email.
          </p>
          <a
            href="mailto:support@gpacalculator.com"
            className="text-lg font-semibold text-primary hover:underline"
          >
            support@gpacalculator.com
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
