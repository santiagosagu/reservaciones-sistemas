import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import useRouterApp from "./routes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

function App() {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "aeb4dd00-593d-433e-babe-659cfab9ba0f",
  });

  beamsClient
    .start()
    .then(() => beamsClient.addDeviceInterest("hello"))
    .then(() => console.log("Successfully registered and subscribed!"))
    .catch(console.error);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={useRouterApp()} />
    </QueryClientProvider>
  );
}

export default App;
