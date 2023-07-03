import React, { useEffect, useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import { Alert, Label } from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "services/api";
import AuthService from "../../../services/Auth.service";

const EquipamentoLoraCadastro = () => {
  const initialState = {
    maker: "",
    desc: "",
    model: "",
    number: "",
    payload: [],
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

  const [register, setRegister] = useState(initialState);
  const [makers, setMakers] = useState([]);
  const [payloads, setPayloads] = useState([]);
  const [condos, setCondo] = useState([]);
  let [lc, setLc] = useState (Empresa);

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
    let maker = [];
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
        setRegister({ ...register, maker: maker[0].id.toString() });
      });
  };




  const fetchPayloads = () => {
    let payload = [];
    api.get("/makerspayloads").then((response) => {
      response.data.map((elem) => {
        if (elem.TP_ATIVO === "S") {
          payload.push({
            idPayload: elem.OID_FABRICANTE_LORA_PAYLOAD,
            idMaker: elem.OID_FABRICANTE_LORA,
            protocol: elem.DS_PROTOCOLO,
            protocolVersion: elem.NR_PROTOCOLO_VERSAO,
            payloadType: elem.TP_PAYLOAD,
            base: elem.NR_BASE_DECRIPTACAO,
          });
        }
      });
      setPayloads(payload);
    });
  };
  console.log(register.payload)

  const onChangeHandler = (prop) => (event) => {
    if (prop === "payload") {
      let aux = register.payload;
      if(event.target.checked) {
        aux.push(event.target.value);
        setRegister({ ...register, payload: aux });
      } else {
        aux = aux.filter(word => word !== event.target.value);
        setRegister({ ...register, payload: aux });
      }
      return;
    }
    setRegister({ ...register, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // if(checkempresa == null){
    //   checkempresa = lc.condo;
    // }
    if(!lc.condo){
      Swal.fire({       
        icon: "warning",
        text: "favor Adicionar o Condomínio ao Módulo."
      })
      return
    }
    console.log(lc)
    if(register.number < 1){
      Swal.fire({       
        icon: "warning",
        text: "favor Colocar o Número do Equipamento"
      })
      return
    }

    if(register.payload.length == 0){
      Swal.fire({       
        icon: "warning",
        text: "Adicione um Payload, selecionando uma opção"
      })
      return
    }

    const body = {
      OID_FABRICANTE_LORA: register.maker,
      DS_DESCRICAO_EQUIPAMENTO: register.desc,
      DS_MODELO_EQUIPAMENTO: register.model,
      NR_EQUIPAMENTO: register.number,
      PAYLOADS: register.payload,
      OID_EMPRESA: lc.condo,
      
    }

    

    api.post("/equipmentslora", body)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Equipamento Lora cadastrado!",
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "warning",
          text: "Número Mac Adress Já cadastrado!",
        });
      });

    console.log(register);
  };

  const payloadCheck = () => {
    let check = false;
    payloads?.map((elem) => {
      if (elem.idMaker.toString() === register.maker) {
        check = true;
      }
    });
    return check;
  };

  useEffect(() => {
    fetchMakers();
    fetchPayloads();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastrar | Módulo Lora</label>
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/cadastro/modulo/equipamentolora"
            styles={{
              marginLeft: "1.5rem",
              background: "#f8f7ff",
              color: "blue",
            }}
          />
        </div>
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
            <div className="row">
              <div className="col-6">
                <Input
                  id="fab-register"
                  label="Fabricante Lora"
                  type="select"
                  options={[makers, "maker"]}
                  value={register.maker}
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="desc"
                  label="Descrição do Módulo"
                  value={register.desc}
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
                  value={register.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="number"
                  label="Número do Módulo (MAC ADDRESS)"
                  value={register.number}
                  onChange={onChangeHandler("number")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              {payloadCheck() ? (
                <div className="row">
                  <div className="col-6 mt-3">
                    {payloads?.map((payload) => {
                      if (Number(register.maker) === payload.idMaker)
                        return (
                          <div key={payload.id} className="form-check">
                            <input
                              id={payload.idPayload}
                              type="checkbox"
                              className="form-check-input"
                              name="PAYLOADS"
                              value={payload.idPayload}
                              onChange={onChangeHandler("payload")}
                            />
                            <Label
                              className="form-check-label"
                              htmlFor={payload.idPayload}
                            >
                              {" "}
                              {payload.protocol} / {payload.protocolVersion} /{" "}
                              {payload.payloadType} / {payload.base}
                            </Label>
                          </div>
                        );
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {payloadCheck() ? (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <Button
                    icon="ti-agenda"
                    text="Cadastrar"
                    action={submitHandler}
                    primaryColor="#5d4ec0"
                    hoverColor="#4eadc0"
                  />
                </div>
              ) : (
                <Alert color="warning" style={{ marginTop: "1.5rem" }}>
                  Você precisa cadastrar um payload para esse fabricante
                  primeiro!{" "}
                  <Link to="/configuracao/payload-cadastro">
                    Clique aqui
                  </Link>{" "}
                  para cadastrar
                </Alert>
              )}
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default EquipamentoLoraCadastro;
