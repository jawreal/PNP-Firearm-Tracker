import { Fragment } from "react/jsx-runtime";
import { Separator } from "@/components/ui/separator";

interface IProps {
  showSeparator?: boolean;
}

const FormFooter = ({ showSeparator = true }: IProps) => {
  return (
    <Fragment>
      {showSeparator && (
        <Separator className="bg-gray-300 dark:bg-gray-700/70" />
      )}
      <div className="flex text-xs text-gray-400 dark:text-gray-500 flex-col pt-1">
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
