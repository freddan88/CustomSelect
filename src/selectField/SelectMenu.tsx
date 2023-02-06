import React, { useState, useEffect } from "react";

interface IProps {}

const SelectMenu: React.FC<IProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <div>
        <input type="search" />
      </div>
      <ul>
        <li>
          <button tabIndex={-1}></button>
        </li>
      </ul>
    </>
  );
};

export default SelectMenu;
