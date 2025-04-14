import React, { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <main className="min-h-screen">
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
