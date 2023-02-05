import { Dispatch, KeyboardEvent, RefObject, SetStateAction } from "react";
import { IOption } from "./PortalSelect";

let index = 0;

export default function useSelectFieldKeyboard(
  setHighlightedIndex: Dispatch<SetStateAction<number>>,
  selectOptionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  selectMenuRef: RefObject<HTMLDivElement>,
  handleSelect: (checked: boolean, option: IOption) => void,
  searchable: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  isOpen: boolean
) {
  const handleKeyboard = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target instanceof HTMLInputElement) return;
    switch (e.code) {
      case "Enter":
      case "Space":
      case "NumpadEnter": {
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        if (selectOptionRefs.current) {
          const buttons = selectOptionRefs.current.length - 1;
          if (e.code === "ArrowUp" && index > 0) {
            index = index - 1;
          }
          if (e.code === "ArrowDown" && index < buttons) {
            index = index + 1;
          }
          if (selectOptionRefs.current[index]) {
            const button = selectOptionRefs.current[index] as HTMLButtonElement;
            if (button) button.focus();
          }
          setHighlightedIndex(index);
        }
        break;
      }
      default:
        break;
    }
  };

  return { handleKeyboard };
}
