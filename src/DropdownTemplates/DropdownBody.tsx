import { useEffect, ReactNode } from "react";

interface IProps {
  width?: number;
  children: ReactNode;
  headerPositions: DOMRect;
}

const DropdownBody = ({ children, headerPositions, width }: IProps) => {
  useEffect(() => {
    console.log(headerPositions);
  }, [headerPositions]);

  const containerWidth = width === undefined ? headerPositions.width : width;

  return (
    <div
      style={{
        position: "fixed",
        width: containerWidth,
        left: headerPositions.left,
      }}
    >
      {children}
    </div>
  );
};

export default DropdownBody;
