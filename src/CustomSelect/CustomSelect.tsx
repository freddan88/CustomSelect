import React, { useState, useRef, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import "./CustomSelect.css";

interface IData {
  label: string;
  value: any;
}

interface IProps {
  data: IData[];
}

const CustomSelect: React.FC<IProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownLabel, setDropdownLabel] = useState<string>("Select value");
  const [dropdownValue, setDropdownValue] = useState<any>();
  const dropdownHeaderRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const dropdownHeadClass = dropdownOpen ? "open" : "";

  useEffect(() => {
    window.addEventListener("mousedown", handleBlurClose);
    return () => {
      window.removeEventListener("mousedown", handleBlurClose);
    };
  }, []);

  useEffect(() => {
    if (!dropdownValue) return;
    console.log(dropdownValue);
  }, [dropdownValue]);

  const handleBlurClose = (e: any) => {
    if (!dropdownHeaderRef?.current) return;
    if (!dropdownMenuRef?.current) return;
    if (!e.target) return;

    const headerBox = dropdownHeaderRef.current;
    const searchBar = dropdownMenuRef.current;
    const target = e.target;

    if (headerBox.contains(target) || searchBar.contains(target)) return;
    setDropdownOpen(false);
  };

  const handleSelectedValue = (e: any) => {
    if (e?.target?.dataset?.value) {
      const { label, value } = e.target.dataset;
      setDropdownValue(value);
      setDropdownLabel(label);
      setDropdownOpen(false);
    }
  };

  const toggleDropdownWithKeyboard = (e: any) => {
    if (e && e.keyCode === 13) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const navigateWithKeyboard = (e: any) => {
    if (e?.target?.dataset?.value) {
      const { label, value } = e.target.dataset;
      // Key: Enter
      if (e && e.keyCode === 13) {
        setDropdownValue(value);
        setDropdownLabel(label);
        setDropdownOpen(false);
      }
    }
  };

  const renderDropdownList = () => {
    if (props.data && Array.isArray(props.data)) {
      const { data } = props;
      return data.map((obj, index) => {
        return (
          <li
            key={index}
            className="custom-select-dropdown-item"
            onClick={handleSelectedValue}
            data-label={obj.label}
            data-value={obj.value}
            tabIndex={0}
          >
            {obj.label}
          </li>
        );
      });
    }
  };

  const renderDropdownMenu = () => {
    if (dropdownOpen) {
      return (
        <div
          className="custom-select-dropdown-box"
          aria-labelledby="custom-select-dropdown-head"
          id="custom-select-dropdown-list"
          ref={dropdownMenuRef}
        >
          <input autoFocus type="search" placeholder="Search" />
          <ul
            onKeyDown={navigateWithKeyboard}
            className="custom-select-dropdown-list"
          >
            {renderDropdownList()}
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="custom-select-dropdown">
      <div
        role="combobox"
        aria-expanded="false"
        className={`custom-select-dropdown-head ${dropdownHeadClass}`}
        aria-controls="custom-select-dropdown-list"
        id="custom-select-dropdown-head"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onKeyDown={toggleDropdownWithKeyboard}
        ref={dropdownHeaderRef}
        tabIndex={0}
      >
        <span>{dropdownLabel}</span>
        <BiChevronDown />
      </div>
      {renderDropdownMenu()}
    </div>
  );
};

export default CustomSelect;
