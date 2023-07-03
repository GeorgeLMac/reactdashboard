import React, { useState, useEffect } from "react";

import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";

import Swal from "sweetalert2";

import api from "../../../services/api";

const Payload = () => {
  const initialState = {
    maker: "",
    protocol: "",
    protocolVersion: "",
    payloadType: "",
    base: "",
  };

  const [search, setSearch] = useState(initialState);
  const [makers, setMakers] = useState([]);

  const [values, setValues] = useState([]);

  const [showList, setShowList] = useState(false);

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

  const submitHandler = (event) => {
    event.preventDefault();
    let body = {
      OID_FABRICANTE_LORA: search.maker,
      DS_PROTOCOLO: search.protocol,
      NR_PROTOCOLO_VERSAO: search.protocolVersion,
      TP_PAYLOAD: search.payloadType,
      NR_BASE_DECRIPTACAO: search.base,
    };
    api
      .post("/makerspayloads/filter", body)
      .then((response) => {
        const arr = formatArray(response.data);
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
          setShowList(true);
          setValues(arr);
          setSearch(initialState);
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
    data.map((payload) => {
      makers.map((maker) => {
        if (payload.OID_FABRICANTE_LORA === maker.id) {
          array.push({
            makerId: maker.id,
            id: payload.OID_FABRICANTE_LORA_PAYLOAD,
            ativo: payload.TP_ATIVO,
            makerName: maker.maker,
            protocol: payload.DS_PROTOCOLO,
            protocolVersion: payload.NR_PROTOCOLO_VERSAO,
            payloadType: payload.TP_PAYLOAD,
            base: payload.NR_BASE_DECRIPTACAO,
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
        <label id="component-title">Pesquisa | Payload</label>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row" style={{ textAlign: "end" }}>
              <div className="col-6" style={{ textAlign: "start" }}>
                <Input
                  id="fab-search"
                  label="Fabricante Lora"
                  options={[makers, "maker"]}
                  type="select"
                  value={search.maker}
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
              <div className="col-6" style={{ alignSelf: "center" }}>
                <Button
                  icon="ti-agenda"
                  text="Cadastrar"
                  link="/configuracao/payload-cadastro"
                  styles={{ width: "20%", marginBottom: "1.5rem" }}
                />
              </div>
            </div>
            <div className="row" style={{ textAlign: "start" }}>
              <div className="col-6">
                <Input
                  id="protocol"
                  label="Protocolo"
                  value={search.protocol}
                  onChange={onChangeHandler("protocol")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row" style={{ textAlign: "start" }}>
              <div className="col-6">
                <Input
                  id="protocolVersion"
                  label="Versão do Protocolo"
                  value={search.protocolVersion}
                  onChange={onChangeHandler("protocolVersion")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row" style={{ textAlign: "start" }}>
              <div className="col-6">
                <Input
                  id="payloadType"
                  label="Tipo do Payload"
                  value={search.payloadType}
                  onChange={onChangeHandler("payloadType")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row" style={{ textAlign: "start" }}>
              <div className="col-6">
                <Input
                  id="base"
                  label="Base Criptografia"
                  value={search.base}
                  onChange={onChangeHandler("base")}
                  styles={{ width: "100%" }}
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
            "Fabricante",
            "Protocolo",
            "Versão do Protocolo",
            "Tipo Payload",
            "Base Criptografia",
            "Status",
          ]}
          showTable={showList}
          tableBody={[values, 3]}
        >
          {values?.map((elem, key) => (
            <td key={key}>
              {elem.ativo == "S" ? (
                <span className="badge bg-success">Ativo</span>
              ) : (
                <span className="badge bg-danger bg-primary">Inativo</span>
              )}
            </td>
          ))}
        </SearchTable>
      </div>
    </React.Fragment>
  );
};

export default Payload;