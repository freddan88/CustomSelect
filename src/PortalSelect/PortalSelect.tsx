import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  RefObject,
  ChangeEvent,
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
  const [searchedOptions, setSearchedOptions] = useState<IOption[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selected, setSelected] = useState<IOption[]>([]);
  const [menuMargin, setMenuMargin] = useState(MENU_GAP);
  const [isOpen, setIsOpen] = useState(false);

  const selectMenuRef: RefObject<HTMLDivElement> = useRef(null);
  const selectBoxRef: RefObject<HTMLButtonElement> = useRef(null);
  const selectOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelectListSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const matches = options.filter((option) => {
      const regex = new RegExp(`^${query}`, "gi");
      return option.label.match(regex);
    });
    setSearchedOptions(matches);
  };

  const handleSelect = (checked: boolean, option: IOption) => {
    if (multiple) {
      setSelected((prevValues) => {
        if (checked) {
          return prevValues.filter((obj) => obj.label !== option.label);
        }
        return [...prevValues, option];
      });
    } else {
      setSelected([option]);
    }
    if (stayOpen) return;
    if (selectBoxRef.current) {
      selectBoxRef.current.focus();
    }
    setIsOpen(false);
  };

  const handleSelectBoxClick = () => {
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
    searchedOptions,
    selectBoxRef,
    handleSelect,
    searchable,
    setIsOpen,
    selected
  );

  const renderSelectedLabel = () => {
    if (selected.length > 0) {
      if (multiple)
        return (
          <ul className={styles.multiSelectBadges}>
            {selected.map((obj) => (
              <li
                key={obj.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(true, obj);
                }}
              >
                {obj.label}
              </li>
            ))}
          </ul>
        );
      return <span style={{ userSelect: "none" }}>{selected[0].label}</span>;
    }
    return <span className={styles.placeholder}>{placeholder}</span>;
  };

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
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectBoxPositions && selectMenuRef.current) {
      const menuHeight = selectMenuRef.current.clientHeight;
      const boxOffset = selectBoxPositions.bottom;
      const browserHeight = window.innerHeight;
      const positionCondition = menuHeight + MENU_GAP;
      if (browserHeight - boxOffset < positionCondition) {
        const boxHeight = selectBoxPositions.height;
        const menuMargin = menuHeight + boxHeight + MENU_GAP + 2;
        setMenuMargin(-menuMargin);
      } else {
        setMenuMargin(MENU_GAP);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      const newSelections = searchedOptions.filter((option) =>
        value.includes(option.value)
      );
      setSelected(newSelections);
    } else {
      const index = searchedOptions.findIndex(
        (option) => option.value === value
      );
      if (index > 0) {
        setSelected([searchedOptions[index]]);
      }
    }
  }, []);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <button
        id={name}
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
                onChange={handleSelectListSearch}
              />
            </div>
          )}
          <ul className={styles.selectList}>
            {searchedOptions.map((option, index) => {
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
    </div>
  );
};

export default PortalSelect;
