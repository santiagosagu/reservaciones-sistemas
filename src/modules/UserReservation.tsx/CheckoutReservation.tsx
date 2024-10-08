import { Tag } from "antd";
import { useReservas } from "../../hooks/useReservation";
import { IReserva } from "../../interfaces/IReservas";
// import GenerateQR from "../../components/GenerateQR";

const CheckoutReservation = () => {
  const { isLoading, isError, reservas } = useReservas();

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
      <div></div>
    </div>
  );
};

export default CheckoutReservation;
