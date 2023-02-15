import { forwardRef, MouseEvent, ReactNode } from "react";

interface IProps {
  children: ReactNode;
  onChildClick: () => void;
}

const DropdownHeader = forwardRef<HTMLDivElement, IProps>(
  ({ children, onChildClick }, headerRef) => {
    const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
      const clickedElement = e.target as HTMLElement;
      const triggerElement = clickedElement.closest("button");
      if (!triggerElement) {
        throw new Error(
          "Child-element for this component needs to be a button"
        );
      }
      onChildClick();
    };

    return (
      <div
        ref={headerRef}
        onClickCapture={handleClickCapture}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>
    );
  }
);

export default DropdownHeader;
