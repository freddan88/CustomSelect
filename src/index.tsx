import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CustomSelect from "./CustomSelect/CustomSelect";
import reportWebVitals from "./reportWebVitals";

const array = [
  {
    value: 1,
    label: "hej1",
  },
  {
    value: 2,
    label: "hej2",
  },
];

ReactDOM.render(
  <React.StrictMode>
    <CustomSelect data={array} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
