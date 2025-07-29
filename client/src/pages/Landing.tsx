import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Production Management System
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the advanced production management system. Please log in to continue.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full"
          >
            Log In with Replit
          </Button>
        </div>
      </div>
    </div>
  );
}