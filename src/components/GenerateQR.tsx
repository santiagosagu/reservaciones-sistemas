import { QRCode } from "antd";

const GenerateQR = ({ id }: { id: string }) => {
  return (
    <div className="flex justify-center">
      <QRCode value={id} size={200} />
    </div>
  );
};

export default GenerateQR;
