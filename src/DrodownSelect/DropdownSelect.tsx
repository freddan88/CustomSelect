import React, { RefObject, useRef, useState } from "react";
import DropdownBody from "../DropdownTemplates/DropdownBody";
import DropdownHeader from "../DropdownTemplates/DropdownHeader";

interface IProps {
  // options: any[]
  label?: string;
  value?: string | number;
  autoFocus?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

const DropdownSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownHeaderRef: RefObject<HTMLDivElement> = useRef(null);

  const handleToggleOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  return (
    <div style={{ maxWidth: "200px" }}>
      <label htmlFor="test-select-dropdown">test-select-dropdown</label>
      <DropdownHeader onChildClick={handleToggleOpen} ref={dropdownHeaderRef}>
        <button id="test-select-dropdown">
          <span>CLICK ME</span>
        </button>
      </DropdownHeader>
      {isOpen && dropdownHeaderRef.current && (
        <DropdownBody
          headerPositions={dropdownHeaderRef.current.getBoundingClientRect()}
        >
          <ul style={{ padding: 0, margin: 0 }}>
            <li style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="radio"
                tabIndex={-1}
                id="select-dropdown-1"
                name="test-select-dropdown"
                style={{ margin: 0 }}
              />
              <label
                htmlFor="select-dropdown-1"
                style={{ display: "block", flex: 1 }}
              >
                First
              </label>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <input
                type="radio"
                tabIndex={-1}
                id="select-dropdown-2"
                name="test-select-dropdown"
                style={{ margin: 0 }}
              />
              <label
                htmlFor="select-dropdown-2"
                style={{ display: "block", flex: 1 }}
              >
                Second
              </label>
            </li>
          </ul>
        </DropdownBody>
      )}
    </div>
  );
};

export default DropdownSelect;
