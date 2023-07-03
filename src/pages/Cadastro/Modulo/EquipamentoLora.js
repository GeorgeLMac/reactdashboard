import React, { useEffect, useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import AuthService from "../../../services/Auth.service";

const EquipamentoLora = () => {
  const initialState = {
    maker: "",
    desc: "",
    model: "",
    number: "",
  };

  const Empresa = {
    OID_EMPRESA: "",
    NM_RAZAO_SOCIAL: "",
   
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

  const [search, setSearch] = useState(initialState);
  const [makers, setMakers] = useState([]);
  const [values, setValues] = useState([]);

  const [showList, setShowList] = useState(false);
  let [lc, setLc] = useState (Empresa);
  const [condos, setCondo] = useState([]);

  const fetchCondo = () => {
    let condo = [{ id: "",  condo: "Selecione..." }];
    api.get("/empresa/").then((response) => {
      response.data.map((elem) => {
        condo.push({
          id: elem.OID_EMPRESA,
          condo: elem.NM_RAZAO_SOCIAL,
          
        });
      });
      setCondo(condo);
    });
  };

  if(DS_STATUS == 10){
    useEffect(() => {
      fetchCondo();
    }, []);
  }

  const onChangeCondo = (prop) => (event) => {
    
    setLc({ ...lc, [prop]: event.target.value});
    
  };



  const fetchMakers = () => {
    let maker = [{ id: "", maker: "Selecione..." }];
    api.get("/makerslora").then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_FABRICANTE_LORA,
          maker: elem.DS_FABRICANTE_LORA,
        });
      });
      setMakers(maker);
    });
  };

  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
    console.log(search.maker)
  };

  const submitHandler = (event) => {

    if(lc.condo){
      checkempresa = lc.condo;
    }

    event.preventDefault();
    let body = {
      OID_FABRICANTE_LORA: search.maker,
      DS_DESCRICAO_EQUIPAMENTO: search.desc,
      DS_MODELO_EQUIPAMENTO: search.model,
      NR_EQUIPAMENTO: search.number,
      OID_EMPRESA: checkempresa,
    };

    api
      .post("/equipmentslora/filter", body)
      .then((response) => {
        let arr = response.data;
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
          setValues(formatArray(arr));
          setSearch(initialState);
          setShowList(true);
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "warning",
          text: "Preencha ao menos UM campo para realizar a busca",
        });
        setShowList(false);
      });
  };

  const formatArray = (data) => {
    let aux = [];
    makers.map((maker) => {
      data.map((elem2) => {
        if (maker.id === elem2.OID_FABRICANTE_LORA) {
          aux.push({
            id: elem2.OID_EQUIPAMENTO_LORA,
            makerId: maker.id,
            maker: maker.maker,
            desc: elem2.DS_DESCRICAO_EQUIPAMENTO,
            model: elem2.DS_MODELO_EQUIPAMENTO,
            number: elem2.NR_EQUIPAMENTO,
          });
        }
      });
    });
    return aux;
  };

  useEffect(() => {
    fetchMakers();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Pesquisa | Módulos Lora</label>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
          {DS_STATUS == 10?
            <div className="row">
              <div className="col-6">
                <Input
                  id="fab-register"
                  label="Condomínio"
                  type="select"
                  options={[condos, "condo"]}
                  value={lc.condo}
                  onChange={onChangeCondo("condo")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
               : null  }
            <div className="row" style={{ textAlign: "end" }}>
              <div className="col-6" style={{ textAlign: "start" }}>
                <Input
                  id="fab-search"
                  label="Fabricante Lora"
                  options={[makers, "maker"]}
                  value={search.maker}
                  type="select"
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
              {DS_STATUS == 10 ?
              <div className="col-6" style={{ alignSelf: "center" }}>
                <Button
                  icon="ti-agenda"
                  text="Cadastrar"
                  link="/cadastro/modulo/equipamentolora-cadastro"
                />
              </div>
                : null} 
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="desc"
                  label="Descrição do Módulo"
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
                  label="Modelo do Módulo"
                  value={search.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="number"
                  label="Numero do Módulo (MAC ADDRESS)"
                  value={search.number}
                  onChange={onChangeHandler("number")}
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
            "Fabricante Lora",
            "Descrição do Módulo",
            "Modelo Módulo",
            "Número Módulo",
            "",
          ]}
          tableBody={[values, 2]}
          showTable={showList}
        >
          {values?.map((value, key) => (
            <td key={key}>
              <Link
                type="button"
                to={`/cadastro/modulo/equipamentolora-update/${value.id}`}
                color="link"
                size="sm"
                className="btn-light waves-effect waves-light"
              >
                <i className="dripicons-document-edit" />{" "}
              </Link>
            </td>
          ))}
        </SearchTable>
      </div>
    </React.Fragment>
  );
};

export default EquipamentoLora;
