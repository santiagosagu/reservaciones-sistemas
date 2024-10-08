import { Button, Tabs, TabsProps } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmReservation from "./ConfirmReservation";
import ListAllReservation from "./ListAllReservation";
import CreateNewUser from "./CreateNewUser";
import { useEffect } from "react";

const AdminModule = () => {
  const { usuario, cerrarSesion, cargando } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario && !cargando) navigate("/login");

    if (usuario?.rol !== "admin" && !cargando) navigate("/");
  }, [usuario, navigate, cargando]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Confirmar Reserva",
      children: <ConfirmReservation />,
    },
    {
      key: "2",
      label: "Ver Reservas",
      children: <ListAllReservation />,
    },
    {
      key: "3",
      label: "Crear Nuevo Usuario",
      children: <CreateNewUser />,
    },
  ];

  return (
    <div>
      <div className="flex justify-end m-4">
        <Button color="danger" variant="filled" onClick={cerrarSesion}>
          Cerrar Sesión
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-center my-4 uppercase">
        Sistema De Reservas
      </h1>
      <div>
        <Tabs defaultActiveKey="1" type="card" size="large" items={items} />
      </div>
    </div>
  );
};

export default AdminModule;
