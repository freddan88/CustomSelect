import React, {
  useState,
  MouseEvent,
  useRef,
  RefObject,
  ChangeEvent,
  MutableRefObject,
} from "react";
import { MdUnfoldMore } from "react-icons/md";
import styles from "./SingleSelectField.module.css";

interface IProps {}

const fieldId = "single-select-field";
const fieldName1 = "single-select-field-name-1";
const fieldName2 = "single-select-field-name-2";

let selectElementPositions = { bottom: 0, left: 0, width: 0 };

const multiSelect = false;

const SingleSelectField: React.FC<IProps> = (props) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const selectTriggerRef: RefObject<HTMLButtonElement> = useRef(null);
  const selectedOptionsRef: MutableRefObject<string[]> = useRef([]);

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
    const { value, checked, name } = inputElement;
    if (multiSelect) {
      selectedOptionsRef.current = checked
        ? [...selectedOptionsRef.current, value]
        : selectedOptionsRef.current.filter((item) => item !== value);
      setSelectedOptions(selectedOptionsRef.current);
      console.log({ name, value: selectedOptionsRef.current });
    } else {
      setSelectedOptions([value]);
      console.log({ name, value });
    }
  };

  return (
    <div style={{ margin: "10px" }}>
      <label htmlFor={fieldId}>Single Select Field</label>
      <button
        type="button"
        id={fieldId}
        className={styles.selectFieldTrigger}
        ref={selectTriggerRef}
        onClick={handleSelectClick}
        onBlur={() => setIsOpen(false)}
      >
        <span style={{ pointerEvents: "none" }}>Selected option</span>
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
            <ul>
              <li>
                <input
                  type={multiSelect ? "checkbox" : "radio"}
                  id={fieldName1}
                  name={fieldName1}
                  value={fieldName1}
                  checked={selectedOptions.includes(fieldName1)}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={handleOptionSelect}
                />
                <label htmlFor={fieldName1}>Option #1</label>
              </li>
              <li>
                <input
                  type={multiSelect ? "checkbox" : "radio"}
                  id={fieldName2}
                  name={fieldName1}
                  value={fieldName2}
                  checked={selectedOptions.includes(fieldName2)}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={handleOptionSelect}
                />
                <label htmlFor={fieldName2}>Option #2</label>
              </li>
            </ul>
          </div>
        )}
      </button>
    </div>
  );
};

export default SingleSelectField;
