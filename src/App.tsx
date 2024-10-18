import "./App.css";
import useRouterApp from "./routes";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useDeleteOldReservations from "./hooks/useDeleteOldReservations";

function App() {
  useDeleteOldReservations();

  return (
    <>
      <ToastContainer />
      <RouterProvider router={useRouterApp()} />
    </>
  );
}

export default App;
