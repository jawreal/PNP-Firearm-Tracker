import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";

const FormFooter = () => {
  return (
    <Fragment>
      <Separator className="bg-gray-300 dark:bg-gray-400" />
      <div className="flex text-xs text-gray-400 flex-col pt-1">
        <span>
          San Jose Del Monte City Police Station · Logistics Department
        </span>
        <span>
          Authorized personnel only. All access is monitored and logged.
        </span>
      </div>
    </Fragment>
  );
};

export default FormFooter;
