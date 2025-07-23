import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useState, useEffect } from "react";
import LoadingProgress from "@/components/loading-progress";
import RouteTransition from "@/components/route-transition";
import SEOHead from "@/components/seo-head";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

// Lazy load components for code splitting
const Home = lazy(() => import("@/pages/home"));
const Products = lazy(() => import("@/pages/products"));
const ProductDetailModern = lazy(() => import("@/pages/product-detail-modern"));
const Cart = lazy(() => import("@/pages/cart"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-ops-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-night-vision border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-night-vision font-military-header tracking-wider">
          LOADING TACTICAL INTERFACE...
        </div>
      </div>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    setIsRouteLoading(true);
    const timer = setTimeout(() => setIsRouteLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <LoadingProgress isLoading={isRouteLoading} />
      <RouteTransition routeKey={location}>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/products/:id" component={ProductDetailModern} />
            <Route path="/cart" component={Cart} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </RouteTransition>
    </>
  );
}

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Initialize smooth scrolling
  useSmoothScroll();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, continue without PWA features
      });
    }

    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-ops-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-night-vision border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-night-vision font-military-header text-xl tracking-wider mb-2">
            PRECISION GEAR CO
          </div>
          <div className="text-tactical-tan font-hud text-sm">
            Initializing tactical systems...
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SEOHead />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
