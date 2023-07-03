import React, { useEffect, useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import { Col, Card, CardBody, Container, Row } from "reactstrap";

import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/Auth.service";
// import { Portal } from "@mui/material";

const EquipamentoKitCadastro = () => {
  let navigate = useNavigate();
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

  let [makers, setMakers] = useState([]);
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
    let maker = [{ id: "",  maker: "Selecione..." }];
    api.get("/imovel/empresa/"+checkempresa).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_MEDIDOR,
          maker: elem.NR_MEDIDOR,
         
          
        });
      });
      setMakers(maker);
    });
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
    fetchLora();
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

    console.log(porta1.maker+'a')
    console.log(porta2.maker)
    console.log(porta3.maker)
    console.log(porta4.maker)
    console.log(lorae.lora)


    if (porta1.maker == undefined ||  porta1.maker == '' )
    {
      if(porta2.maker == undefined ||  porta2.maker == '')
      {
      if(porta3.maker == undefined ||  porta3.maker == '')
      {
        if(porta4.maker == undefined ||  porta4.maker == '')
        {

          
            Swal.fire({
              icon: "warning",
              text: "Selecione um Medidor",
            });
            return;
          
        }
      }
   
    }
  }

    if (
      lorae.lora == undefined ||  lorae.lora == ''
    ) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um Modulo Lora",
      });
      return;
    }

    if (
      porta1.maker != undefined 
    ){
    if (
      porta1.maker != '' 
    ) {
      if(porta1.maker == porta2.maker || porta1.maker == porta3.maker || porta1.maker == porta4.maker )
      {
        Swal.fire({
          icon: "warning",
          text: "Medidor Duplicado Porta 01",
        });
        return;
      }
      
    }
    }
    if (
      porta2.maker != undefined 
    ){
    if (
      porta2.maker != '' 
    ) {
      if(porta2.maker == porta1.maker || porta2.maker == porta3.maker || porta2.maker == porta4.maker )
      {
        Swal.fire({
          icon: "warning",
          text: "Medidor Duplicado Porta 02",
        });
        return;
      }
    }
    }
    if (
      porta3.maker != undefined 
    ){
    if (
      porta3.maker != '' 
    ) {
      if(porta3.maker == porta1.maker || porta3.maker == porta2.maker || porta3.maker == porta4.maker )
      {
        Swal.fire({
          icon: "warning",
          text: "Medidor Duplicado Porta 03",
        });
        return;
      }
    }
    }
    
    

    const registro = {
      
      OID_EQUIPAMENTO_LORA: lorae.lora,
      DS_LOCAL_INSTALACAO: register.location,
      
    };

    api.post("/registros", registro).then((response) => {

      console.log(response)
      console.log(response.data.OID_REGISTRO)

        if (
          porta1.maker != undefined 
        ){
        if (
          porta1.maker != '' 
        ) {
          let Bporta1 ={
            OID_REGISTRO: response.data.OID_REGISTRO,
            PORTA: '1',
            OID_MEDIDOR: porta1.maker,
           
          }
          api
          .post("/registrosportas/", Bporta1 )      
        }
      }
            if (
              porta2.maker != undefined 
            ){
            if (
              porta2.maker != '' 
            ) {
              let Bporta2 ={
                OID_REGISTRO: response.data.OID_REGISTRO,
                PORTA: '2',
                OID_MEDIDOR: porta2.maker,
               
              }
              api
              .post("/registrosportas/", Bporta2 )      
            }
          }
              if (
                porta3.maker != undefined 
              ){
              if (
                porta3.maker != '' 
              ) {
                let Bporta3 ={
                  OID_REGISTRO: response.data.OID_REGISTRO,
                  PORTA: '3',
                  OID_MEDIDOR: porta3.maker,
                 
                }
                api
                .post("/registrosportas/", Bporta3 )      
              }
            }
                if (
                  porta4.maker != undefined 
                ){
                if (
                  porta4.maker != '' 
                ) {
                  let Bporta4 ={
                    OID_REGISTRO: response.data.OID_REGISTRO,
                    PORTA: '4',
                    OID_MEDIDOR: porta4.maker,
                  
                  }
                  api
                  .post("/registrosportas/", Bporta4 )      
                }
                }


      


      Swal.fire({
        icon: "success",
        title: "Kit cadastrado!",
      }).then(() => {
        navigate("/cadastro/equipamentokit")
      });
    }).catch((error) => {
      console.log(error);
      Swal.fire({
        icon: "warning",
        text: "Verifique os Dados e refaça o Cadastro!"
      })
    });
  };

  useEffect(() => {
    fetchHydro();
    fetchLora();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastrar | Equipamento KIT</label>
        
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/cadastro/equipamentokit"
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
                    : null  }

                  <Row className="mb-3">
                    
                    <label
                      htmlFor="NR_HIDROMETRO"
                      className="col-md-2 col-form-label"
                    >
                      Medidor Porta 01
                    </label>
                    <div className="col-6" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      
                      options={[makers, "maker"]}
                      value={search.maker}
                      type="select"
                      onChange={onChangeHandlerPorta1("maker")}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>

                  <Row className="mb-3">
                    
                    <label
                   
                      className="col-md-2 col-form-label"
                    >
                      Medidor Porta 02
                    </label>
                    <div className="col-6" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      
                      options={[makers, "maker"]}
                      value={search.maker}
                      type="select"
                      onChange={onChangeHandlerPorta2("maker")}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>

                  <Row className="mb-3">
                    
                    <label
                   
                      className="col-md-2 col-form-label"
                    >
                      Medidor Porta 03
                    </label>
                    <div className="col-6" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      
                      options={[makers, "maker"]}
                      value={search.maker}
                      type="select"
                      onChange={onChangeHandlerPorta3("maker")}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>

                  <Row className="mb-3">
                    
                    <label
                   
                      className="col-md-2 col-form-label"
                    >
                      Medidor Porta 04
                    </label>
                    <div className="col-6" style={{ textAlign: "start" }}>
                    <Input
                      id="fab-search"
                      
                      options={[makers, "maker"]}
                      value={search.maker}
                      type="select"
                      onChange={onChangeHandlerPorta4("maker")}
                      styles={{ width: "100%" }}
                    />
                  </div>
                  </Row>
               


            {/* <div className="row">
              <div className="col-6">
                <Input
                  id="hydro"
                  label="Hidrômetro"
                  value={register.hydro}
                  onChange={onChangeHandler("hydro")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="lora"
                  label="Equipamento Lora"
                  value={register.lora}
                  onChange={onChangeHandler("lora")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div> */}
            <div className="row mb-3">

            <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Detalhes da Localização
                    </label>
              <div className="col-6">
                <Input
                  id="location"
                  
                  value={register.location}
                  onChange={onChangeHandler("location")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            {/* <div className="row mb-3">
            <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Região
                    </label>
              <div className="col-6">
                <Input
                  id="region"
                 
                  type="select"
                  options={[regionArray, "region"]}
                  value={register.region}
                  onChange={onChangeHandler("region")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-3">
            <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Latitude
                    </label>
              <div className="col-6">
                <Input
                  id="latitude"
                  
                  value={register.latitude}
                  onChange={onChangeHandler("latitude")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div> */}
            {/* <div className="row mb-3">
            <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Longitude
                    </label>
              <div className="col-6">
                <Input
                  id="longitude"
                
                  value={register.longitude}
                  onChange={onChangeHandler("longitude")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row mb-3">
            <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Tipo de Localização
                    </label>
              <div className="col-6">
                <Input
                  id="locationType"
                  
                  type="select"
                  options={[locationTypeArray, "locationType"]}
                  value={register.locationType}
                  onChange={onChangeHandler("locationType")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div> */}
            {/* <div className="row mb-3">
            <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Relojoaria Inicial
                    </label>
              <div className="col-6">
                <Input
                  id="clock"
                  
                  value={register.clock}
                  onChange={onChangeHandler("clock")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div> */}
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
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

export default EquipamentoKitCadastro;
