import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Container } from "reactstrap";

import "./SearchTable.css";

const SearchTable = (props) => {
  const [values, setValues] = useState([]);

  const makeTable = () => {
    let temp = [];
    let arr = [];
    props.tableBody[0]?.map((elem) => {
      let keys = Object.keys(elem);
      keys = keys.slice(props.tableBody[1]);
      keys?.map((key) => arr.push(elem[key]));
      temp.push(arr);
      setValues(temp);
      arr = [];
    });
  };

  useEffect(() => {
    makeTable();
  }, [props.tableBody[0]]);

  return (
    <Container fluid>
      <div className="table-responsive">
        <table className="table align-middle table-nowrap mb-0 search-table">
          {props.tableHead && (
            <thead id="search-table-head" className="table-light">
              <tr>
                {props.tableHead?.map((elem) => (
                  <th key={elem} className="align-middle">
                    {elem}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {props.showTable && props.tableBody ? (
            <tbody>
              {values?.map((elem, key) => (
                <tr key={"_tr_" + key}>
                  {elem?.map((elem2) => (
                    <td key={elem2}>{elem2}</td>
                  ))}
                  {props.children ? props.children[key] : ""}
                </tr>
              ))}
            </tbody>
          ) : (
            <></>
          )}
        </table>
        {!props.showTable && (
          <label style={{ display: "flex", justifyContent: "center" }}>
            Faça uma pesquisa para obter os resultados
          </label>
        )}
      </div>
    </Container>
  );
};

SearchTable.propTypes = {
  tableBody: PropTypes.any,
  tableHead: PropTypes.any,
  index: PropTypes.any,
  showTable: PropTypes.any,
  children: PropTypes.any,
};

export default SearchTable;
