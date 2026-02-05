import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { verifyEmail, isAuthenticated } = useUser();
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          const result = await verifyEmail(token);
          setVerificationStatus(result ? "success" : "error");
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationStatus("error");
        }
      };

      verify();
    } else {
      setVerificationStatus("error");
    }
  }, [token, verifyEmail]);

  return (
    <Layout>
      <div className="container py-24">
        <div className="max-w-md mx-auto">
          <Card className="border-amber-100 shadow-lg">
            <CardHeader className="space-y-1 bg-amber-50/50 rounded-t-xl">
              <CardTitle className="text-2xl font-bold text-center text-amber-800">
                Email Verification
              </CardTitle>
              <CardDescription className="text-center font-medium">
                {verificationStatus === "loading" && "Verifying your email address..."}
                {verificationStatus === "success" && "Your email has been verified!"}
                {verificationStatus === "error" && "There was a problem verifying your email."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              {verificationStatus === "loading" && (
                <Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
              )}
              {verificationStatus === "success" && (
                <CheckCircle className="h-16 w-16 text-green-500 shadow-sm rounded-full" />
              )}
              {verificationStatus === "error" && (
                <XCircle className="h-16 w-16 text-red-500 shadow-sm rounded-full" />
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6 bg-amber-50/20 rounded-b-xl">
              {verificationStatus === "loading" ? (
                <p className="text-muted-foreground font-medium animate-pulse">Please wait while we confirm...</p>
              ) : verificationStatus === "success" ? (
                <Button asChild className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
                  <Link to={isAuthenticated ? "/profile" : "/login"}>
                    {isAuthenticated ? "Go to Your Profile" : "Sign In Now"}
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    The verification link may have expired or is invalid.
                    Please try logging in again.
                  </p>
                  <Button asChild variant="outline" className="border-amber-200 text-amber-700">
                    <Link to="/login">Return to Login</Link>
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
