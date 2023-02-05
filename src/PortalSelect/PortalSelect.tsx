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

interface IMultiSelect {
  multiple: true;
  value?: (string | number)[];
}

interface ISingleSelect {
  multiple?: false;
  value?: string | number;
}

export interface IOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export type TProps = {
  name: string;
  options: IOption[];
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  stayOpen?: boolean;
} & (ISingleSelect | IMultiSelect);

export let selectBoxPositions: DOMRect | undefined;

const MENU_GAP = 4; // Gap between selectBox and selectMenu in px

const PortalSelect: React.FC<TProps> = ({
  name,
  options,
  placeholder = "",
  value = undefined,
  label = undefined,
  stayOpen = false,
  disabled = false,
  multiple = false,
  searchable = false,
}) => {
  const [searchedOptions, setSearchedOptions] = useState<IOption[]>();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selected, setSelected] = useState<IOption[]>([]);
  const [menuMargin, setMenuMargin] = useState(MENU_GAP);
  const [isOpen, setIsOpen] = useState(false);

  const selectMenuRef: RefObject<HTMLDivElement> = useRef(null);
  const selectBoxRef: RefObject<HTMLButtonElement> = useRef(null);
  const selectOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const renderSelectedLabel = () => {
    if (selected.length > 0) {
      if (multiple)
        return (
          <div className={styles.multiSelectBadges}>
            {selected.map((obj) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(true, obj);
                }}
              >
                {obj.label}
              </button>
            ))}
          </div>
        );
      return <span style={{ userSelect: "none" }}>{selected[0].label}</span>;
    }
    return <span className={styles.placeholder}>{placeholder}</span>;
  };

  const handleSelect = (checked: boolean, option: IOption) => {
    if (multiple) {
      setSelected((prevValues) => {
        if (checked) {
          return prevValues.filter((obj) => obj.value !== option.value);
        }
        return [...prevValues, option];
      });
    } else {
      setSelected([option]);
    }
    if (stayOpen) return;
    setIsOpen(false);
  };

  const handleSelectBoxClick = (e: MouseEvent<HTMLElement>) => {
    if (selectBoxRef.current) {
      const selectBox = selectBoxRef.current;
      selectBoxPositions = selectBox?.getBoundingClientRect();
      setIsOpen((prevOpen) => !prevOpen);
    }
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

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      const newSelections = options.filter((option) =>
        value.includes(option.value)
      );
      setSelected(newSelections);
    } else {
      const index = options.findIndex((option) => option.value === value);
      if (index > 0) {
        setSelected([options[index]]);
      }
    }
  }, []);

  return (
    <>
      <button
        ref={selectBoxRef}
        className={isOpen ? styles.selectBoxOpen : styles.selectBox}
        onClick={handleSelectBoxClick}
        onKeyDown={handleKeyboard}
      >
        {renderSelectedLabel()}
        <MdUnfoldMore />
      </button>
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
              let isSelected = false;
              if (selected.length > 0) {
                isSelected = Boolean(
                  selected.find((obj) => obj.value === option.value)
                );
              }
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
