import React, { useEffect, useState } from "react";

import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";
import { Col, Card, CardBody, Container, Row } from "reactstrap";

import api from "../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import AuthService from "../../services/Auth.service";

const EquipamentoKit = () => {
  const initialState = {
    hydro: "",
    lora: "",
    location: "",
    region: "",
    locationType: "",
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
    const Empresa = {
      OID_EMPRESA: "",
      NM_RAZAO_SOCIAL: "",
     
    };
    let stateempresa = null;


  const regionArray = [
    { id: "", region: "Selecione..." },
    { id: "NORTE", region: "Norte" },
    { id: "SUL", region: "Sul" },
    { id: "LESTE", region: "Leste" },
    { id: "OESTE", region: "Oeste" },
  ];
  const locationTypeArray = [
    { id: "", locationType: "Selecione..." },
    { id: "F", locationType: "Final" },
    { id: "T", locationType: "Temporária" },
  ];

  let [lc, setLc] = useState (Empresa);
  const [lorae, setLorae] = useState([]);

  let [makers, setMakers] = useState([]);
  const [condos, setCondo] = useState([]);

  const [search, setSearch] = useState(initialState);
  const [values, setValues] = useState([]);

  const [hydro, setHydro] = useState([]);
  const [medidor, setMedidorFilter] = useState([]);
  const [loraf, setLoraFilter] = useState([]);
  const [lora, setLora] = useState([]);

  const [showList, setShowList] = useState(false);

  const fetchMakers = () => {
    let maker = [{  maker: "Selecione..." }];
    api.get("/imovel/hidro/"+user.user.OID_USUARIO).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_MEDIDOR,
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

  const onChangeCondo = (prop) => (event) => {
    setLc({ ...lc, [prop]: event.target.value});

    stateempresa = event.target.value;
   
      fetchHidroCondo();
    
      // fetchLoraEmpresa();
    
  };
  const fetchHidroCondo = () => {
    let maker = [{ id: "",  maker: "Selecione..." }];
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

  const onChangeHandlerlora = (prop) => (event) => {
    setLoraFilter({ ...search, [prop]: event.target.value });
  };

  const onChangeHandlermedidor = (prop) => (event) => {
    setMedidorFilter({ ...search, [prop]: event.target.value });
    console.log(medidor)
  };


  const fetchHydro = () => {
    let hydro = [];
    api.get("/hydrometers").then((response) => {
      response.data.map((elem) => {
        hydro.push({
          id: elem.OID_MEDIDOR,
          hydro: elem.NR_MEDIDOR,
        });
      });
      setHydro(hydro);
    });
  };

  const fetchLora = () => {
    
    let lora = [{ id: "",  lora: "Selecione..." }];
    api.get("/equipmentslora").then((response) => {
      response.data.map((elem) => {
        lora.push({
          id: elem.OID_EQUIPAMENTO_LORA,
          lora: elem.NR_EQUIPAMENTO,
        });
      });
      setLora(lora);
    });
  };

  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let body = {
      OID_MEDIDOR: medidor.maker,
      OID_EQUIPAMENTO_LORA: loraf.lora,   
      DS_LOCAL_INSTALACAO: search.region,
    
      
    };
    console.log(body);
    console.log(loraf);
    console.log(medidor);
    
    api.post("/registros/filter", body).then((response) => {
     
      if(response.data.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Nenhum Resultado Encontrado"
        })
        setShowList(false);
      } else {
        let arr = formatArray(response.data);
        Swal.fire({
          icon: "success",
          timer: 500
        })
        setValues(arr);
        setShowList(true);
        setSearch(initialState)
     
      }
    });
  };

  const formatArray = (data) => {
    let aux = [];
    data.map((kit) => {
     
      lora.map((lora) => {
        hydro.map((hydro) => {
        
          if( kit.OID_EQUIPAMENTO_LORA === lora.id && kit.OID_MEDIDOR === hydro.id) {
            aux.push({
              idKit: kit.OID_REGISTRO,
              idHydro: hydro.id,
              idLora: lora.id,
              hydro: hydro.hydro,
              lora: lora.lora,
              location: kit.DS_LOCAL_INSTALACAO,
              clock: kit.DS_RELOJOARIA_INICIAL,
              porta: kit.PORTA,
            })
           
          }
       
      })
    })
  })
    return aux;
    
  }
  

  useEffect(() => {
    fetchHydro();
    fetchLora();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Pesquisa | Equipamento KIT</label>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row" style={{ textAlign: "end" }}>

          

             


              {DS_STATUS == 10 ?

              
              <div className="col-12" style={{ alignSelf: "center" }}>
                <Button
                  icon="ti-agenda"
                  text="Cadastrar"
                  link="/cadastro/equipamentokit-cadastro"
                />
              </div>
              : null}
            </div>

            {DS_STATUS == 10?

          <div className="row">
          <div className="col-6">
            <Input
              id="idcondo"
              label="Condomínio"              
              options={[condos, "condo"]}
              value={lc.condo}
              styles={{ width: "100%" }}
              type="select"
                onChange={onChangeCondo("condo")}
            />
          </div></div>

    
        : null  }

              {/* <div className="row">
            <div className="col-6" style={{ textAlign: "start" }}>
                <Input
                  id="hydro"
                  label="Medidor"
                  value={search.hydro}
                  onChange={onChangeHandler("hydro")}
                  styles={{ width: "100%" }}
                />
              </div>
              </div> */}

              <div className="row">
            <div className="col-6" style={{ textAlign: "start" }}>
                <Input
                  id="fab-search"
                  label="Número Medidor"
                  options={[makers, "maker"]}
                  value={search.maker}
                  type="select"
                  onChange={onChangeHandlermedidor("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
              </div>
            
            
              <div className="row">
              <div className="col-6">
                <Input
                  options={[lora, "lora"]}
                  label="Módulo Lora"
                  value={lorae.lora}
                  type="select"
                  onChange={onChangeHandlerlora("lora")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>

            {/* <div className="row">
              <div className="col-6">
                <Input
                  id="lora"
                  label="Equipamento Lora"
                  value={search.lora}
                  onChange={onChangeHandler("lora")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div> */}
            <div className="row">
              <div className="col-6">
                <Input
                  id="location"
                  label="Localidade"
                  value={search.location}
                  onChange={onChangeHandler("location")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            
            {/* <div className="row">
              <div className="col-6">
                <Input
                  id="locationType"
                  label="Tipo de Localização"
                  type="select"
                  options={[locationTypeArray, "locationType"]}
                  value={search.locationType}
                  onChange={onChangeHandler("locationType")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div> */}
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
            "Medidor",
            "Número Equip. Lora",
            "Localização",            
            "Relog. Inic.",
            "Porta",
            "",
          ]}
          tableBody={[values, 3]}
          showTable={showList}
        >
          {/* {values?.map((kit, key) => (
            <td key={key}>
              <Link
                type="button"
                to={`/cadastro/equipamentokit-update/${kit.idKit}`}
                color="link"
                size="sm"
                className="btn-light waves-effect waves-light"
              >
                <i className="dripicons-document-edit" />
              </Link>
            </td>
          ))} */}
        </SearchTable>
      </div>
    </React.Fragment>
  );
};

export default EquipamentoKit;
