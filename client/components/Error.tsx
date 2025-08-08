import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function Error({
  title = "Something went wrong",
  message = "We couldn't load the content. Please try again later.",
  onRetry,
}: ErrorProps) {
  return (
    <Card className="max-w-md mx-auto mt-10 text-center border-red-500 shadow-lg bg-background">
      <CardHeader>
        <div className="flex justify-center text-red-500 mb-2">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <CardTitle className="text-red-500 text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <Button variant="destructive" onClick={onRetry}>
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
