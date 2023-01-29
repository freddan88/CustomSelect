import React, {
  useState,
  MouseEvent,
  FocusEvent,
  useRef,
  RefObject,
  ChangeEvent,
  MutableRefObject,
} from "react";
import { MdUnfoldMore } from "react-icons/md";
import styles from "./SingleSelectField.module.css";

interface IValue<T> {
  name: string;
  value: T;
}

interface IOption {
  label: string;
  value: string;
  disabled?: boolean;
}

type TSingleSelect = {
  isMulti?: never;
  value?: string;
};

type TMultiSelect = {
  isMulti: true;
  value?: string[];
};

type TProps = {
  name: string;
  label: string;
  options: IOption[];
  onChange: (value: IValue<string[] | string>) => void;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
} & (TSingleSelect | TMultiSelect);

let selectElementPositions = { bottom: 0, left: 0, width: 0 };

const SingleSelectField: React.FC<TProps> = ({
  name,
  label,
  options,
  onChange,
  value,
  placeholder,
  isSearchable,
  disabled,
  isMulti,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchInputRef: RefObject<HTMLInputElement> = useRef(null);
  const selectTriggerRef: RefObject<HTMLButtonElement> = useRef(null);
  const selectedOptionsRef: MutableRefObject<string[]> = useRef([]);

  const fieldId = `select-field-${name}`.toLowerCase();

  const handleSelectClick = (e: MouseEvent<HTMLButtonElement>) => {
    const selectButton = e.target as HTMLElement;
    if (!isOpen && selectButton === selectTriggerRef.current) {
      selectElementPositions = selectButton.getBoundingClientRect();
      setIsOpen(true);
    } else {
      if (selectButton === selectTriggerRef.current) setIsOpen(false);
    }
  };

  const handleOptionSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    const { value: inputValue, name: inputName, checked } = inputElement;
    if (isMulti) {
      selectedOptionsRef.current = checked
        ? [...selectedOptionsRef.current, inputValue]
        : selectedOptionsRef.current.filter((item) => item !== inputValue);
      setSelectedOptions(selectedOptionsRef.current);
      onChange({ name: inputName, value: selectedOptionsRef.current });
    } else {
      setSelectedOptions([inputValue]);
      onChange({ name: inputName, value: inputValue });
    }
  };

  const handleInputsBlur = (e: FocusEvent) => {
    e.stopPropagation();
    const relatedElement = e.relatedTarget as HTMLElement;
    if (relatedElement === searchInputRef.current) return;
    if (relatedElement) return;
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    if (isMulti) {
      return selectedOptions.length > 0
        ? options.map((option) => {
            return selectedOptions.find((item) => item === option.value);
          })
        : placeholder;
    }
    return selectedOptions.length > 0
      ? options.find((obj) => obj.value === selectedOptions[0])?.label
      : placeholder;
  };

  return (
    <div style={{ margin: "10px" }}>
      <label htmlFor={fieldId}>{label}</label>
      <button
        type="button"
        id={fieldId}
        style={{ borderColor: isOpen ? "blue" : "#cccccc" }}
        className={styles.selectFieldTrigger}
        ref={selectTriggerRef}
        onClick={handleSelectClick}
        disabled={disabled}
        onBlur={handleInputsBlur}
      >
        <span style={{ pointerEvents: "none" }}>{getSelectedLabel()}</span>
        <MdUnfoldMore style={{ pointerEvents: "none" }} size={20} />
        {isOpen && (
          <div
            style={{
              top: selectElementPositions.bottom,
              left: selectElementPositions.left,
              minWidth: selectElementPositions.width,
            }}
            className={styles.selectFieldMenu}
          >
            <div style={{ padding: "8px", paddingBottom: 0 }}>
              <input
                type="search"
                ref={searchInputRef}
                style={{ width: "100%", marginTop: "8px" }}
                onFocus={(e) => e.stopPropagation()}
                onBlur={handleInputsBlur}
              />
              {/* Search using regex: https://www.youtube.com/watch?v=1iysNUrI3lw */}
            </div>
            <ul>
              {options.map((option) => {
                return (
                  <li key={option.value}>
                    <input
                      type={isMulti ? "checkbox" : "radio"}
                      id={option.value}
                      name={name}
                      value={option.value}
                      data-label={option.label}
                      checked={selectedOptions.includes(option.value)}
                      onFocus={(e) => e.stopPropagation()}
                      onBlur={(e) => e.stopPropagation()}
                      onChange={handleOptionSelect}
                      disabled={option.disabled}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </button>
    </div>
  );
};

export default SingleSelectField;
