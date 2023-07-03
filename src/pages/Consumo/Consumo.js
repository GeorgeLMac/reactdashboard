import React, { useState, useEffect } from "react";

import { Col, Card, CardBody, Container, Row, Button } from "reactstrap";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Input from "components/shared/Inputs/Inputs";
import AuthService from "../../services/Auth.service";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import relojiodemo from "../../assets/images/relojiodemo.jpeg";
import './tool.css';

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
// import ReactExport from "react-export-excel";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./datatables.scss";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Consumo = () => {

  const initialState = {
    maker: "",
    desc: "",
    model: "",
    number: "",
  };

  const initialState2 = {
    pri: "0",
    seg: "0",
    ter: "0",
    qua: "0",
    qui: "0",
    sex: "0",
    set: "0",

   
  };

  const statereloj = {
    reloj: "0000000",
    reloj7: "",
   
  };
  const [relojio, setRelojio] = useState(initialState2);
  const [relojiod, setRelojiod] = useState(statereloj);

  function padWithLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

  const [isShowncd, setIsShowncd] = useState(false);


  const Empresa = {
    OID_EMPRESA: "",
    NM_RAZAO_SOCIAL: "",
   
  };

  const [searchmd, setSearchMD] = useState([]);

  let stateempresa = null;

  const user = AuthService.getCurrentUser();



    let checkempresa = null;
    let DS_STATUS = null;
    if(user != null){
      
      DS_STATUS = user.user.DS_STATUS
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    

    }
    }
  

  const [consumptions, setConsumptions] = useState([]);
  const [pulses, setPulses] = useState([]);

  let [lc, setLc] = useState (Empresa);

  const [search, setSearch] = useState(initialState);
  let [makers, setMakers] = useState([]);
  const [condos, setCondo] = useState([]);

  const fetchMakers = () => {
    let maker = [{  maker: "Selecione..." }];
    api.get("/imovel/hidro/"+user.user.OID_USUARIO).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_MEDIDOR,
          maker: "Medidor: "+elem.NR_MEDIDOR+" - "+elem.imovel,
         
          
        });
      });
      setMakers(maker);
    });
  };

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
  

  useEffect(() => {
    fetchMakers();
  }, []);

  if(DS_STATUS == 10){
    useEffect(() => {
      fetchCondo();
    }, []);
  }


  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
    // console.log(search)
  };



  

  const onChangeCondo = (prop) => (event) => {
    setLc({ ...lc, [prop]: event.target.value});

    stateempresa = event.target.value;
   
      fetchHidroCondo();
    
    
    
  };


  const fetchHidroCondo = () => {
    let maker = [{  maker: "Selecione..." }];
    api.get("/imovel/empresa/"+stateempresa).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_MEDIDOR,
          maker: "Medidor: "+elem.NR_MEDIDOR+" - "+elem.imovel,
          
        });
      });
      setMakers(maker);
    });
  };
  

  useEffect(() => {
    const consumptionsMap = new Map();
    consumptions.forEach((consumption) => {
      const oldValues = consumptionsMap.get(consumption.pulse_id) || [];

      consumptionsMap.set(consumption.CD_META_DEVICE_ADDR, [
        consumption.NR_VLR_PULSO,
        // consumption.NR_DIFERENCA_CONSUMO,
        ...oldValues,
      ]);
    });

    consumptionsMap.forEach((values, key) => {
      const newValues = values.map((value) => Number(value));

      const minPulse = Math.min(...newValues);
      const maxPulse = Math.max(...newValues);

      const pulseDifference = maxPulse - minPulse;
      consumptionsMap.set(key, pulseDifference);
    });

    consumptionsMap.forEach((value, key) => {
      setPulses((oldValues) => [
        oldValues.map((pulse) => ({
          ...pulse,
          id: key,
          value,
        })),
      ]);
    });
  }, [consumptions]);


  useEffect(() => {

    if(consumptions[0]){

      if(!consumptions[0].RELOJOARIA){
        consumptions[0].RELOJOARIA = "0000000"
      }

      if(consumptions[0].RELOJOARIA){

       

    let str = (parseInt(consumptions[0].RELOJOARIA) + parseInt(consumptions[0].NR_PULSO)).toString()
   
    let value = padWithLeadingZeros(str, 7)

   
    setRelojiod({reloj:value});

    setRelojio({ 
      ["set"]: value.charAt(value.length-1) ,
      ["sex"]: value.charAt(value.length-2) ,
      ["qui"]: value.charAt(value.length-3) ,
      ["qua"]: value.charAt(value.length-4) ,
      ["ter"]: value.charAt(value.length-5) ,
      ["seg"]: value.charAt(value.length-6) ,
      ["pri"]: value.charAt(value.length-7) ,
    });

    
    
  }}
  
  }, [consumptions]);



  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    setSearchMD({ searched: false });
    if (
      data.IDA === "" &&
      data.CD_META_DEVICE_ADDR === "" &&
      data.NR_MEDIDOR === "" &&
      data.DT_FILTER_INI === "" &&
      data.DT_FILTER_FIM === ""
    ) {
      Swal.fire({
        icon: "warning",
        text: "Por Favor Preencha ao Menos um Campo",
      });
      return;
    }

    // if(DS_STATUS != 10){
      if (!search.maker) {
        Swal.fire({
          icon: "warning",
          text: "Por Favor Selecione um medidor",
        });
        return;
      }
    // }

    if(data.DT_FILTER_INI != "" &&
    data.DT_FILTER_FIM != ""){
    if (
      data.DT_FILTER_INI > data.DT_FILTER_FIM 
    ) {
      Swal.fire({
        icon: "warning",
        text: "A data Fim não pode menor que a data Inicio",
      });
      return;
    }
    }
    let body = {
      
      OID_MEDIDOR: search.maker,
      // CD_META_DEVICE_ADDR: data.CD_META_DEVICE_ADDR,
      DT_FILTER_INI: data.DT_FILTER_INI,
      DT_FILTER_FIM: data.DT_FILTER_FIM,
     
    };
    // console.log(body)
   

    let oldValue = {};
    api
      .post("/consumptions/registro", body)
      .then((response) => {

        if(response.data.length === 0) {
          Swal.fire({
            icon: "warning",
            text: "Nenhum Registro encontrado para este Medidor"
          })
          
        } else {
        Swal.fire({
          icon: "success",
          // timer: 15500,
        });

        if(search.maker){
          setSearchMD({ searched: true });
         }

      }
    

        // const result = [];
        const sortedData = response.data.sort((a, b) => new Date(b.DT_LEITURA) - new Date(a.DT_LEITURA));
        const slicedData = sortedData.slice(0, 450);

        const result = slicedData.map((consumption, i) => {
          return {
            ...consumption,
            i: i,
            NR_MEDIDOR: consumption.NR_HIDROMETRO_IMOVEL,
            DS_MODELO_MEDIDOR: consumption.DS_MODELO_MEDIDOR,
            DS_LOCALIDADE: consumption.DS_LOCALIDADE,
            RELOJOARIA: consumption.RELOJOARIA,
            NR_DIFERENCA_CONSUMO: Math.trunc(consumption.NR_PULSO) - Math.trunc(oldValue.NR_PULSO) || 0,
            NR_QUANTIDADE_LITROSMC: consumption.NR_QUANTIDADE_LITROS / 1000,
            DT_RX_TIMED: new Date(consumption.DT_LEITURA).toLocaleDateString(),
            DT_RX_TIMEH: new Date(consumption.DT_LEITURA).toLocaleTimeString(),
          };
        });
        
        setConsumptions(result);

        // for (let i = response.data.length - 1; i >= 0; i--) {
        //   const consumption = response.data[i];
        //   const data = {
        //     ...consumption,
        //  //   NR_MEDIDOR: consumption.MEDIDOR.NR_MEDIDOR,
        //   //  IDA: consumption.MEDIDOR.IDA,

        //     i:i,
        //     NR_MEDIDOR: consumption.NR_HIDROMETRO_IMOVEL,
        //     DS_MODELO_MEDIDOR: consumption.DS_MODELO_MEDIDOR,
        //     DS_LOCALIDADE: consumption.DS_LOCALIDADE,
        //     RELOJOARIA: consumption.RELOJOARIA,
        //     NR_DIFERENCA_CONSUMO:
        //     Math.trunc(consumption.NR_PULSO) -
        //     Math.trunc(oldValue.NR_PULSO) || 0,
        //     NR_QUANTIDADE_LITROSMC: consumption.NR_QUANTIDADE_LITROS/1000,    
        //     DT_RX_TIMED: new Date(consumption.DT_LEITURA).toLocaleDateString(),
        //     DT_RX_TIMEH: new Date(consumption.DT_LEITURA).toLocaleTimeString(),

        //   };
        //   oldValue = consumption;

        //   result.push(data);
        // }

        //  setConsumptions(result.reverse());


      //   if(consumptions[0]){

      //     if(consumptions[0].RELOJOARIA){
      //   let value = padWithLeadingZeros(consumptions[0].RELOJOARIA, 7)

      //   console.log("value"+value)
      //   setRelojiod({reloj:value});

      //   setRelojio({ 
      //     ["set"]: value.slice(-1) ,
      //     ["sex"]: value.slice(-2,-1),
      //     ["qui"]: value.slice(-3,-2),
      //     ["qua"]: value.slice(-4,-3),
      //     ["ter"]: value.slice(-5,-3),
      //     ["seg"]: value.slice(-6,-4),
      //     ["pri"]: value.slice(-7,-5),
      //   });
      // }}
         

        //setConsumptions(response.data);
      })
      .catch(function (error) {
        console.log(error)
        Swal.fire({
          icon: "warning",
          text: "Nenhum resultado encontrado, refaça a sua busca!",
        });
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
   
        
       
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
              <label id="component-title">Consumo</label>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                   
                  </li>
                </ol>
              </Col>
            </Row>
          </div>
        </Container>

        
        <Row >
          <Col lg={12}>
            <Card>
              <CardBody style={{ display: "inline-flex" }}>
              <div className="mb-1 col-md-9">
                <form onSubmit={handleSubmit(onSubmit)}>
                {/* <Row className="mb-3">
                    <label
                      htmlFor="IDA"
                      className="col-md-2 col-form-label"
                    >
                     IDA
                    </label>
                    <div className="col-md-6">
                      <input
                        {...register("IDA", {
                          required: false,
                        })}
                        className="form-control form-control-lg"
                        type="text"
                        name="IDA"
                        defaultValue=""
                      />
                    </div>
                  </Row> */}
                  {/* <Row className="mb-3">
                    <label
                      htmlFor="CD_META_DEVICE_ADDR"
                      className="col-md-2 col-form-label"
                    >
                      Número do Modulo LORA
                    </label>
                    <div className="col-md-6">
                      <input
                        {...register("CD_META_DEVICE_ADDR", {
                          required: false,
                        })}
                        className="form-control form-control-lg"
                        type="text"
                        name="CD_META_DEVICE_ADDR"
                        defaultValue=""
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    
                    <label
                      htmlFor="NR_MEDIDOR"
                      className="col-md-2 col-form-label"
                    >
                      Número do Hidrômetro
                    </label>
                    <div className="col-md-6">
                      <input
                        {...register("NR_MEDIDOR", {
                          required: false,
                        })}
                        className="form-control form-control-lg"
                        type="text"
                        name="NR_MEDIDOR"
                        defaultValue=""
                      />
                    </div>
                  </Row> */}
                  
                  {DS_STATUS == 10?
                  <Row className="mb-3 ">
                    
                    <label
                      htmlFor="Condominio"
                      className="col-md-2 col-form-label"
                    >
                      Condomínio
                    </label>
                    <div className="col-md-8" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      
                      options={[condos, "condo"]}
                      value={lc.condo}
                      type="select"
                       onChange={onChangeCondo("condo")}
                      // onChange={e => { setLc("condo"); onChangeCondo("condo") }}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>
                    : null  }

                  <Row className="mb-3">
                    
                    <label
                      htmlFor="NR_MEDIDOR"
                      className="col-md-2 col-form-label"
                    >
                      Medidor
                    </label>
                    <div className="col-md-8" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      className="form-control form-control-lg"
                      options={[makers, "maker"]}
                      value={search.maker}
                      type="select"
                      onChange={onChangeHandler("maker")}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="DT_FILTER_INI"
                      className="col-md-2 col-form-label"
                    >
                      Data Início
                    </label>
                    <div className="col-md-8">
                      <input
                        {...register("DT_FILTER_INI", { required: false })}
                        className="form-control form-control-lg"
                        type="date"
                        name="DT_FILTER_INI"
                        defaultValue=""
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="DT_FILTER_FIM"
                      className="col-md-2 col-form-label"
                    >
                      Data Final
                    </label>
                    <div className="col-md-8">
                      <input
                        {...register("DT_FILTER_FIM", { required: false })}
                        className="form-control form-control-lg"
                        type="date"
                        name="DT_FILTER_FIM"
                        defaultValue=""
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
                </div>
                <div className="col-md-3" style={{  }}>
                
                {searchmd.searched ? (

                <div>

                  <span>Medidor: {consumptions[0] ?consumptions[0].NR_HIDROMETRO_IMOVEL :""}</span>
                  <br></br>
                  <span  style={{ fontWeight:"600"}}>Leitura Atual
                  <span className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  />
                  </span>
                  </span>
                 
                  <br></br>
                  {isShowncd && (
                <div  className= {`box-left `} ><div>
                 <img style={{ top:"100px"}} src={relojiodemo} height="380" alt="CD" />
                </div> </div> 
                 )}
                  {/* <span>{consumptions[0] ?consumptions[0].RELOJOARIA :""}M­³</span>
                  <span>{consumptions[0] ?consumptions[0].NR_PULSO :""}M­³</span> */}
                  
                 
                  <span style={{ color: "black" }}>{relojio?relojio.pri:""}</span>
                  <span style={{ color: "black" }}>{relojio?relojio.seg:""}</span>
                  <span style={{ color: "black" }}>{relojio?relojio.ter:""}</span>
                  <span style={{ color: "black" }}>{relojio?relojio.qua:""}</span>
                  <span style={{ color: "red" }}>{relojio?relojio.qui:""}</span>
                  <span style={{ color: "red" }}>{relojio?relojio.sex:""}</span>
                  <span style={{ color: "red" }}>{relojio?relojio.set:""}</span>
                  
                  <span>M­³</span>
                </div>
                  ) : (
                    <></>
                  )}

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
       

        <Container fluid>
          <Row>
            <Col lg={12}>
              {/*<td>
                      {new Date(consumption.DT_RX_TIME).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(consumption.DT_RX_TIME).toLocaleTimeString()}
                    </td>
                    <td>{consumption.NR_BATERIA}</td>
                    <td>{consumption.NR_BASE_TEMPO}</td>
                    <td>{consumption.NR_PULSO_LITROS}</td>
                    <td>{consumption.NR_VLR_PULSO}</td>
                    <td>{consumption.NR_QUANTIDADE_LITROS}</td>
                    <td>0</td>
                    <td>
                      <span className="badge bg-danger bg-primary">
                        {consumption.NR_ALARME}
                      </span>
                    </td>
                  </tr> */}



            </Col>
            <Col lg={12}>
              <br></br>
            </Col>
          </Row>
          <div className="table-rep-plugin">
          <div className="table-responsive "
           style={{ maxHeight:"450px"}}
           data-pattern="priority-columns">
            <Table className="table table-striped table-bordered  ">
              <Thead className="">
                <Tr>
                  {/* <th className="align-middle">IDA</th> */}
                  <Th className="align-middle ">Modulo</Th>
                  <Th className="align-middle">Nr. Medidor</Th>
                  <Th className="align-middle">Modelo Medidor</Th>
                  {/* <th className="align-middle">Localização</th> */}
                  <Th className="align-middle">Data</Th>
                  <Th className="align-middle">Hora</Th>
                  <Th className="align-middle">Bateria</Th>
                  {/* <th className="align-middle">Base Tempo</th>  */}
                  <Th className="align-middle">Nr. Pulso </Th>
                  <Th className="align-middle">Vr. Pulso Medidor </Th>
                  <Th className="align-middle">Litros</Th>
                  { <Th className="align-middle">Diferença/Consumo</Th> }
                  <Th className="align-middle mb-2">Alarme</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* {console.log(consumptions)} */}
                {consumptions?.map((consumption, key) => (
                  <Tr key={"_tr_" + key}>
                    {/* <td>{consumption.IDA}</td> */}
                    <Td>{consumption.MODULO_LORA}  </Td>
                    <Td>{consumption?.NR_HIDROMETRO_IMOVEL}</Td>
                    <Td>{consumption?.MODELO_MEDIDOR}</Td>
                    {/* <td>{consumption?.DS_LOCALIDADE}</td> */}
                    <Td>
                      {new Date(consumption.DT_LEITURA).toLocaleDateString()}
                    </Td>
                    <Td>
                      {new Date(consumption.DT_LEITURA).toLocaleTimeString()}
                    </Td>
                     <Td>{consumption.DS_BATERIA ? consumption.DS_BATERIA : "0" }  </Td>
                    {/* <td>{consumption.NR_BASE_TEMPO}</td>  */}
                    <Td>{consumption.NR_PULSO}</Td>
                    <Td>{consumption.VR_LITROS_POR_PULSO}</Td>
                    <Td>{consumption.VR_LEITURA_LITROS}</Td>
                    <Td style={{ textAlign: "center" }}>{consumption.NR_DIFERENCA_CONSUMO}</Td> 
                    <Td>
                      <span className="badge bg-danger bg-primary">
                        {consumption.NR_ALARME ? consumption.NR_ALARME : "N/A"}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Consumo;
