import React, { useState, useEffect } from "react";

import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";

import { useNavigate } from "react-router-dom";

import { Alert } from "reactstrap";

import Swal from "sweetalert2";

import api from "../../../services/api";

const PayloadCadastro = () => {
  let navigate = useNavigate();
  const initialState = {
    maker: "",
    protocol: "",
    protocolVersion: "",
    payloadType: "UPM",
    base: "32",
  };

  const payloadsArray = [
    { id: "UPM", payloadType: "UPM - UpLink Manual" },
    { id: "UPA", payloadType: "UPA - UpLink automático" },
    { id: "DWN", payloadType: "DWN - DownLink" },
  ];

  const baseArray = [
    { id: 32, base: "32" },
    { id: 64, base: "64" },
  ];

  const [makers, setMakers] = useState([]);
  const [register, setRegister] = useState(initialState);

  const fetchMakers = () => {
    let maker = [];
    api.get("/makerslora").then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_FABRICANTE_LORA,
          maker: elem.DS_FABRICANTE_LORA,
        });
      });
      setMakers(maker);
    }).then(() => {
      setRegister({ ...register, maker: maker[0].id.toString() });
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(register);
    let body = {
      OID_FABRICANTE_LORA: register.maker,
      DS_PROTOCOLO: register.protocol,
      NR_PROTOCOLO_VERSAO: register.protocolVersion,
      TP_PAYLOAD: register.payloadType,
      NR_BASE_DECRIPTACAO: register.base,
    };

    api
      .post("/makerspayloads", body)
      .then(() => {
        Swal.fire({
          icon: "success",
          text: "Payload cadastrado! Para a ativação do payload aguarde o desenvolvimento do algoritmo!",
        }).then(() => {
          navigate("/configuracao/payload")
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "warning",
          text: "Confira todos os dados e refaça o cadastro!",
        });
      });
  };

  const onChangeHandler = (prop) => (event) => {
    setRegister({ ...register, [prop]: event.target.value });
  };

  useEffect(() => {
    fetchMakers()
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastro | Payload</label>
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/configuracao/payload"
            styles={{
              marginLeft: "1.5rem",
              background: "#f8f7ff",
              color: "blue",
            }}
          />
        </div>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row">
              <Alert color="warning">
                <strong>Atenção!</strong> Confira todo os dados do Payload antes
                de cadastrar, pois não é possível editar posteriormente!
              </Alert>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="fab-register"
                  type="select"
                  options={[makers, "maker"]}
                  label="Fabricante Lora"
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="protocol"
                  label="Protocolo"
                  value={register.protocol}
                  onChange={onChangeHandler("protocol")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="protocolVersion"
                  label="Versão do Protocolo"
                  value={register.protocolVersion}
                  onChange={onChangeHandler("protocolVersion")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="payload-type"
                  type="select"
                  options={[payloadsArray, "payloadType"]}
                  label="Tipo do Payload"
                  onChange={onChangeHandler("payloadType")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="base"
                  type="select"
                  options={[baseArray, "base"]}
                  label="Base Criptografia"
                  onChange={onChangeHandler("base")}
                  styles={{ width: "100%", marginBottom: "0.5rem" }}
                />
              </div>
            </div>
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <Button
                  icon="ti-agenda"
                  text="Cadastrar"
                  action={submitHandler}
                  primaryColor="#5d4ec0"
                  hoverColor="#4eadc0"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default PayloadCadastro;
