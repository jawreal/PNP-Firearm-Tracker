import { cn } from "@/lib/utils";
import { Fragment, memo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

interface IProps {
  value: string;
}

const ExpandedDescription = ({ value }: IProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const onExpand = useCallback(() => {
    setExpanded((prev: boolean) => !prev);
  }, []);

  return (
    <Fragment>
      <div className={cn(!expanded && "line-clamp-2")}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            strong: ({ ...props }) => (
              <strong
                {...props}
                className="font-medium text-blue-700 dark:text-blue-600"
              />
            ),
          }}
        >
          {value}
        </ReactMarkdown>
      </div>

      <Button
        variant="ghost"
        onClick={onExpand}
        className="p-0 h-0 text-blue-700 dark:text-blue-400 text-xs right-0 bottom-0 inline-block"
      >
        {expanded ? "See less" : "See more"}
      </Button>
    </Fragment>
  );
};

export default memo(ExpandedDescription);
