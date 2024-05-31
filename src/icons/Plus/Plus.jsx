/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const Plus = ({ color = "black", className }) => {
  return (
    <svg
      className={`plus ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 25 24"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M12.3901 4.19998C12.9286 4.19998 13.3651 4.6365 13.3651 5.17498V18.825C13.3651 19.3635 12.9286 19.8 12.3901 19.8C11.8516 19.8 11.4151 19.3635 11.4151 18.825V5.17498C11.4151 4.6365 11.8516 4.19998 12.3901 4.19998Z"
        fill={color}
        fillRule="evenodd"
      />
      <path
        className="path"
        clipRule="evenodd"
        d="M4.59015 12C4.59015 11.4615 5.02667 11.025 5.56515 11.025H19.2151C19.7536 11.025 20.1901 11.4615 20.1901 12C20.1901 12.5385 19.7536 12.975 19.2151 12.975H5.56515C5.02667 12.975 4.59015 12.5385 4.59015 12Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
};

Plus.propTypes = {
  color: PropTypes.string,
};
