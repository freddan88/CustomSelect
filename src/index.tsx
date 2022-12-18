import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CustomSelect from "./CustomSelect/CustomSelect";
import reportWebVitals from "./reportWebVitals";
import InputFieldSelect from "./inputFields/inputFieldSelect/InputFieldSelect";

const array = [
  {
    label: "Option 1",
    value: { id: 1, name: "Hello" },
  },
  {
    value: 2,
    label: "Option 2",
  },
  {
    value: 3,
    label: "Option 3",
  },
  {
    value: 4,
    label: "Option 4",
  },
];

const initialOption = {
  label: "Option 1",
  value: { id: 1, name: "Hello" },
};

const selectData = [
  {
    label: "DELL",
    value: "dell",
  },
  {
    label: "HP",
    value: "hp",
  },
  {
    label: "ASUS",
    value: "asus",
  },
  {
    label: "ACER",
    value: "acer",
  },
];

ReactDOM.render(
  <React.StrictMode>
    <CustomSelect data={array} initialData={initialOption} />
    <InputFieldSelect options={selectData} name="brands" />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
