import React, {
  useState,
  useEffect,
  MouseEvent,
  useCallback,
  useRef,
  RefObject,
} from "react";
import styles from "./portalSelect.module.css";
import { MdUnfoldMore } from "react-icons/md";

interface IOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface IProps {
  name: string;
  options: IOption[];
  label?: string;
  value?: string | number;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
}

export let selectBoxPositions: DOMRect | undefined;

const MENU_GAP = 4; // Gap beetwen selectBox and selectMenu in px

const PortalSelect: React.FC<IProps> = ({
  name,
  options,
  value = "",
  placeholder = "",
  label = undefined,
  disabled = false,
  multiple = false,
  searchable = false,
}) => {
  const [searchedOptions, setSearchedOptions] = useState<IOption[]>();
  const [selectedOption, setSelectedOption] = useState<IOption>();
  const [menuMargin, setMenuMargin] = useState(MENU_GAP);
  const [isOpen, setIsOpen] = useState(false);

  const selectMenuRef: RefObject<HTMLDivElement> = useRef(null);

  const renderSelectedLabel = () => {
    if (selectedOption) {
      if (multiple) return <div>Multiple</div>;
      return <span></span>;
    }
    return <span className={styles.placeholder}>{placeholder}</span>;
  };

  const handleSelectBoxClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const clickedElement = e.target as HTMLElement;
    const selectBox = clickedElement.closest("div");
    selectBoxPositions = selectBox?.getBoundingClientRect();
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleCloseOutside = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleCloseOutside);
    } else {
      window.removeEventListener("click", handleCloseOutside);
    }
  }, [isOpen, handleCloseOutside]);

  useEffect(() => {
    if (isOpen && selectBoxPositions && selectMenuRef.current) {
      const boxHeight = selectBoxPositions.height;
      const menuHeight = selectMenuRef.current.clientHeight;
      const menuMargin = menuHeight + boxHeight + MENU_GAP;
      // setMenuMargin(-menuMargin);
      // setMenuMargin(MENU_GAP);
    }
  }, [isOpen]);

  return (
    <>
      <div
        tabIndex={0}
        className={isOpen ? styles.selectBoxOpen : styles.selectBox}
        onClick={handleSelectBoxClick}
      >
        {renderSelectedLabel()}
        <MdUnfoldMore />
      </div>
      {isOpen && selectBoxPositions && (
        <div
          onClickCapture={(e) => e.stopPropagation()}
          className={styles.selectMenu}
          ref={selectMenuRef}
          style={{
            marginTop: menuMargin,
            // top: selectBoxPositions.bottom + MENU_GAP,
            width: selectBoxPositions.width,
            left: selectBoxPositions.left,
          }}
        >
          <div className={styles.searchInputContainer}>
            <input type="search" className={styles.searchInput} />
          </div>
          <ul className={styles.selectList}>
            {options.map((option) => {
              return (
                <li key={option.value}>
                  <label>
                    <input
                      type="radio"
                      name={name}
                      disabled={option.disabled}
                      style={{ display: "none" }}
                    />
                    {option.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default PortalSelect;
