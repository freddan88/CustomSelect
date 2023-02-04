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
import useSelectFieldKeyboard from "./useSelectFieldKeyboard";

export interface IOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface IProps {
  name: string;
  options: IOption[];
  label?: string;
  value?: string | number;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  stayOpen?: boolean;
}

export let selectBoxPositions: DOMRect | undefined;

const MENU_GAP = 4; // Gap beetwen selectBox and selectMenu in px

const PortalSelect: React.FC<IProps> = ({
  name,
  options,
  value = "",
  placeholder = "",
  label = undefined,
  stayOpen = false,
  disabled = false,
  multiple = false,
  searchable = false,
}) => {
  const [searchedOptions, setSearchedOptions] = useState<IOption[]>();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selected, setSelected] = useState<IOption>();
  const [menuMargin, setMenuMargin] = useState(MENU_GAP);
  const [isOpen, setIsOpen] = useState(false);

  const selectMenuRef: RefObject<HTMLDivElement> = useRef(null);
  const selectOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const renderSelectedLabel = () => {
    if (selected) {
      if (multiple) return <div>Multiple</div>;
      return <span style={{ userSelect: "none" }}>{selected.label}</span>;
    }
    return <span className={styles.placeholder}>{placeholder}</span>;
  };

  const handleSelect = (checked: boolean, option: IOption) => {
    if (multiple) {
    } else {
      setSelected(option);
    }
    if (stayOpen) return;
    setIsOpen(false);
  };

  const handleSelectBoxClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const clickedElement = e.target as HTMLElement;
    const selectBox = clickedElement.closest("div");
    selectBoxPositions = selectBox?.getBoundingClientRect();
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleCloseOutside = useCallback((e: globalThis.MouseEvent) => {
    const clickedElement = e.target as HTMLElement;
    if (selectMenuRef.current && clickedElement) {
      if (selectMenuRef.current.contains(clickedElement)) return;
      setIsOpen(false);
    }
  }, []);

  const { handleKeyboard } = useSelectFieldKeyboard(
    setHighlightedIndex,
    selectOptionRefs,
    selectMenuRef,
    handleSelect,
    searchable,
    setIsOpen,
    isOpen
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleCloseOutside);
    } else {
      window.removeEventListener("click", handleCloseOutside);
    }
  }, [isOpen, handleCloseOutside]);

  useEffect(() => {
    if (isOpen && selectOptionRefs.current) {
      const button = selectOptionRefs.current[
        highlightedIndex
      ] as HTMLButtonElement;
      if (button) button.focus();
    }
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    if (isOpen && selectBoxPositions && selectMenuRef.current) {
      const boxHeight = selectBoxPositions.height;
      const menuHeight = selectMenuRef.current.clientHeight;
      const menuMargin = menuHeight + boxHeight + MENU_GAP + 2;
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
        onKeyDown={handleKeyboard}
      >
        {renderSelectedLabel()}
        <MdUnfoldMore />
      </div>
      {isOpen && selectBoxPositions && (
        <div
          onKeyDown={handleKeyboard}
          className={styles.selectMenu}
          ref={selectMenuRef}
          style={{
            marginTop: menuMargin,
            top: selectBoxPositions.bottom,
            width: selectBoxPositions.width,
            left: selectBoxPositions.left,
          }}
        >
          {searchable && (
            <div className={styles.searchInputContainer}>
              <input
                type="search"
                placeholder="Search..."
                className={styles.searchInput}
              />
            </div>
          )}
          <ul className={styles.selectList}>
            {options.map((option, index) => {
              const isSelected = option.value === selected?.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    ref={(ref) => (selectOptionRefs.current[index] = ref)}
                    onClick={() => handleSelect(isSelected, option)}
                    disabled={disabled}
                    name={name}
                    className={
                      isSelected ? styles.optionSelected : styles.option
                    }
                  >
                    {option.label}
                  </button>
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
