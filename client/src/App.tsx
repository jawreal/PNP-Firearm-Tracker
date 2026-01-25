import { useState } from "react";
import { Button } from "@/components/ui/button";
import RegisterFireArm from "@/components/custom/RegisterFireArm";
import QRCodeDialog from "@/components/custom/QRCodeDialog";

const firearmRecord: IFireArm = {
  firstName: "John",
  lastName: "Doe",
  serialNumber: "BR-99021-X",
  fireArmType: "Glock 17",
  station: "North District",
  department: "Patrol",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const App = () => {
  const [openFireArm, setOpenFireArm] = useState<boolean>(false);

  const onAdd = () => {
    setOpenFireArm((open) => !open);
  };

  return (
    <div>
      <Button onClick={onAdd}>Register Firearm</Button>
      <RegisterFireArm open={openFireArm} onOpenChange={setOpenFireArm} />
      {/*<QRCodeDialog
        open={openFireArm}
        onOpenChange={setOpenFireArm}
        data={firearmRecord}
      />*/} 
    </div>
  );
};

export default App;
