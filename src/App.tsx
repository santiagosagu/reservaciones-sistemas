import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import useRouterApp from "./routes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={useRouterApp()} />
    </QueryClientProvider>
  );
}

export default App;
