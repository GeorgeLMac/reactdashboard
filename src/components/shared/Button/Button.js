import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  const styles = {
    minHeight: "2.5rem",
    width: "6rem",
    backgroundColor: props.primaryColor ? props.primaryColor : "#4eadc0",
    border: "0px",
    borderRadius: "10px",
    color: "white",
    ...props.styles,
  };

  const mouseHover = (prop) => (event) => {
    let primary = props.primaryColor ? props.primaryColor : "#4eadc0";
    let hover = props.hoverColor ? props.hoverColor : "#5d4ec0";

    if (prop === "enter") event.target.style.background = hover;
    if (prop === "leave") event.target.style.background = primary;
  };

  return (
    <React.Fragment>
      {props.link ? (
        <Link to={props.link}>
          <button
            onMouseEnter={mouseHover("enter")}
            onMouseLeave={mouseHover("leave")}
            style={styles}
          >
            {props.text}
            <i id="component-icon" className={`${props.icon}`} style={{float: props.iconPosition}}/>
          </button>
        </Link>
      ) : (
        <button
          onMouseEnter={mouseHover("enter")}
          onMouseLeave={mouseHover("leave")}
          onClick={props.action}
          style={styles}
        >
          {props.text}
          {props.icon !== "none" && <i id="component-icon" className={`${props.icon}`} />}
        </button>
      )}
    </React.Fragment>
  );
};

Button.propTypes = {
  primaryColor: PropTypes.any,
  styles: PropTypes.any,
  hoverColor: PropTypes.any,
  link: PropTypes.any,
  text: PropTypes.any,
  icon: PropTypes.any,
  iconPosition: PropTypes.any,
  action: PropTypes.any,
};

export default Button;
