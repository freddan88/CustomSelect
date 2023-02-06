import React, { useState, useEffect, ReactNode } from "react";

interface IProps {
  dropdownComponent: ReactNode;
  renderTriggerContent: () => JSX.Element;
}

const DropdownBase = ({ dropdownComponent, renderTriggerContent }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button>{renderTriggerContent}</button>
      <div>{dropdownComponent}</div>
    </>
  );
};

export default DropdownBase;
