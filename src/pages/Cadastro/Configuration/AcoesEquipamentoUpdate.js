import React, { useState, useEffect } from "react";

import { Col, Card, CardBody, Container, Row, Button} from "reactstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import api from "../../../services/api";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { uniqueId } from "lodash";


const AcoesEquipamentoUpdate = () => {
  let { id, state } = useParams();
  const initialState = {
    
    id: "",
    
  };

  const [loraId ] = useState(id);
  const [stateId ] = useState(state);
  const [selectLora, setSelectLora] = useState([]);
  const [commandLora, setCommandLora] = useState("")
  const queryParams = new URLSearchParams(location.search);
  const loras = queryParams.get('loras');
 
  
  const [acoesEquipamento, setAcoesEquipamento] = useState([]);
  const [check, setCheck] = useState({ languages: [],
    response: [],});
    const [check1, setCheck1] = useState([]);
    const [check2, setCheck2] = useState([]);
    const [check3, setCheck3] = useState([]);
    const [check4, setCheck4] = useState([]);

    const [checkc, setCheckc] = useState([]);
    const [checkswal, setCheckswal] = useState([]);


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


  let navigate = useNavigate();

  const onChangeHandler = (prop) => (event) => {
   
      let aux = check.payload;
      if(event.target.checked) {
        aux.push(event.target.value);
        setCheck({ ...check, payload: aux });
      } else {
        aux = aux.filter(word => word !== event.target.value);
        setCheck({ ...check, payload: aux });
      }
      
      
    
      setCheck({ ...check, [prop]: event.target.value });
      console.log(aux)
  };

  const mountLoraList = () => {
    const queryParams = new URLSearchParams(location.search);
    let loras = queryParams.get('loras');

    console.log(loras)
    if (loras.indexOf(id) == -1) {
      loras += "-" + id
    }
    console.log(loras)
    loras = loras.replace('-', "")
    console.log(loras)
    // loras = loras.replaceAll('-', "-id:")
    console.log(loras)
    
    let loralist = loras.split("-")
    console.log(loralist)
    setSelectLora(loralist)
  }

  useEffect(() => {
    fetchData();
    if (loras) {
      mountLoraList();
    }

  }, [loras]);

  // useEffect(() => {
  
  //   if (state != "calib") {
  //     mountLoraList();
  //   }

  // }, []);


  const handleChangeC = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { languages } = check;
      
    console.log(`${value} is ${checked}`);
     
    // Case 1 : The user checks the box
    if (checked) {
      setCheck({
        languages: [...languages, value],
        response: [...languages, value],
      
      });
      
    }
  
    // Case 2  : The user unchecks the box
    else {
      setCheck({
        languages: languages.filter((e) => e !== value),
        response: languages.filter((e) => e !== value),
      });
    
    }
  };
  const handleChange1 = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    
    
     
    // Case 1 : The user checks the box
    if (checked) {
      setCheck1({
        value: "1",
      });
      // console.log(check1)
      // console.log(check1.value)
    }
  
    // Case 2  : The user unchecks the box
    else {
      setCheck1({
       value: false,
      });
   
    }
  };
  const handleChange2 = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    
      
  
     
    // Case 1 : The user checks the box
    if (checked) {
      setCheck2({
        value: "2",
      });
      // console.log(check2)
      // console.log(check2.value)
    }
  
    // Case 2  : The user unchecks the box
    else {
      setCheck2({
       value: false,
      });
   
    }
  };
  const handleChange3 = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    
      
    
     
    // Case 1 : The user checks the box
    if (checked) {
      setCheck3({
        value: "4",
      });
      // console.log(check3)
      // console.log(check3.value)
    }
  
    // Case 2  : The user unchecks the box
    else {
      setCheck3({
       value: false,
      });
    
    }
  };
  const handleChange4 = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    
  
    // Case 1 : The user checks the box
    if (checked) {
      setCheck4({
        value: "8",
      });
      // console.log(check4)
      // console.log(check4.value)
    }
  
    // Case 2  : The user unchecks the box
    else {
      setCheck4({
       
      });
      
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {


    let nr_loras = ""
    // console.log(check1)
    // console.log(check2)
    // console.log(check3)
    // console.log(check4)
    let a1 = 0;
    let a2 = 0;
    let a3 = 0;
    let a4 = 0;
    if (check1.value){
       a1 = check1.value;
    }
    if (check2.value){
       a2 = check2.value;
    }
    if (check3.value){
       a3 = check3.value;
    }
    if (check4.value){
       a4 = check4.value;
    }
    
  

    let sum = 0;
    
    // let sum = parseInt(check1.value, 16) + parseInt(check2.value, 16);
     sum = 
     parseInt(a1, 16)
       + parseInt(a2, 16)
        + parseInt(a3, 16)
         + parseInt(a4, 16);
    // console.log(sum.toString(16));
    // // console.log(a1,a2,a3,a4);
    
    // console.log("00003CA"+sum.toString(16).toUpperCase())

setCheckswal({ searched: true });
let confirma = Boolean
confirma = true;

if(selectLora[0]){

  

for (let i = 0; i < selectLora.length; i++) {

  nr_loras = selectLora[i]

let body = {

  NR_EQUIPAMENTO_LORA: nr_loras,
  BOTTOMUP: "00003CA"+sum.toString(16).toUpperCase(),
}


    api
      .post("/downlink/tx", body)
      .then(async () => {
        Array.from(document.querySelectorAll("input,select")).forEach(
          (input) => (input.value = "")
        );

        // await fetchData();

        // Swal.fire({
        //   icon: "success",
        //   title: "Downlink realizado!",
        // });
        
       
      })
      .catch(function (error) {
    
       confirma = false;
      });
  }
  console.log(checkswal.searched)
  if (confirma == true) {
    setCheckc({ searched: true });
     fetchData();
    Swal.fire({
      icon: "success",
      title: "Downlink realizado!",
    });
     
  } else {
    Swal.fire({
      icon: "warning",
      title: "",
    });
  }

} 


if(!selectLora[0]){

let body = {

  NR_EQUIPAMENTO_LORA: data.NR_EQUIPAMENTO_LORA,
  BOTTOMUP: "00003CA"+sum.toString(16).toUpperCase(),
}


    api
      .post("/downlink/tx", body)
      .then(async () => {
        Array.from(document.querySelectorAll("input,select")).forEach(
          (input) => (input.value = "")
        );

        setCheckc({ searched: true });
        await fetchData();

        Swal.fire({
          icon: "success",
          title: "Downlink realizado!",
        });
      
      })
      .catch(function (error) {
        console.log(error);
       
      });
  }
 

} 
  



  const voltar = (event) => {
    navigate.goBack()

  }
 

  return (
    <React.Fragment>
      <div className="page-content">
      
          <title>Ações Equipamento</title>
       
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>


                {!stateId ? (


                  checkc.searched ? (
                    <Link to={`/calibragem/${loraId}/calib`}>
                    <Button
                    // onClick={() => navigate(-1)}
                      color="link"
                      className="btn btn-lg btn-link waves-effect"
                    >
                      <i className="dripicons-arrow-thin-left" /> voltar 
                    </Button>
                    </Link>
                    ): (

                      <Link to={`/calibragem/${loraId}`}>
                          <Button
                            color="link"
                            className="btn btn-lg btn-link waves-effect"
                          >
                            <i className="dripicons-arrow-thin-left" /> Voltar
                          </Button>
                        </Link>
                    )

                ) : (
                  <Link to={"/configuracao/acoesequipamentos"}>
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
              <CardBody style={{background: "#F8F7FF"}}>
              
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row className="mb-3">
                    <label
                      htmlFor="NR_EQUIPAMENTO_LORA"
                      className="col-md-2 col-form-label"
                    >
                      Número do módulos Lora
                    </label>
                    <div className="col-md-6 mb-3">
                      <input
                        {...register("NR_EQUIPAMENTO_LORA", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="NR_EQUIPAMENTO_LORA"
                        defaultValue={loraId}
                      />
                      <h5 className="mb-3">
                        <br></br>
                       
                        {selectLora[0] ?
                        
                          selectLora.map((element,key) => {
                           return  <span className="mb-3"  key={key}>{element}, </span>
                          }) : <span>{loraId}</span>}
                      
                        {/* {selectLora ? selectLora : ""} */}
                      </h5>
                      {/* <h5>
                        <br></br>
                        {state != "calib" ?
                          selectLora.map((element) => {
                            return <span onClick={() => { newLora(element) }}>{element} </span>
                          }) : <span>{loraId}</span>}
                      </h5> */}
                    </div>
                  </Row>
                 

                  <Row>
                      <Col lg={6}>
                  <label
                        className="col-form-label"
                      >Porta 1
                      </label>
                            
                      <input
                      style={{ margin:"10px" }}
                               id="A1"
                              type="checkbox"
                              className="form-check-input"
                              name="A1"
                              
                              value="A1"
                              onChange={handleChange1}
                              // value={payload.idPayload}
                              // onChange={onChangeHandler("payload")}
                            />
                             </Col>
                      </Row>

                      <Row>
                      <Col lg={6}>
                  <label
                        className="col-form-label"
                      >Porta 2
                      </label>
                            
                      <input
                      style={{ margin:"10px" }}
                               id="A2"
                              type="checkbox"
                              className="form-check-input"
                              name="A2"
                              value="A2"
                              onChange={handleChange2}
                              // value={payload.idPayload}
                              // onChange={onChangeHandler("payload")}
                            />
                             </Col>
                      </Row>
                      <Row>
                      <Col lg={6}>
                  <label
                        className="col-form-label"
                      >Porta 3
                      </label>
                            
                      <input
                      style={{ margin:"10px" }}
                               id="A4"
                              type="checkbox"
                              className="form-check-input"
                              name="A4"
                              value="A4"
                              onChange={handleChange3}
                              // value={payload.idPayload}
                              // onChange={onChangeHandler("payload")}
                            />
                             </Col>
                      </Row>
                      <Row>
                      <Col lg={6}>
                  <label
                        className="col-form-label"
                      >Porta 4
                      </label>
                            
                      <input
                      style={{ margin:"10px" }}
                               id="A4"
                              type="checkbox"
                              className="form-check-input"
                              name="A8"
                              value="A8"
                              onChange={handleChange4}
                              // value={payload.idPayload}
                              // onChange={onChangeHandler("payload")}
                            />
                             </Col>
                      </Row>

                  {/* <Row className="mb-3" id="pulso">
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
                         
                      />
                    </div>
                  </Row> */}
                  {/* <Row className="mb-3" id="tempo">
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
                        
                      />
                    </div>
                  </Row> */}
                  {/* <Row className="mb-3" id="valvula">
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
                        onChange={handleChange3}
                      >
                        <option value="">Selecione</option>
                        <option value="00">Abrir Válvula</option>
                        <option value="01">Fechar Válvula</option>
                      </select>
                    </div>
                  </Row> */}
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
            <h3>Últimos comandos</h3>
            <table className="table align-middle table-nowrap mb-0">
              <tbody>
                {acoesEquipamento.length &&
                  acoesEquipamento?.map((acoes) => (
                   
                    <tr key={uniqueId()}>
                      <td> {new Date(acoes.DT_ULT_ALTER).toLocaleDateString()}</td>
                      <td>
                        {acoes.NR_PAYLOAD ? (
                          <span className="badge bg-success">
                            Payload atualizado: {acoes.NR_PAYLOAD}
                          </span>
                        ) : (
                          <></>
                        )}
                        {/* {acoes.NR_CMD_VALVULA == "00" ? (
                          <span className="badge bg-danger">
                            Válvula fechada
                          </span>
                        ) : (
                          <></>
                        )}
                        {acoes.NR_CMD_VALVULA == "01" ? (
                          <span className="badge bg-success">
                            Válvula aberta
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
                        )} */}
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
                            Aguardando downlink
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

export default AcoesEquipamentoUpdate;
