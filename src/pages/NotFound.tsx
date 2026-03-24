import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Page not found: <code className="text-sm">{location.pathname}</code>
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Go back</Link>
      </Button>
    </div>
  );
};

export default NotFound;
