import { useState, useEffect } from "react";
import DropdownBase from "./DropdownBase";
import SelectMenu from "./SelectMenu";

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

const SelectField = ({ multiple, placeholder }: TProps) => {
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);

  const handleSelect = (selectedOption: IOption) => {
    console.log(selectedOption);
  };

  const renderSelectedLabel = () => {
    if (selectedOptions.length > 0) {
      if (multiple) {
        return (
          <ul>
            {selectedOptions.map((option) => (
              <li
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        );
      }
      return <span>{selectedOptions[0].label}</span>;
    }
    return <span>{placeholder}</span>;
  };

  useEffect(() => {
    // Documentation hooks as lifecycle-methods:
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
  }, []);

  return (
    <DropdownBase
      dropdownComponent={SelectMenu}
      renderTriggerContent={renderSelectedLabel}
    />
  );
};

export default SelectField;
