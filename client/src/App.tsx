import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddFireArm from "@/components/custom/AddFireArm";

const App = () => {
  const [openFireArm, setOpenFireArm] = useState<boolean>(false);

  const onAdd = () => {
    setOpenFireArm((open) => !open);
  };

  return (
    <div>
      <Button onClick={onAdd}>Add Firearm</Button>
      <AddFireArm open={openFireArm} onOpenChange={setOpenFireArm} />
    </div>
  );
};

export default App;
