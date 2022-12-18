import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import style from "./InputFieldSelect.module.css";

interface IOption {
  label: string;
  value: string;
}

interface IProps {
  options: IOption[];
  name: string;
}

const InputFieldSelect: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState("");

  const handleClick = (e: MouseEvent<HTMLLIElement>, value: string) => {
    e.stopPropagation();
    setSelected(value);
  };

  useEffect(() => {
    // Documentation hooks as lifecycle-methods:
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
  }, [isOpen]);

  return (
    <div
      tabIndex={0}
      className={style.selectContainer}
      onClick={() => setIsOpen((prevValue) => !prevValue)}
      onBlur={() => setIsOpen(false)}
    >
      <div className={style.valueContainer}></div>
      <div className={style.selectActions}>
        <button type="button">&times;</button>
      </div>
      {isOpen && (
        <ul className={style.selectList}>
          {props.options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <li
                key={option.value}
                onClick={(e) => handleClick(e, option.value)}
              >
                <input
                  type="checkbox"
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
