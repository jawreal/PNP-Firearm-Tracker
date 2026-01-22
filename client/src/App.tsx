import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddFireArm from "@/components/custom/AddFireArm";
/*import QRCode from "react-qr-code";

const firearmRecord = {
  firstName: "John",
  lastName: "Doe",
  serialNumber: "BR-99021-X",
  fireArmType: "Glock 17",
  station: "North District",
  department: "Patrol",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};*/

const App = () => {
  const [openFireArm, setOpenFireArm] = useState<boolean>(false);

  const onAdd = () => {
    setOpenFireArm((open) => !open);
  };

  return (
    <div>
      <Button onClick={onAdd}>Add Firearm</Button>
      <AddFireArm open={openFireArm} onOpenChange={setOpenFireArm} />
      {/*<div className="flex flex-col items-center gap-4 p-6">
        <h2 className="text-lg font-semibold">Firearm QR Code</h2>
        <QRCode
          value={JSON.stringify(firearmRecord)}
          size={180}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>*/}
    </div>
  );
};

export default App;
