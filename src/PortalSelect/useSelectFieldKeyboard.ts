import { Dispatch, KeyboardEvent, SetStateAction } from "react";

let index = 0;

export default function useSelectFieldKeyboard(
  setHighlightedIndex: Dispatch<SetStateAction<number>>,
  selectOptionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  selectBoxRef: React.RefObject<HTMLButtonElement>,
  setIsOpen: Dispatch<SetStateAction<boolean>>
) {
  const handleKeyboard = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target instanceof HTMLInputElement) return;
    switch (e.code) {
      case "Tab":
      case "Escape":
      case "Backspace": {
        if (selectBoxRef.current) {
          selectBoxRef.current.focus();
          setIsOpen(false);
        }
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
