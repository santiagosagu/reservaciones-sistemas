import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import useRouterApp from "./routes";
import { RouterProvider } from "react-router-dom";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={useRouterApp()} />
    </QueryClientProvider>
  );
}

export default App;
