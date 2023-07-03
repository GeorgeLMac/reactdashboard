import React from "react";
import PropTypes from "prop-types";

import { Input, Label } from 'reactstrap';

import "./Inputs.css";

const Inputs = (props) => {
  const styles = {
    input: {
      width: "100%",
      border: "1px solid #dbdbdb",
      borderRadius: props.icon ? "0px 10px 10px 0px" : "10px",
      height: "2.5rem",
      background: "ti-search",
      paddingLeft: "1rem",
      display: "inline",
      ...props.styles,
    },
    icon: {
      borderRadius: "10px 0px 0px 10px",
      background: "white",
      height: "2.5rem",
      display: "flex",
      alignItems: "center",
      paddingLeft: "0.75rem",
    },
  };

  return (
    <React.Fragment>
      {props.label && (
        <Label
          for={props.id}
          style={{ marginBottom: "0px" }}
        >
          {props.label}
        </Label>
      )}
      {props.icon && (
        <label
          id="input-icon"
          className={`${props.icon}`}
          style={styles.icon}
          onClick={props.action}
        />
      )}
      <Input
        id={props.id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        style={styles.input}
        type={props.type}
        >
          {props.options && props.options[0]?.map( (elem, key) => (
            <option key={key} value={elem.id}>{elem[props.options[1]]}</option>
          ))}
        </Input>
    </React.Fragment>
  );
};

Inputs.propTypes = {
  icon: PropTypes.any,
  styles: PropTypes.any,
  label: PropTypes.any,
  id: PropTypes.any,
  action: PropTypes.any,
  value: PropTypes.any,
  placeholder: PropTypes.any,
  onChange: PropTypes.any,
  options: PropTypes.any,
  type: PropTypes.any,
};

export default Inputs;
