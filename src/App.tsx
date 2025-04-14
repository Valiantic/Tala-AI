
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter, AppRouterProvider } from "./router/AppRouter";
import { routes } from "./app/routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppRouterProvider>
      <AppRouter routes={routes} />
    </AppRouterProvider>
  </QueryClientProvider>
);

export default App;
