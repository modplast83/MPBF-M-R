import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Bug, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  retryLimit?: number;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[${this.props.componentName || 'Component'}] Error caught:`, error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Send error to monitoring service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          component: this.props.componentName || 'Unknown',
          error_id: this.state.errorId,
        }
      });
    }
    
    this.props.onError?.(error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleReset = () => {
    const { retryLimit = 3 } = this.props;
    const { retryCount } = this.state;
    
    if (retryCount < retryLimit) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1 
      });
    } else {
      // Too many retries, suggest refresh
      this.handleRefresh();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, retryCount, errorId } = this.state;
      const { retryLimit = 3, showErrorDetails = false, componentName } = this.props;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription>
                {componentName 
                  ? `An error occurred in the ${componentName} component`
                  : 'An unexpected error occurred in the application'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showErrorDetails && error && (
                <Alert className="bg-red-50 border-red-200">
                  <Bug className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <div className="font-medium">Error Details:</div>
                    <div className="mt-1 text-red-700">{error.message}</div>
                    {errorId && (
                      <div className="mt-1 text-xs text-red-600">
                        Error ID: {errorId}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="text-sm text-gray-600">
                {retryCount > 0 && (
                  <p className="mb-2">
                    Retry attempts: {retryCount} / {retryLimit}
                  </p>
                )}
                {retryCount >= retryLimit && (
                  <p className="text-red-600 font-medium">
                    Maximum retry attempts reached. Please refresh the page.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {retryCount < retryLimit ? (
                  <Button
                    onClick={this.handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                ) : (
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
                <Button onClick={this.handleRefresh} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withEnhancedErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    showErrorDetails?: boolean;
    retryLimit?: number;
    componentName?: string;
  }
) {
  return function WrappedComponent(props: P) {
    return (
      <EnhancedErrorBoundary
        fallback={options?.fallback}
        showErrorDetails={options?.showErrorDetails}
        retryLimit={options?.retryLimit}
        componentName={options?.componentName || Component.displayName || Component.name}
      >
        <Component {...props} />
      </EnhancedErrorBoundary>
    );
  };
}