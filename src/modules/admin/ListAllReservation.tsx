import { Modal, Tag } from "antd";
import { useReservas } from "../../hooks/useReservation";
import { IReserva } from "../../interfaces/IReservas";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const ListAllReservation = () => {
  const [id, setId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isLoading, isError, reservas, confirmarReserva } = useReservas();

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar las reservas</div>;

  const handleClick = (id: string, estado: string) => {
    if (estado === "pendiente") {
      setId(id);
      setIsModalOpen(true);
    }
  };

  const handleOk = () => {
    confirmarReserva(id);
    setIsModalOpen(false);
    setId("");
    toast.success("Reserva confirmada con éxito");
    queryClient.invalidateQueries({ queryKey: ["todasLasReservas"] });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setId("");
  };

  return (
    <div className="flex justify-center gap-2 p-4 w-full">
      <div className="w-full lg:w-[800px]">
        {reservas?.map((reserva: IReserva) => (
          <div
            className="flex flex-col gap-2 p-4 shadow-custom mb-5 rounded-lg max-w-xl bg-white"
            key={reserva.id}
          >
            <Tag
              className="cursor-pointer"
              bordered={false}
              color={
                reserva.estado === "pendiente"
                  ? "warning"
                  : reserva.estado === "confirmada"
                  ? "success"
                  : "error"
              }
              onClick={() => handleClick(reserva.id, reserva?.estado || "")}
            >
              <p className="text-xl capitalize font-semibold">
                {reserva.estado}
              </p>
            </Tag>
            <h2 className="text-xl font-bold capitalize"> {reserva.nombre}</h2>
            <p className="text-gray-500 capitalize font-semibold">
              {reserva.materia}
            </p>
            <p className="text-gray-500 capitalize">
              <strong>fecha: </strong> {reserva.dia}
            </p>
            <div className="flex">
              <p className="mr-1">
                <strong>hora: </strong>
              </p>
              <p className="text-gray-500 capitalize mr-1">
                {reserva.horaInicio}
              </p>{" "}
              -
              <p className="text-gray-500 capitalize ml-1">{reserva.horaFin}</p>
            </div>
          </div>
        ))}
      </div>
      <Modal
        title="Confirmar Reserva?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h2>Estas seguro de confirmar esta reserva?</h2>
      </Modal>
    </div>
  );
};

export default ListAllReservation;
