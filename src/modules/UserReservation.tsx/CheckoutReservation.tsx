import { Modal, Tag } from "antd";
import { useReservas } from "../../hooks/useReservation";
import { IReserva } from "../../interfaces/IReservas";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
// import GenerateQR from "../../components/GenerateQR";

const CheckoutReservation = () => {
  const [id, setId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, isError, reservas, eliminarReserva } = useReservas();

  const handleClick = (id: string, estado: string) => {
    if (estado === "pendiente") {
      setId(id);
      setIsModalOpen(true);
    }
  };

  const handleOk = () => {
    eliminarReserva(id);
    setIsModalOpen(false);
    setId("");
    toast.success("Reserva eliminada con éxito");
    queryClient.invalidateQueries({ queryKey: ["todasLasReservas"] });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setId("");
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar las reservas</div>;

  return (
    <div className="flex justify-center gap-2 p-4 w-full">
      <div className="w-full lg:w-[800px]">
        {reservas?.map((reserva: IReserva) => (
          <div
            className="flex flex-col gap-2 p-4 shadow-custom mb-5 rounded-lg max-w-xl bg-white"
            key={reserva.id}
          >
            {reserva.estado === "pendiente" && (
              <div className="flex justify-end">
                <CancelPresentationIcon
                  className="cursor-pointer"
                  onClick={() => handleClick(reserva.id, reserva?.estado || "")}
                />
              </div>
            )}
            <Tag
              bordered={false}
              color={
                reserva.estado === "pendiente"
                  ? "warning"
                  : reserva.estado === "confirmada"
                  ? "success"
                  : "error"
              }
            >
              <p className="text-xl capitalize font-semibold">
                {reserva.estado}
              </p>
            </Tag>
            <p className="text-gray-500 capitalize">
              <strong>fecha:</strong> {reserva.dia}
            </p>
            <div className="flex">
              <p className="text-gray-500 capitalize mr-1">
                <strong>Hora: </strong>
                {reserva.horaInicio}
              </p>{" "}
              -
              <p className="text-gray-500 capitalize ml-1">{reserva.horaFin}</p>
            </div>
            {/* {reserva.estado === "pendiente" && (
              <Collapse
                items={[
                  {
                    key: "1",
                    label: "Ver QR",
                    children: <GenerateQR id={reserva.id} />,
                  },
                ]}
              />
            )} */}
          </div>
        ))}
      </div>
      <Modal
        title="Confirmar Reserva?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h2>Estas seguro de eliminar esta reserva?</h2>
      </Modal>
    </div>
  );
};

export default CheckoutReservation;
