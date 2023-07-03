import React, { useState, useEffect } from "react";

import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AcoesEquipamento = () => {
  const initialState = {
    maker: "",
    desc: "",
    model: "",
    number: "",
  };

  const [search, setSearch] = useState(initialState);
  const [makers, setMakers] = useState([]);
  const [showList, setShowList] = useState(false);
  const [values, setValues] = useState([]);

  const fetchMakers = () => {
    let maker = [{ id: "", maker: "Selecione..." }];
    api
      .get("/makerslora")
      .then((response) => {
        response.data.map((elem) => {
          maker.push({
            id: elem.OID_FABRICANTE_LORA,
            maker: elem.DS_FABRICANTE_LORA,
          });
        });
        setMakers(maker);
      })
      .then(() => {
        setSearch({ ...search, maker: maker[0].id });
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let body = {
      OID_FABRICANTE_LORA: search.maker,
      DS_DESCRICAO_EQUIPAMENTO: search.desc,
      DS_MODELO_EQUIPAMENTO: search.model,
      NR_EQUIPAMENTO: search.number,
    };

    api
      .post("/equipmentslora/filter", body)
      .then((response) => {
        const arr = formatArray(response.data);
        if (arr.length === 0) {
          Swal.fire({
            icon: "warning",
            text: "Nenhum resultado encontrado, refaça a sua busca!",
          });
          setShowList(false);
          return;
        } else {
          Swal.fire({
            icon: "success",
            timer: 500,
          });
          setValues(arr);
          setSearch(initialState);
          setShowList(true);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "warning",
          text: "Verifique os dados e refaça a pesquisa",
        });
        setShowList(false);
      });
  };

  const formatArray = (data) => {
    let array = [];
    makers?.map((maker) => {
      data.map((elem) => {
        if (elem.OID_FABRICANTE_LORA === maker.id) {
          array.push({
            id: elem.OID_EQUIPAMENTO_LORA,
            makerId: elem.OID_FABRICANTE_LORA,
            makerName: maker.maker,
            desc: elem.DS_DESCRICAO_EQUIPAMENTO,
            model: elem.DS_MODELO_EQUIPAMENTO,
            number: elem.NR_EQUIPAMENTO,
          });
        }
      });
    });
    return array;
  };

  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
  };

  useEffect(() => {
    fetchMakers();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Pesquisa | Ações Equipamento</label>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row">
              <div className="col-6">
                <Input
                  id="fab-search"
                  label="Fabricante Lora"
                  options={[makers, "maker"]}
                  value={search.maker}
                  type="select"
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="desc"
                  label="Descição Equipamento"
                  value={search.desc}
                  onChange={onChangeHandler("desc")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="model"
                  label="Modelo Equipamento"
                  value={search.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="number"
                  label="Número Equipamento (MAC ADDRESS)"
                  value={search.number}
                  onChange={onChangeHandler("number")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <Button
                  icon="ti-search"
                  text="Pesquisar"
                  styles={{ marginLeft: "2.5rem" }}
                  action={submitHandler}
                  primaryColor="#5d4ec0"
                  hoverColor="#4eadc0"
                />
              </div>
            </div>
          </div>
        </form>
        <SearchTable
          tableHead={[
            "Fabricante Lora",
            "Descrição Equipamento",
            "Modelo Equipamento",
            "Número Equipamento",
            "",
          ]}
          showTable={showList}
          tableBody={[values, 2]}
        >
          {values?.map((elem, key) => (
            <td key={key}>
              <Link
                type="button"
                to={`/configuracao/acoesequipamentos-update/${elem.number}/2`}
                color="link"
                size="sm"
                className="btn btn-light waves-effect waves-light"
              >
                <i className="dripicons-cloud-upload" /> Enviar dados
              </Link>
            </td>
          ))}
        </SearchTable>
      </div>
    </React.Fragment>
  );
};

export default AcoesEquipamento;
