import React, {
  useState,
  useEffect,
  MouseEvent,
  useRef,
  RefObject,
} from "react";
import style from "./InputFieldSelect.module.css";

interface IOption {
  label: string;
  value: string;
}

interface IProps {
  options: IOption[];
  name: string;
}

const LIST_PARENT_SPACING = 4; // Space in px

const InputFieldSelect: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuDirection, setMenuDirection] = useState<"top" | "bottom">("top");
  const [selected, setSelected] = useState("");

  const selectContainerRef: RefObject<HTMLDivElement> = useRef(null);
  const selectListRef: RefObject<HTMLUListElement> = useRef(null);

  const handleClick = (e: MouseEvent<HTMLLIElement>, value: string) => {
    e.stopPropagation();
    setSelected(value);
  };

  useEffect(() => {
    if (selectContainerRef.current && selectListRef.current) {
      const selectContainer = selectContainerRef.current;
      const selectList = selectListRef.current;
      const offsetFromTop = selectContainer.getBoundingClientRect().bottom;
      const browserHeight = window.innerHeight;
      const selectListHeight = selectList.getBoundingClientRect().height;
      const positionCondition = selectListHeight + LIST_PARENT_SPACING;
      console.log(browserHeight - offsetFromTop);
      console.log(selectListHeight);
      if (browserHeight - offsetFromTop < positionCondition) {
        setMenuDirection("bottom");
      } else {
        setMenuDirection("top");
      }
    }
  }, [isOpen]);

  return (
    <div
      tabIndex={0}
      ref={selectContainerRef}
      className={style.selectContainer}
      onClick={() => setIsOpen((prevValue) => !prevValue)}
      onBlur={() => setIsOpen(false)}
    >
      <div className={style.valueContainer}>{selected}</div>
      <div className={style.selectActions}>
        <button type="button">&times;</button>
      </div>
      {isOpen && (
        <ul
          ref={selectListRef}
          className={style.selectList}
          style={{ [menuDirection]: `calc(100% + ${LIST_PARENT_SPACING}px)` }}
        >
          {props.options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <li
                key={option.value}
                onClick={(e) => handleClick(e, option.value)}
              >
                <input
                  type="radio"
                  name={props.name}
                  checked={isSelected}
                  onChange={(e) => console.log("Hej")}
                  style={{ pointerEvents: "none" }}
                />
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default InputFieldSelect;
