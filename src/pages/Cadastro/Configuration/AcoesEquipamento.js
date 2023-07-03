import React, { useState, useEffect, useRef } from "react";

import {
  Col,
  Card,
  CardBody,
  Container,
  Row,
  Input,
  Label,
  Badge,
  Button,
  Modal,
} from "reactstrap";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import Swal from "sweetalert2";




import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../../services/api";

const AcoesEquipamento = () => {
  const [allEquipamentos, setAllEquipamentos] = useState([]);
  const [equipamento, setEquipamento] = useState([]);
  const [fabricantes, setFabricantes] = useState();

  const [selectedFabricante, setSelectedFabricante] = useState("");
  const [desc, setDesc] = useState("");
  const [modelo, setModelo] = useState("");
  const [numero, setNumero] = useState("");
  const [numeroLoras, setNumeroLoras] = useState("");

  const [totLora, setTotLora] = useState("");
  const [parcialLoras, setParcialLoras] = useState("");
  const [selectedEquipamento, setSelectedEquipamento] = useState([]);
  const [selcetAll, setSelcetAll] = useState(false);
  const [todos, setTodos] = useState([]);
  const [check, setCheck] = useState(false);
  useEffect(() => {
    let fabricante = [];
    let equip = [];
    let empresas = [];
    let totalLora = "";
    api
      .get("/makerslora")
      .then((response) => {
        response.data.map((elem) => {
          fabricante.push({
            id: elem.OID_FABRICANTE_LORA,
            name: elem.DS_FABRICANTE_LORA,
          });
        });
        setFabricantes(fabricante);
      })
      .then(() => {
        api.get("/equipmentslora").then((response) => {
          fabricante.map((elem) => {
            response.data.map((elem2) => {
              if (elem.id === elem2.OID_FABRICANTE_LORA) {
                equip.push({
                  id: elem2.OID_EQUIPAMENTO_LORA,
                  idFabricante: elem2.OID_FABRICANTE_LORA,
                  fabricanteName: elem.name,
                  desc: elem2.DS_DESCRICAO_EQUIPAMENTO,
                  modelo: elem2.DS_MODELO_EQUIPAMENTO,
                  numero: elem2.NR_EQUIPAMENTO,
                  registro: elem2.OID_REGISTRO,
                });
                
                if(elem2.OID_REGISTRO == null){
                todos.push(elem2.NR_EQUIPAMENTO);
                totalLora = totalLora + "-" + elem2.NR_EQUIPAMENTO;
                }
              }
            });
          });
          setAllEquipamentos(equip);
          setEquipamento(equip);
          setTotLora(totalLora);
        });
      });
  }, []);

  useEffect(() => {
    if (selcetAll) {
      setSelectedEquipamento(todos);
    } else {
      setSelectedEquipamento([]);
    }
  }, [selcetAll]);

  const onSubmitRegister = () => {
    Swal.fire({
      icon: "warning",
      text: "Este Modulo possui um registro, para enviar dados, faça uma calibração!",
    });
    
    return;
  }

  const { register, handleSubmit } = useForm();
  const onSubmit = () => {
    let selectedFabricanteId;
    fabricantes.map((elem) => {
      if (selectedFabricante === elem.name) {
        selectedFabricanteId = elem.id;
      }
    });

    let body = {
      OID_FABRICANTE_LORA: selectedFabricanteId,
      DS_DESCRICAO_EQUIPAMENTO: desc,
      DS_MODELO_EQUIPAMENTO: modelo,
      NR_EQUIPAMENTO: numero,
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
          setEquipamento(allEquipamentos);
          return;
        } else {
          Swal.fire({
            icon: "success",
            timer: 500,
          });
          setEquipamento(arr);
        }
      })
      .catch(function (error) {
        //Temporário até resolver o Back-End
        //Não tem Mensagem de Erro, ele volta p/ o valor inicial
        setEquipamento(allEquipamentos);
      });
  };

  const inputHandler = (prop) => (event) => {
    if (prop === "desc") {
      setDesc(event.target.value);
    } else if (prop === "modelo") {
      setModelo(event.target.value);
    } else if (prop === "numero") {
      setNumero(event.target.value);
    } else if (prop === "total") {
      if (event.target.checked == true) {
         setNumeroLoras(totLora);
        setCheck(true);
       
        
        setSelcetAll(true);
        
      } else {
        setNumeroLoras(parcialLoras);
        setSelcetAll(false);
        setCheck(false);
      }
    } else {
      let loras = numeroLoras;
      setCheck(false);
      if (selectedEquipamento.indexOf(event.target.value) > -1) {
        selectedEquipamento.splice(
          selectedEquipamento.indexOf(event.target.value),
          1
        );
      } else {
        selectedEquipamento.push(event.target.value);
      }

      if (loras.indexOf(event.target.value) > -1) {
        loras = loras.replace("-" + event.target.value, "");
      } else {
        loras += "-" + event.target.value;
      }
      setParcialLoras(loras);
      setNumeroLoras(loras);
    }
  };

  const selectHandler = (event) => {
    setSelectedFabricante(event.target.value);
  };

  const formatArray = (data) => {
    let array = [];
    let totalLora = "";
    fabricantes.map((elem) => {
      data.map((elem2) => {
        if (elem2.OID_FABRICANTE_LORA === elem.id) {
          array.push({
            id: elem2.OID_EQUIPAMENTO_LORA,
            idFabricante: elem2.OID_FABRICANTE_LORA,
            fabricanteName: elem.name,
            desc: elem2.DS_DESCRICAO_EQUIPAMENTO,
            modelo: elem2.DS_MODELO_EQUIPAMENTO,
            numero: elem2.NR_EQUIPAMENTO,
            registro: elem2.OID_REGISTRO,
          });
          totalLora = totalLora + "-" + elem2.NR_EQUIPAMENTO;
        }
      });
    });
    setTotLora(totalLora);

    return array;
  };

  return (
    <React.Fragment>
      <div className="page-content">
       
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Ações Equipamento</h6>
               
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
                      htmlFor="OID_FABRICANTE_LORA"
                      className="col-md-2 col-form-label"
                    >
                      Fabricante Lora
                    </label>
                    <div className="col-md-6">
                      <select
                        name="OID_FABRICANTE_LORA"
                        className="form-control form-control-lg"
                        onChange={selectHandler}
                      >
                        <option value="">Selecione...</option>
                        {fabricantes?.map((fabricante, key) => (
                          <option key={key} value={fabricante.name}>
                            {fabricante.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="DS_DESCRICAO_EQUIPAMENTO"
                      className="col-md-2 col-form-label"
                    >
                      Descrição Modulo
                    </label>
                    <div className="col-md-6">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="DS_DESCRICAO_EQUIPAMENTO"
                        onChange={inputHandler("desc")}
                        value={desc}
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="DS_MODELO_EQUIPAMENTO"
                      className="col-md-2 col-form-label"
                    >
                      Modelo Modulo
                    </label>
                    <div className="col-md-6">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="DS_MODELO_EQUIPAMENTO"
                        onChange={inputHandler("modelo")}
                        value={modelo}
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="NR_EQUIPAMENTO"
                      className="col-md-2 col-form-label"
                    >
                      Número Modulo
                      <div></div>
                      (MAC ADDRESS)
                    </label>
                    <div className="col-md-6">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        name="NR_EQUIPAMENTO"
                        onChange={inputHandler("numero")}
                        value={numero}
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <div className="button-items text-center">
                      <Button
                        color="secondary"
                        className="btn-lg"
                        type="submit"
                      >
                        Pesquisar <i className="dripicons-search" />
                      </Button>
                    </div>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Container fluid>
          <div className="table-responsive">
            <table className="table align-middle table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th className="align-middle">Fabricante Lora</th>
                  <th className="align-middle">Descrição Modulo</th>
                  <th className="align-middle">Modelo Modulo</th>
                  <th className="align-middle">Número Modulo</th>
                  <th className="align-middle">Registro</th>
                  <th className="align-middle">Selecionar Todos </th>
                  <th className="align-middle">
                    <Input
                      type="checkbox"
                      value={equipamento.numero}
                      className="mx-auto form-check-input"
                      onChange={inputHandler("total")}
                      checked={check}
                    ></Input>
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipamento?.map((equipamento, key) => (
                  <tr key={"_tr_" + key}>
                    <td>{equipamento.fabricanteName}</td>
                    <td>{equipamento.desc}</td>
                    <td>{equipamento.modelo}</td>
                    <td>{equipamento.numero}</td>
                    <td>
                    {
                      (() => {
                        if(equipamento.registro != null){
                          return  <span className="badge bg-success">
													Possui Registro
												</span>
                        }
                      
                        if(equipamento.registro == null){
                         return <span className="badge bg-info bg-warning">
													Não Possui Registro
												</span>  
                        }
                      })()
                    }
                    </td>
                    <td className="d-flex align-items-center">
                    {
                      (() => {
                        if(equipamento.registro != null){
                       return   <button
                          type="button"
                          onClick={onSubmitRegister}
                         
                          color="link"
                          size="sm"
                          className="btn btn-light waves-effect waves-light"
                        >
                          <i className="dripicons-cloud-upload" /> Enviar dados
                        </button>
                        }
                      
                        if(equipamento.registro == null){
                       return    <Link
                        type="button"
                        to={`/configuracao/acoesequipamentos-update/${equipamento.numero}/state/?loras=${numeroLoras}`}
                        color="link"
                        size="sm"
                        className="btn btn-light waves-effect waves-light"
                         >
                        <i className="dripicons-cloud-upload" /> Enviar dados
                      </Link>
                        }
                      })()
                    }
                      {/* <Link
                        type="button"
                        to={`/configuracao/acoesequipamentos-update/${equipamento.numero}/state/?loras=${numeroLoras}`}
                        color="link"
                        size="sm"
                        className="btn btn-light waves-effect waves-light"
                      >
                        <i className="dripicons-cloud-upload" /> Enviar dados
                      </Link> */}
                    </td>
                    <td>
                    {
                      (() => {
                        if(equipamento.registro != null){
                       return     <Input
                       type="checkbox"
                      
                       className="mx-auto form-check-input"
                       
                     />
                        }
                      
                        if(equipamento.registro == null){
                       return      <Input
                       type="checkbox"
                       value={equipamento.numero}
                       className="mx-auto form-check-input"
                       onChange={inputHandler()}
                       checked={selectedEquipamento.includes(
                         equipamento.numero
                       )}
                     />
                        }
                      })()
                    }
                      {/* <Input
                        type="checkbox"
                        value={equipamento.numero}
                        className="mx-auto form-check-input"
                        onChange={inputHandler()}
                        checked={selectedEquipamento.includes(
                          equipamento.numero
                        )}
                      /> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AcoesEquipamento;
