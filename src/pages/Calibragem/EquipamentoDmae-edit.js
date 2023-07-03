import React, { useEffect, useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import { Col, Card, CardBody, Container, Row } from "reactstrap";

import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate, Link, useParams  } from "react-router-dom";
import AuthService from "../../services/Auth.service";
// import { Portal } from "@mui/material";
import { uniqueId } from "lodash";

const EditEquipamentoDmae = () => {
  let navigate = useNavigate();
  let { id, state } = useParams();
  const [regId ] = useState(id);
  const [stateid ] = useState(state);
  const [acoesEquipamento, setAcoesEquipamento] = useState([]);

  const [calibp1, setCalibp1] = useState([]);
  const [calibp2, setCalibp2] = useState([]);
  const [calibp3, setCalibp3] = useState([]);
  const [calibp4, setCalibp4] = useState([]);


  const initialState = {
    hydro: "",
    lora: "",
    location: "",
    region: "NORTE",
    latitude: "",
    longitude: "",
    locationType: "F",
    clock: "",
  };

  

  const regionArray = [
    { id: "NORTE", region: "Norte" },
    { id: "SUL", region: "Sul" },
    { id: "LESTE", region: "Leste" },
    { id: "OESTE", region: "Oeste" },
  ];
  const locationTypeArray = [
    { id: "F", locationType: "Final" },
    { id: "T", locationType: "Temporária" },
  ];

  const user = AuthService.getCurrentUser();



    let checkempresa = null;
    let DS_STATUS = null;
    if(user != null){
      
      DS_STATUS = user.user.DS_STATUS
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    

    }
    }
    const Empresa = {
      OID_EMPRESA: "",
      NM_RAZAO_SOCIAL: "",
     
    };
  
    let stateempresa = null;

    let [lc, setLc] = useState (Empresa);
    const [search, setSearch] = useState(initialState);

  const [porta1, setPorta1] = useState(initialState);
  const [porta2, setPorta2] = useState(initialState);
  const [porta3, setPorta3] = useState(initialState);
  const [porta4, setPorta4] = useState(initialState);

  const [lorae, setLorae] = useState([]);
  const [loraid, setLoraid] = useState([]);

  let [makers, setMakers] = useState([]);
  let [portas, setPortas] = useState([]);
  const [condos, setCondo] = useState([]);

  const [lora, setLora] = useState([]);

  const fetchMakers = () => {
    let maker = [{  maker: "Selecione..." }];
    api.get("/imovel/hidro/"+user.user.OID_USUARIO).then((response) => {
      response.data.map((elem) => {
        maker.push({
          maker: elem.NR_MEDIDOR,
         
          
        });
      });
      setMakers(maker);
    });
  };

  const fetchHidroSindico = () => {
    let maker = [];
    api.get("/registros/"+id).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_REGISTRO_PORTA_MEDIDOR,
          porta: elem.PORTA,
          loraid: elem.OID_EQUIPAMENTO_LORA,
          lora: elem.NR_EQUIPAMENTO,
          medidor: elem.NR_MEDIDOR,
          
         
          
        });
      });
      console.log(maker)
      setPortas(maker);
      setLoraid(maker[0].lora)
      console.log(portas)

      const p1 = maker.filter(element => element.porta === 1);
      const p2 = maker.filter(element => element.porta === 2);
      const p3 = maker.filter(element => element.porta === 3);
      const p4 = maker.filter(element => element.porta === 4);
      //  calib1.push(p1)
     
      setCalibp1(p1);
      setCalibp2(p2);
      setCalibp3(p3);
      setCalibp4(p4);
     
      
      
    });
  };

  useEffect(() => {
    console.log("p"+portas)
  }, [portas]);


  useEffect(() => {
    if(loraid.length > 0){
    fetchData();
    }
    

  }, [loraid]);



  const fetchData = async () => {
    const { data } = await api.get(`/registros/h/historico/${loraid}`);
    setAcoesEquipamento(data);
    
  };


  const fetchLora = () => {
    let lora = [{ id: "", lora: "Selecione..." }];
    api.get("/equipmentslora/semregistro").then((response) => {
      response.data.map((elem) => {
        lora.push({
          id: elem.OID_EQUIPAMENTO_LORA,
          lora: elem.NR_EQUIPAMENTO,
         
          
        });
      });
      setLora(lora);
    });
  };


  const fetchLoraEmpresa = () => {
    let lora = [{ id: "",  lora: "Selecione..." }];
    api.get("/equipmentslora/empresa/"+stateempresa).then((response) => {
      response.data.map((elem) => {
        lora.push({
          id: elem.OID_EQUIPAMENTO_LORA,
          lora: elem.NR_EQUIPAMENTO,
         
          
        });
      });
      setLora(lora);
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
    fetchHidroSindico();
    
  }, []);

  if(DS_STATUS == 10){
    useEffect(() => {
      fetchCondo();
    }, []);
  }


  const onChangeHandlerPorta1 = (prop) => (event) => {
    setPorta1({ ...search, [prop]: event.target.value });
  };
  const onChangeHandlerPorta2 = (prop) => (event) => {
    setPorta2({ ...search, [prop]: event.target.value });
  };
  const onChangeHandlerPorta3 = (prop) => (event) => {
    setPorta3({ ...search, [prop]: event.target.value });
  };
  const onChangeHandlerPorta4 = (prop) => (event) => {
    setPorta4({ ...search, [prop]: event.target.value });
  };


  const onChangeHandlerlora = (prop) => (event) => {
    setLorae({ ...search, [prop]: event.target.value });
  };



  

  const onChangeCondo = (prop) => (event) => {
    setLc({ ...lc, [prop]: event.target.value});

    stateempresa = event.target.value;
   
      fetchHidroCondo();
    
      // fetchLoraEmpresa();
    
  };

  const fetchHidroCondo = () => {
    let maker = [{ id: "",  maker: "Selecione..." }];
    api.get("/imovel/empresa/semregistro/"+stateempresa).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_MEDIDOR,
          maker: "Medidor: "+elem.NR_MEDIDOR+" - "+elem.imovel,
         
          
        });
      });
      setMakers(maker);
    });
  };


  const [register, setRegister] = useState(initialState);
  const [hydro, setHydro] = useState([]);
  

  const fetchHydro = () => {
    let hydro = [];
    api.get("/hydrometers").then((response) => {
      response.data.map((elem) => {
        hydro.push({
          id: elem.OID_HIDROMETRO,
          hydro: elem.NR_HIDROMETRO,
        });
      });
      setHydro(hydro);
    });
  };

  const onChangeHandler = (prop) => (event) => {
    setRegister({ ...register, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
   

    let hydrometer = {};
    let equip = {};

    // console.log(porta1.maker+'a')
    // console.log(porta2.maker)
    // console.log(porta3.maker)
    // console.log(porta4.maker)
    // console.log(lorae.lora)


    if (!lorae.lora) {
      Swal.fire({
        icon: "warning",
        title: "Por Favor Selecione um Equipamento",
      });
      return;
    }


    const body = {
      OID_USUARIO: user.user.OID_USUARIO,
      OID_EQUIPAMENTO_LORA: lorae.lora,
      OID_REGISTRO: id,
    };

		

    api
      .put(`/registros/${id}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Equipamento atualizado!",
        }).then(() => {
					window.location.reload(true)
				});
      })
      .catch(function () {
        Swal.fire({
          icon: "warning",
          title: "Falha na Atualização, verifique os dados e tente novamente",
        });
      });

    


    
    



      


      // Swal.fire({
      //   icon: "success",
      //   title: "Modulo Atualizado!",
      // }).then(() => {
      //   window.location.reload(true)
      // });
    // }).catch((error) => {
    //   console.log(error);
    //   Swal.fire({
    //     icon: "warning",
    //     text: "Verifique os Dados e refaça o Cadastro!"
    //   })
    // });
  };

  useEffect(() => {
    fetchHydro();
    fetchLora();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">

        {
          
                      (() => {
                        if(state == "create" ){
                          return <span>Cadastrar Portas</span>
                        }
                        if(state == "edit" ){
                          return <span>Editar Portas</span>
                        }
                      
                      })()
                    }
          
        
          </label>
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/calibragem"
            styles={{
              marginLeft: "1.5rem",
              background: "#f8f7ff",
              color: "blue",
            }}
          />
        </div>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">


          <Row className="mb-3">
                    
                    <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Modulo Lora
                    </label>
                    <div className="col-md-6 mb-3">
                      {/* <input
                        {...register("NR_EQUIPAMENTO_LORA", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="NR_EQUIPAMENTO_LORA"
                        defaultValue={loraId}
                      /> */}
                      <h5>
                   
                        {loraid}
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

                  <Row className="mb-3">
                    
                    <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Novo Modulo Lora
                    </label>
                    <div className="col-6" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      
                      options={[lora, "lora"]}
                      value={lorae.lora}
                      type="select"
                      onChange={onChangeHandlerlora("lora")}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>
{/* 


                  {DS_STATUS == 10?
                  <Row className="mb-3">
                    
                    <label
                      htmlFor="Condominio"
                      className="col-md-2 col-form-label"
                    >
                      Condomínio
                    </label>
                    <div className="col-6" style={{ textAlign: "start" }}>
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
                    : null  } */}


         

     

         
           
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <Button
                  icon="ti-agenda"
                  text="Atualizar"
                  action={submitHandler}
                  primaryColor="#5d4ec0"
                  hoverColor="#4eadc0"
                />
              </div>
            </div>
          </div>
        </form>
        <Row>
          <div className="table-responsive">
            <h3>Últimas Alterações : </h3>

            <table className="table align-middle table-nowrap mb-0">
              <tbody>
                <tr>
                  <td>Data de Envio</td>
                  <td>Módulo atualizado</td>
                  <td>Módulo retirado</td>
                  <td>Usuário</td>
                  
                </tr>
                {acoesEquipamento.length &&
                  acoesEquipamento?.map((acoes) => (
                    <tr key={uniqueId()}>
                      <td>
                      {acoes.DT_ULT_ALTER !== null
                        ? new Date(acoes.DT_ULT_ALTER).toLocaleString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })
                        : ""}
                    </td>
                      <td>
                        {acoes.equipamento ? (
                          <span className="">
                             {acoes.equipamento}
                          </span>
                        ) : (
                          <></>
                        )}
                       
                        
                      </td>

                      <td>
                        
                       
                        {acoes.equipamentoantigo ? (
                          <span className="">
                            {acoes.equipamentoantigo}
                          </span>
                        ) : (
                          <></>
                        )}
                      </td>

                      <td>
                        
                       
                        {acoes.DS_NOME ? (
                          <span className="">
                            {acoes.DS_NOME}
                          </span>
                        ) : (
                          <></>
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

export default EditEquipamentoDmae;
