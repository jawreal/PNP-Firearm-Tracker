import { useState } from "react";
import { Button } from "@/components/ui/button";
//import AddFireArm from "@/components/custom/AddFireArm";
import { type IFireArm } from "@/components/custom/QRCodeDialog";
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
      <Button onClick={onAdd}>Add Firearm</Button>
      {/*<AddFireArm open={openFireArm} onOpenChange={setOpenFireArm} />*/}
      <QRCodeDialog
        open={openFireArm}
        onOpenChange={setOpenFireArm}
        data={firearmRecord}
      />
    </div>
  );
};

export default App;
