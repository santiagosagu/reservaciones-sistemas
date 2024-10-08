import { Tag } from "antd";
import { useReservas } from "../../hooks/useReservation";
import { IReserva } from "../../interfaces/IReservas";

const ListAllReservation = () => {
  const { isLoading, isError, data } = useReservas();

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar las reservas</div>;

  return (
    <div className="flex justify-center gap-2 p-4 w-full">
      <div className="w-full lg:w-[800px]">
        {data.todasLasReservas.data?.map((reserva: IReserva) => (
          <div
            className="flex flex-col gap-2 p-4 shadow-custom mb-5 rounded-lg max-w-xl"
            key={reserva.id}
          >
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
      <div></div>
    </div>
  );
};

export default ListAllReservation;
