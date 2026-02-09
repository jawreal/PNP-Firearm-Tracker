import { memo } from "react";

interface ImageProps {
  url: string | null | undefined;
  className: string;
}

const Image = ({ url, className }: ImageProps) => {
  return <>{url && <img src={url} alt="img" className={className} />}</>;
};

export default memo(Image);
