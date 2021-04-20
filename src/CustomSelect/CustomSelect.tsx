import React, { useState, useRef, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import "./CustomSelect.css";

interface IData {
  label: string;
  value: any;
}

interface IProps {
  initialData?: IData;
  data: IData[];
}

const CustomSelect: React.FC<IProps> = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownLabel, setDropdownLabel] = useState<string>("Select value");

  const dropdownHeaderRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  const dropdownHeadClass = dropdownOpen ? "open" : "";

  useEffect(() => {
    return () => {
      window.removeEventListener("mousedown", handleBlurClose);
    };
  }, []);

  useEffect(() => {
    if (props.initialData && typeof props.initialData === "object") {
      const { label } = props.initialData;
      setDropdownLabel(label);
    }
  }, [props.initialData]);

  useEffect(() => {
    if (dropdownOpen) {
      window.addEventListener("mousedown", handleBlurClose);
    } else {
      window.removeEventListener("mousedown", handleBlurClose);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownLabel) return;
    const obj = props.data.find((obj: any) => obj.label === dropdownLabel);
    if (obj && obj.hasOwnProperty("value")) {
      console.log(obj.value);
    }
  }, [dropdownLabel, props.data]);

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
    if (e?.target?.dataset?.label) {
      const { label } = e.target.dataset;
      setDropdownLabel(label);
      setDropdownOpen(false);
    }
  };

  const toggleDropdownWithKeyboard = (e: any) => {
    if (e && e.keyCode === 13) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const selectWithKeyboard = (e: any) => {
    if (e?.target?.dataset?.label) {
      const { label } = e.target.dataset;
      // Key: Enter
      if (e && e.keyCode === 13) {
        setDropdownLabel(label);
        setDropdownOpen(false);
      }
    }
  };

  const renderDropdownList = () => {
    if (props.data && Array.isArray(props.data)) {
      const { data } = props;
      return data.map((obj, index) => {
        let activeClass = "";
        if (obj.label === dropdownLabel) {
          activeClass = "active";
        }
        return (
          <li
            key={index}
            tabIndex={0}
            data-label={obj.label}
            className={`custom-select-dropdown-item ${activeClass}`}
            onClick={handleSelectedValue}
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
            onKeyDown={selectWithKeyboard}
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
