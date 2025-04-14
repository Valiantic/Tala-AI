import React, { createContext, useContext, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Define the router context
type AppRouterContextType = {
  push: (path: string) => void;
  pathname: string;
};

const AppRouterContext = createContext<AppRouterContextType | null>(null);

// Router wrapper component
export const AppRouterProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <AppRouterInner>{children}</AppRouterInner>
    </BrowserRouter>
  );
};

// Inner component to access router hooks
const AppRouterInner = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const push = (path: string) => {
    navigate(path);
  };
  
  return (
    <AppRouterContext.Provider value={{ push, pathname: location.pathname }}>
      {children}
    </AppRouterContext.Provider>
  );
};

// Hook to use the router
export const useAppRouter = () => {
  const context = useContext(AppRouterContext);
  if (!context) {
    throw new Error('useAppRouter must be used within an AppRouterProvider');
  }
  return context;
};

// Link component that uses the app router
export const Link = ({ 
  href, 
  children,
  className = ""
}: { 
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  const { push } = useAppRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    push(href);
  };
  
  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// Define the layout and page component structure
export type PageComponent = React.ComponentType<{}>;

export type RouteConfig = {
  path: string;
  component: PageComponent;
  layout?: React.ComponentType<{ children: ReactNode }>;
};

// Router component
export const AppRouter = ({ routes }: { routes: RouteConfig[] }) => {
  return (
    <Routes>
      {routes.map((route) => {
        const PageComponent = route.component;
        
        // If there's a layout, wrap the page component with it
        if (route.layout) {
          const Layout = route.layout;
          return (
            <Route 
              key={route.path} 
              path={route.path} 
              element={
                <Layout>
                  <PageComponent />
                </Layout>
              } 
            />
          );
        }
        
        // Otherwise, just render the page component
        return <Route key={route.path} path={route.path} element={<PageComponent />} />;
      })}
    </Routes>
  );
};
