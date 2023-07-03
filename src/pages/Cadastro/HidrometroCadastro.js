import React, { useState, useEffect } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";

import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/Auth.service";

const HidrometroCadastro = () => {
  let navigate = useNavigate();
  const initialState = {
    number: "",
    desc: "",
    model: "",
    pulse: ""
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

    let stateempresa = null;
    let [makers, setMakers] = useState([]);
    const [condos, setCondo] = useState([]);
  let [lc, setLc] = useState (Empresa);
  const [imovelid, setImo] = useState(initialState);
  const [search, setSearch] = useState(initialState);


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
    checkempresa = event.target.value;
   
  
    fetchimoCondo();
    
  };


  const fetchimoCondo = () => {
    let maker = [{ id: "",  maker: "Selecione..." }];
    api.get("/imovel/"+checkempresa).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_IMOVEL,
          maker: elem.imovel,
         
          
        });
      });
      setMakers(maker);
    });
  };

  useEffect(() => {
    fetchimoCondo();
    
  }, []);


  const onChangeHandlerimo = (prop) => (event) => {
    setImo({ ...search, [prop]: event.target.value });
    console.log(imovelid)
  };

  const [register, setRegister] = useState(initialState);

  const onChangeHandler = (prop) => (event) => {
    setRegister({ ...register, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();


    if(checkempresa == null){
      checkempresa = lc.condo;
    }
    console.log(lc)

    if(imovelid.maker == null){
      Swal.fire({       
        icon: "warning",
        text: "Selecione um Imóvel para cadastrar o Medidor"
      })
      return
    }
    
    if(register.number < 1){
      Swal.fire({       
        icon: "warning",
        text: "favor Colocar o Número do Hidrometro"
      })
      return
    }

    

    let imovel = {
    
      OID_CONDOMINIOATUAL: checkempresa
    }
    const body = {
      NR_HIDROMETRO: register.number,
      DS_DESCRICAO_HIDROMETRO: register.desc,
      DS_MODELO_HIDROMETRO: register.model,
      NR_CONSUMO_LITROS: register.pulse,
      TP_ATIVO: "N"
    }

    
     
      let hidro = {
        OID_IMOVEL: imovelid.maker,
        NR_MEDIDOR: body.NR_HIDROMETRO,
        DS_DESCRICAO_MEDIDOR: body.DS_DESCRICAO_HIDROMETRO,
        DS_MODELO_MEDIDOR: body.DS_MODELO_HIDROMETRO,
        NR_CONSUMO_LITROS: body.NR_CONSUMO_LITROS,
        TP_ATIVO: "S"
        
      };
      console.log(hidro)
     
     
        api.post("/hydrometers", hidro).then(() => {
          Swal.fire({
            icon: "success",
            title: "Medidor Cadastrado"
          })
        }).catch((error) => {
          Swal.fire({
            icon: "warning",
            text: "Esse Imóvel já possui um medidor."
          })
          console.log(error);
        })
       
       
   


   
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastrar | Medidor</label>
     
              
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item active">
                 Preencha os dados para cadastrar um medidor ao Imóvel selecionado
                </li>
              </ol>
            
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/cadastro/hidrometro"
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
                  label="Imóvel *"
                  type="select"
                  options={[makers, "maker"]}
                      value={search.maker}
                      onChange={onChangeHandlerimo("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="number"
                  label="Número Medidor"
                  value={register.number}
                  onChange={onChangeHandler("number")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="desc"
                  label="Descrição"
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
                  label="Modelo"
                  value={register.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="pulse"
                  label="Pulso/Litro"
                  value={register.pulse}
                  onChange={onChangeHandler("pulse")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
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

export default HidrometroCadastro;
