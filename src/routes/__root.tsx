import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-script text-6xl text-gold">404</p>
        <h2 className="mt-4 text-2xl font-display text-foreground">This page has left the celebration</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-none border border-gold px-8 py-3 text-sm tracking-[0.2em] uppercase text-gold transition-all hover:bg-gold hover:text-primary-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please refresh, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center border border-gold px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-gold hover:bg-gold hover:text-primary-foreground transition-all"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-border px-6 py-2.5 text-xs tracking-[0.2em] uppercase text-foreground hover:border-gold transition-all"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Function Junction — Luxury Event Management & Planning" },
      { name: "description", content: "The Function Junction crafts unforgettable luxury weddings, corporate galas and private celebrations. Turning every celebration into an experience." },
      { name: "author", content: "The Function Junction" },
      { property: "og:title", content: "The Function Junction — Luxury Event Management & Planning" },
      { property: "og:description", content: "The Function Junction crafts unforgettable luxury weddings, corporate galas and private celebrations. Turning every celebration into an experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d0b08" },
      { name: "twitter:title", content: "The Function Junction — Luxury Event Management & Planning" },
      { name: "twitter:description", content: "The Function Junction crafts unforgettable luxury weddings, corporate galas and private celebrations. Turning every celebration into an experience." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/jXBcO2Lc5EU3pl4UoH6zEltw0682/social-images/social-1783416521619-thefunctionjunction.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/jXBcO2Lc5EU3pl4UoH6zEltw0682/social-images/social-1783416521619-thefunctionjunction.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-right" richColors />
    </QueryClientProvider>
  );
}
