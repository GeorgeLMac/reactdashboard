import React, { useState } from "react";

import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import AuthService from "../../services/Auth.service";

const Hidrometro = () => {
  const initialState = {
    number: "",
    desc: "",
    model: "",
    status: "S",
  };

  const user = AuthService.getCurrentUser();



    let checkempresa = null;
    let DS_STATUS = null;
    if(user != null){
      
      DS_STATUS = user.user.DS_STATUS
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    

    }
    }

  const statusArray = [
    // { id: "S", status: "Selecione..." },
    { id: "S", status: "Ativo" },
    { id: "N", status: "Inativo" },
  ];

  const [search, setSearch] = useState(initialState);
  const [values, setValues] = useState([]);
  const [showList, setShowList] = useState(false);

  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!search.number && !search.desc && !search.model && !search.status) {
      Swal.fire({
        icon: "warning",
        text: "Preencha ao menos um campo para fazer uma pesquisa",
      });
      return;
    }

    if (!search.number && (search.desc || search.model) && !search.status) {
      Swal.fire({
        icon: "warning",
        text: "Preencha o campo Status para fazer uma pesquisa ",
      });
      return;
    }

    let body = {
      NR_MEDIDOR: search.number,
      DS_DESCRICAO_MEDIDOR: search.desc,
      DS_MODELO_MEDIDOR: search.model,
      TP_ATIVO: search.status,
      OID_EMPRESA: checkempresa,
    };

    api
      .post("/hydrometers/filter/todos", body)
      .then((response) => {
        let arr = formatArray(response.data);
        if (arr.length === 0) {
          Swal.fire({
            icon: "warning",
            text: "Nenhum resultado encontrado, refaça a sua busca!",
          });
          setShowList(false);
        } else {
          Swal.fire({
            icon: "success",
            timer: 500,
          });
          arr.map((elem) => {
            if (elem.status === "S") {
              elem.status = "Ativo";
            }
            if (elem.status === "N") {
              elem.status = "Inativo";
            }
          });

          console.log(arr);
          setValues(arr);
          setSearch(initialState);
          setShowList(true);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "warning",
          text: "Erro Tente Novamente!",
        });
        setShowList(false);
      });
  };

  const formatArray = (data) => {
    let arr = [];
    data.map((elem) => {
      arr.push({
        id: elem.OID_MEDIDOR,
        number: elem.NR_MEDIDOR,
        desc: elem.DS_DESCRICAO_MEDIDOR,
        model: elem.DS_MODELO_MEDIDOR,
        consumption: elem.NR_CONSUMO_LITROS,
        status: elem.TP_ATIVO,
      });
    });
    return arr;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Pesquisa | Medidor</label>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row" style={{ textAlign: "end" }}>
              <div className="col-6" style={{ textAlign: "start" }}>
                <Input
                  id="fab-search"
                  label="Número Medidor"
                  value={search.number}
                  onChange={onChangeHandler("number")}
                  styles={{ width: "100%" }}
                />
              </div>
              
              <div className="col-6" style={{ alignSelf: "center" }}>
                <Button
                  icon="ti-agenda"
                  text="Cadastrar"
                  link="/cadastro/hidrometro-cadastro"
                />
              </div>
            
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="desc"
                  label="Descrição"
                  value={search.desc}
                  onChange={onChangeHandler("desc")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="model"
                  label="Modelo"
                  value={search.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="fab-search"
                  label="Status"
                  type="select"
                  options={[statusArray, "status"]}
                  value={search.status}
                  onChange={onChangeHandler("status")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <Button
                  icon="ti-search"
                  text="Pesquisar"
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
            "Número Medidor",
            "Descrição",
            "Modelo",
            "Consumo",
            "Status",
            "",
          ]}
          tableBody={[values, 1]}
          showTable={showList}
        >
          {values?.map((maker, key) => (
            <td key={key}>
              <Link
                type="button"
                to={`/cadastro/hidrometro-update/${maker.id}`}
                color="link"
                size="sm"
                className="btn-light waves-effect waves-light"
              >
                <i className="dripicons-document-edit" />
              </Link>
            </td>
          ))}
        </SearchTable>
      </div>
    </React.Fragment>
  );
};

export default Hidrometro;
