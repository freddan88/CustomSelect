import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { IOption } from "./PortalSelect";

let index = 0;

export default function useSelectFieldKeyboard(
  setHighlightedIndex: Dispatch<SetStateAction<number>>,
  selectOptionRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
  searchedOptions: IOption[],
  selectBoxRef: React.RefObject<HTMLButtonElement>,
  handleSelect: (checked: boolean, option: IOption) => void,
  searchable: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  selected: IOption[]
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
            if (button) {
              button.focus();
              button.scrollIntoView();
            }
          }
          setHighlightedIndex(index);
        }
        break;
      }
      default:
        if (!searchable) {
          const regex = new RegExp(`^${e.key}`, "gi");
          const option = searchedOptions.find((option) =>
            option.label.match(regex)
          );
          if (option) {
            const isSelected = Boolean(
              selected.find((obj) => obj.value === option.value)
            );
            handleSelect(isSelected, option);
          }
        }
        break;
    }
  };

  return { handleKeyboard };
}
