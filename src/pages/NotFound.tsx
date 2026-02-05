import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container min-h-[70vh] flex flex-col items-center justify-center py-12">
        <div className="bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Cookie className="w-12 h-12 text-amber-300" />
        </div>
        <h1 className="text-6xl font-extrabold text-amber-900 mb-4 font-playfair">404</h1>
        <p className="text-2xl font-bold text-amber-800 mb-2">Oops! Snack Not Found</p>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          The page you're looking for seems to have been eaten!
          Let's get you back to some delicious treats.
        </p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700 rounded-full px-8 py-6 text-lg">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
