import React, { useState, useEffect } from "react";

import { Col, Card, CardBody, Container, Row, Button, Alert } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { uniqueId } from "lodash";
import { string } from "prop-types";

const editAcoesEquipamento = () => {
  let { id, state } = useParams();
  const [loraId, setLoraId] = useState(id);
  const [acoesEquipamento, setAcoesEquipamento] = useState([]);
  const [commandLora, setCommandLora] = useState("")
  const [selectLora, setSelectLora] = useState([id]);
  const [pulso, setPulso] = useState("");
  const [tempo, setTempo] = useState("");
  const [valvula, setValvula] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const loras = queryParams.get('loras');

  const fetchData = async () => {
    const { data } = await api.get(`/downlink/${loraId}`);
    setAcoesEquipamento(data);
    setCommandLora(loraId)
  };
  const newLora = async (value) => {
    const { data } = await api.get(`/downlink/${value}`);
    setAcoesEquipamento(data);
    setCommandLora(value)

  };
  const mountLoraList = () => {
    const queryParams = new URLSearchParams(location.search);
    let loras = queryParams.get('loras');


    if (loras.indexOf(id) == -1) {
      loras += "-" + id
    }
    loras = loras.replace('-', "")
    let loralist = loras.split("-")
    setSelectLora(loralist)
  }

  useEffect(() => {
    fetchData();
    if (state != "calib") {
      mountLoraList();
    }

  }, []);


  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    let nr_loras = ""
    if (pulso !== "") {
      for (let i = 0; i < selectLora.length; i++) {

        let localidade = ""
        console.log(selectLora[i])
        await api.get("/equipmentslora/locate/" + selectLora[i])
          .then((response) => {
            let arr = response.data;
            if (arr.length > 0) {
              localidade = arr[0].LOCALIDADE
            }
          })
        if (localidade != "") {
          Swal.fire({
            icon: "error",
            title: "Para alterar o numero do pulso do lora " + loraId + ", favor excluir o equipamento da localidade: " + localidade,
          });
          return ""
        }
      }
    }
    let confirmaTempo = Boolean
    let confirmaPulso = Boolean
    let confirmaValvula = Boolean
    let tipoValvula = string

    for (let i = 0; i < selectLora.length; i++) {
      nr_loras = selectLora[i]
      const new_data1 = {
        NR_BASE_TEMPO: data.NR_BASE_TEMPO,
        NR_CMD_VALVULA: "",
        NR_EQUIPAMENTO_LORA: nr_loras,
        NR_PULSO: "",
      };
      const new_data2 = {
        NR_BASE_TEMPO: "",
        NR_CMD_VALVULA: "",
        NR_EQUIPAMENTO_LORA: nr_loras,
        NR_PULSO: data.NR_PULSO,
      };
      const new_data3 = {
        NR_BASE_TEMPO: "",
        NR_CMD_VALVULA: data.NR_CMD_VALVULA,
        NR_EQUIPAMENTO_LORA: nr_loras,
        NR_PULSO: "",
      };
      tipoValvula = data.NR_CMD_VALVULA
      if (tempo !== "") {
        await api
          .post("/downlink/", new_data1)
          .then(async (response) => {
            Array.from(document.querySelectorAll("input,select")).forEach(
              (input) => (input.value = "")
            );
            //  await fetchData();
            confirmaTempo = true

          })
          .catch(function (error) {
            console.log(error);
            confirmaTempo = false
          });
      }
      if (pulso !== "") {
        await api
          .post("/downlink/", new_data2)
          .then(async (response) => {
            Array.from(document.querySelectorAll("input,select")).forEach(
              (input) => (input.value = "")
            );
            //  await fetchData();
            confirmaPulso = true

          })
          .catch(function (error) {
            console.log(error);
            confirmaPulso = false

          });
      }
      if (valvula !== "") {

        await api
          .post("/downlink/", new_data3)
          .then(async (response) => {
            Array.from(document.querySelectorAll("input,select")).forEach(
              (input) => (input.value = "")
            );
            confirmaValvula = true
            // await fetchData();
          
          })
          .catch(function (error) {
            console.log(error);
            confirmaValvula = false
           
          });
      }
      setPulso("");
      setTempo("");
      setValvula("");
    }
    if (tempo !== "") {
      if (confirmaTempo == true) {
        Swal.fire({
          icon: "success",
          title: "Base de Tempo Enviada!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro: Base de Tempo Não Enviado!",
        });
      }
    }
    if (pulso !== "") {
      if (confirmaPulso == true) {
        Swal.fire({
          icon: "success",
          title: "Número Pulso Enviado!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro: Número Pulso Não Enviado!",
        });
      }
    }
    if (valvula !== "") { 
      if(confirmaValvula == true){
        if (tipoValvula === "00") {
          Swal.fire({
            icon: "success",  
            title: "Válvula Aberta Enviada!",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Válvula Fechada Enviada!",
          });
        }

      }else{
        Swal.fire({
          icon: "error",
          title: "Erro: Válvula Não Enviada!",
        });
      }
    }

  };

  /* function handleChange(event) {
    if (event.target.value) {
      document.getElementById("tempo").style.display = "none";
      document.getElementById("valvula").style.display = "none";
    } else {
      document.getElementById("tempo").style.display = "flex";
      document.getElementById("valvula").style.display = "flex";
    }
  }
  function handleChange2(event) {
    if (event.target.value) {
      document.getElementById("pulso").style.display = "none";
      document.getElementById("valvula").style.display = "none";
    } else {
      document.getElementById("pulso").style.display = "flex";
      document.getElementById("valvula").style.display = "flex";
    }
  }
  function handleChange3(event) {
    if (event.target.value) {
      document.getElementById("pulso").style.display = "none";
      document.getElementById("tempo").style.display = "none";
    } else {
      document.getElementById("pulso").style.display = "flex";
      document.getElementById("tempo").style.display = "flex";
    }
  }*/

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Ações Equipamento</title>
        </MetaTags>
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                {state == "calib" ? (
                  <Link to={`/calibragem/${loraId}`}>
                    <Button
                      color="link"
                      className="btn btn-lg btn-link waves-effect"
                    >
                      <i className="dripicons-arrow-thin-left" /> Voltar
                    </Button>
                  </Link>
                ) : (
                  <Link to={"/cadastro/acoesequipamento"}>
                    <Button
                      color="link"
                      className="btn btn-lg btn-link waves-effect"
                    >
                      <i className="dripicons-arrow-thin-left" /> Voltar
                    </Button>
                  </Link>
                )}
              </Col>
            </Row>
          </div>
        </Container>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row className="mb-3">
                    <label
                      htmlFor="NR_EQUIPAMENTO_LORA"
                      className="col-md-2 col-form-label"
                    >
                      Número do Equipamento Lora
                    </label>
                    <div className="col-md-6">
                      <input
                        {...register("NR_EQUIPAMENTO_LORA", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="NR_EQUIPAMENTO_LORA"
                        defaultValue={loraId}
                      //  onChange={}
                      />
                      <h5>
                        <br></br>
                        {state != "calib" ?
                          selectLora.map((element) => {
                            return <span onClick={() => { newLora(element) }}>{element} </span>
                          }) : <span>{loraId}</span>}
                      </h5>
                    </div>
                  </Row>

                  <Row className="mb-3" id="pulso">
                    <label
                      htmlFor="NR_PULSO"
                      className="col-md-2 col-form-label"
                    >
                      Número Pulso
                    </label>
                    <div className="col-md-6">
                      <input
                        {...register("NR_PULSO")}
                        className="form-control form-control-lg"
                        type="Number"
                        name="NR_PULSO"
                        onChange={(e) => {
                          setPulso(e.target.value);
                        }}
                      />
                    </div>
                  </Row>
                  <Row className="mb-3" id="tempo">
                    <label
                      htmlFor="NR_BASE_TEMPO"
                      className="col-md-2 col-form-label"
                    >
                      Base de Tempo (1 para cada 10 minutos)
                    </label>
                    <div className="col-md-6">
                      <input
                        {...register("NR_BASE_TEMPO")}
                        className="form-control form-control-lg"
                        type="Number"
                        name="NR_BASE_TEMPO"
                        onChange={(e) => {
                          setTempo(e.target.value);
                        }}
                      />
                    </div>
                  </Row>
                  <Row className="mb-3" id="valvula">
                    <label
                      htmlFor="NR_CMD_VALVULA"
                      className="col-md-2 col-form-label"
                    >
                      Válvula
                    </label>
                    <div className="col-md-6">
                      <select
                        {...register("NR_CMD_VALVULA")}
                        name="NR_CMD_VALVULA"
                        className="form-control form-control-lg"
                        onChange={(e) => {
                          setValvula(e.target.value);
                        }}
                      >
                        <option value="">Selecione</option>
                        <option value="00">Abrir Válvula</option>
                        <option value="01">Fechar Válvula</option>
                      </select>
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <div className="button-items text-center">
                      <Button color="primary" className="btn-lg" type="submit">
                        Enviar dados
                      </Button>
                    </div>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <div className="table-responsive">
            <h3>Últimos comandos Lora : {commandLora}</h3>

            <table className="table align-middle table-nowrap mb-0">
              <tbody>
                <tr>
                  <td>Data de Envio</td>
                  <td>Data de Gravação</td>
                  <td></td>
                </tr>
                {acoesEquipamento.length &&
                  acoesEquipamento?.map((acoes) => (
                    <tr key={uniqueId()}>
                      <td>
                        {acoes.DT_ENVIO !== null
                          ? acoes.DT_ENVIO.split("-").reverse().join("/")
                          : ""}
                      </td>
                      <td>
                        {acoes.DT_GRAVACAO_REG.split("-").reverse().join("/")}
                      </td>
                      <td>
                        {acoes.NR_PULSO ? (
                          <span className="badge bg-success">
                            Pulso atualizado: {acoes.NR_PULSO}
                          </span>
                        ) : (
                          <></>
                        )}
                        {acoes.NR_CMD_VALVULA == "00" ? (
                          <span className="badge bg-success">
                            Válvula aberta
                          </span>
                        ) : (
                          <></>
                        )}
                        {acoes.NR_CMD_VALVULA == "01" ? (
                          <span className="badge bg-danger">
                            Válvula fechada
                          </span>
                        ) : (
                          <></>
                        )}
                        {acoes.NR_BASE_TEMPO ? (
                          <span className="badge bg-success">
                            Base atualizada: {acoes.NR_BASE_TEMPO}
                          </span>
                        ) : (
                          <></>
                        )}
                      </td>
                      <td>
                        {acoes.DT_ENVIO ? (
                          <span className="badge bg-info text-dark">
                            Enviado
                          </span>
                        ) : acoes.DS_META_RETORNOEQUIPAMENTO ? (
                          <span className="badge bg-success">Concluído</span>
                        ) : (
                          <span className="badge bg-danger">
                            Aguardando uplink
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default editAcoesEquipamento;
