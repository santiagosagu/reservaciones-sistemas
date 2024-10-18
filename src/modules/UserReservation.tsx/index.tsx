import { Button, Tabs, TabsProps } from "antd";
import NewReservation from "./NewReservation";
import CheckoutReservation from "./CheckoutReservation";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AllReservationWhitConfirm from "./AllReservationWhitConfirm";

const UserReservation = () => {
  const { usuario, cerrarSesion, cargando } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario && !cargando) navigate("/login");
  }, [usuario, navigate, cargando]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Nueva Reserva",
      children: <NewReservation />,
    },
    {
      key: "2",
      label: "Mis Reservas",
      children: <CheckoutReservation />,
    },
    {
      key: "3",
      label: "todas las reservas",
      children: <AllReservationWhitConfirm />,
    },
  ];

  return (
    <div>
      <div className="flex justify-end m-4">
        <Button color="danger" variant="filled" onClick={cerrarSesion}>
          Cerrar Sesión
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-center my-4 uppercase text-[#EEEEEE]">
        Sistema De Reservas
      </h1>
      <div className="flex justify-center mb-3">
        <img src="/images/colombofrances_logo.jpeg" alt="" className="w-60" />
      </div>
      <div>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="large"
          items={items}
          className="text-white"
        />
      </div>
    </div>
  );
};

export default UserReservation;
