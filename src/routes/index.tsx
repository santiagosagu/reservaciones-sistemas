import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import UserReservation from "../modules/UserReservation.tsx";
import Autentication from "../pages/Autentication.tsx";
import AdminModule from "../modules/admin/index.tsx";

const useRouterApp = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserReservation />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Autentication />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/admin",
      element: <AdminModule />,
      errorElement: <ErrorPage />,
    },
    // {
    //   path: "/hoteles",
    //   element: <Hoteles />,
    //   errorElement: <ErrorPage />,
    // },
    // {
    //   path: "habitaciones/:id",
    //   element: <ChooseRom />,
    //   errorElement: <ErrorPage />,
    // },
    // {
    //   path: "/login-admin",
    //   element: <Login />,
    //   errorElement: <ErrorPage />,
    // },
    // {
    //   path: "/admin",
    //   element: <Layout />,
    //   errorElement: <ErrorPage />,
    //   children: [
    //     {
    //       path: "dashboard",
    //       element: <Dashboard />,
    //     },
    //     {
    //       path: "nuevo-hotel",
    //       element: <NewHotel />,
    //     },
    //     {
    //       path: "editar-hotel/:id",
    //       element: <EditHotel />,
    //     },
    //     {
    //       path: "reservas",
    //       element: <Recervation />,
    //     },
    //   ],
    // },
  ]);

  return router;
};

export default useRouterApp;
