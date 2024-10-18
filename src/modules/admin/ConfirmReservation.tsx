import { useState } from "react";
import QRScanner from "../../components/QRScanner";
import { Modal } from "antd";
import { useReservas } from "../../hooks/useReservation";
import { toast } from "react-toastify";

const ConfirmReservation = () => {
  const [result, setResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { reservasPorID, confirmarReserva } = useReservas(result);

  const handleScan = (result: string) => {
    setResult(result);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    await confirmarReserva(result);
    setIsModalOpen(false);
    setResult("");
    toast.success("Reserva confirmada con éxito");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setResult("");
  };

  return (
    <div>
      <h2>Confirmar Reservas</h2>
      <QRScanner onScan={handleScan} />
      {reservasPorID && reservasPorID.length > 0 && (
        <Modal
          title="Confirmar Reserva?"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>
            <strong>Docente: </strong> {reservasPorID?.[0].nombre}
          </p>
          <p>
            <strong>Materia: </strong> {reservasPorID?.[0].materia}
          </p>
          <p>
            <strong>Día: </strong> {reservasPorID?.[0].dia}
          </p>
          <p>
            <strong>Hora de inicio: </strong> {reservasPorID?.[0].horaInicio}
          </p>
          <p>
            <strong>Hora de fin: </strong> {reservasPorID?.[0].horaFin}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default ConfirmReservation;
