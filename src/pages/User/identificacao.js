import React, { useState , useEffect, useRef  } from "react";

import Input from "components/shared/Inputs/Inputs";
import Tooltip from "components/tooltip/Tooltip";
import { Button, Col, Container, Row } from "reactstrap";

import ReactInputMask from "react-input-mask";

import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/Auth.service";
import validator from 'validator';
import { useForm } from "react-hook-form";
// import QuestionMark from '@mui/icons-material/QuestionMark';
import './tool.css';
import { FaRocket } from 'react-icons/fa';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

import imgCDIMV from "../../assets/images/CDIMOVEL.png"
import imgNCONTA from "../../assets/images/NRCONTA.png"
import imgIDA from "../../assets/images/IDA.png"
import imgHIDRO from "../../assets/images/CDHIDRO.png"

const Identificacao = () => {

  
  const user = AuthService.getCurrentUser();

  // let localStorageItem = JSON.parse(localStorage.getItem('user') || '[]');
 
  // console.log(localStorageItem.user.DS_STATUS)
  
  // localStorageItem.user.DS_STATUS = null;

  // console.log(localStorageItem.user.DS_STATUS)
  // let  existing = localStorage.getItem('user');
  // // existing['DS_STATUS'] = 'null';
  // let data = null;

  // // localStorage.setItem('user', JSON.stringify(existing));
  // window.localStorage.setItem("user", JSON.stringify(localStorageItem));

  // console.log(localStorageItem)

  const[nivel,setNivel] = useState();
  let ni = '';
  let[idimovel,setIdImovel] = useState();
  
  const [isShowncd, setIsShowncd] = useState(false);
  const [isShownnr, setIsShownnr] = useState(false);
  const [isShownida, setIsShownida] = useState(false);
  const [isShownhid, setIsShownhid] = useState(false);

  let checkempresa = null;
    if(user != null){
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    }
    }

    useEffect(() => {
      api.get('/imovel/user/imoveis/'+user.user.OID_USUARIO).then((response) => {
         idimovel = {
          nome: response.data[0].DS_NOME +" "+ response.data[0].DS_SOBRENOME,
          comp: response.data[0].IM_COMPLEMENTO,
          bloco: response.data[0].IM_BLOCO,
          NM_RAZAO_SOCIAL: response.data[0].NM_RAZAO_SOCIAL,
          medidor: response.data[0].NR_MEDIDOR,
          imovelid: response.data[0].imovelid,
          
        };
        setIdImovel(idimovel)
       console.log(idimovel)
           
      });
    }, []);
  
   
    const errorAlert = (e) =>{
      Swal.fire({
        timer: 20000,
        text: e,
      });
    } 


  let navigate = useNavigate();

  const state = {
    countShowForm: 0,
  }

  const {register,setValue,getValues} = useForm();
  const [showState,setShowState] = useState(state.countShowForm)
  const [imovel, setImovel] = useState({})

  const [pessoa, setPessoa] = useState({})

  let [hidrometro, setHidrometro] = useState({})


  const previusState = (e) => {
    state.countShowForm = showState
    if(state.countShowForm > 0){
      state.countShowForm--
    }
    if(state.countShowForm != 4){
    }
    setShowState(state.countShowForm)
  }

  const Explainer = (
    <span className="w-56">Hover over to see content. This content is a DOM element</span>
  )
  
  const ExplainerComplex = (
    <div className="w-56 flex flex-col justify-center space-y-2">
      <span>Hover over to see content. This content is a DOM element</span>
      <input className="rounded p-2 text-black" placeholder="Type something.." />
    </div>
  )



  const personalInformation = (e) =>{
   


      if (nivel == undefined || nivel == 'undefined'){
        
        
        
        
        setNivel({
          nivelp: 1
          
        })

      }

      
      let cpf = getValues("DS_CPF").replace(/\D/g,'');
      let cpfi = getValues("DS_CPF");
      
        if(cpf.length < 11){
          errorAlert("Favor digitar um CPF válido.")
          return
        }

        if(
          cpf === "00000000000" ||
          cpf === "11111111111" ||
          cpf === "22222222222" ||
          cpf === "33333333333" ||
          cpf === "44444444444" ||
          cpf === "55555555555" ||
          cpf === "66666666666" ||
          cpf === "77777777777" ||
          cpf === "88888888888" ||
          cpf === "99999999999"
          
          ){
          errorAlert("Favor digitar um CPF válido.")
          return
        }
        let i = 0;
      let Soma = 0;
      let Resto = 0;

      for (i=1; i<=9; i++){
          Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);

        Resto = (Soma * 10) % 11

      }
        if ((Resto == 10) || (Resto == 11)) {
          Resto = 0
        }
        if (Resto != parseInt(cpf.substring(9, 10)) ){
          errorAlert("Favor digitar um CPF válido.")
          return 
        }


     Soma = 0

          for (i = 1; i <= 10; i++){
              Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i)

            Resto = (Soma * 10) % 11
          }
      if ((Resto == 10) || (Resto == 11)) {
        Resto = 0
      }
      if (Resto != parseInt(cpf.substring(10, 11) ) ){
        errorAlert("Favor digitar um CPF válido.")
        return 
      }


    let sobrenomev = getValues("DS_SOBRENOME")
    let telefonev = getValues("NR_TELEFONE")
    

    // if(nomev.length < 2){
    //   Swal.fire({       
    //     icon: "warning",
    //     text: "favor Colocar o Nome"
    //   })
    //   return
    // }

    // if(sobrenomev.length < 2){
    //   Swal.fire({       
    //     icon: "warning",
    //     text: "favor Colocar o Sobrenome"
    //   })
    //   return
    // }

    if(telefonev.length < 6){
      Swal.fire({       
        icon: "warning",
        text: "favor Colocar o Telefone"
      })
      return
    }

      setPessoa({
        DS_CPF: cpfi,
        NR_TELEFONE : telefonev,
        
      })


      
      setShowState(1)
      return
    
    
  }


  const companyData = (e) =>{
    
    const imovelv = getValues("NR_IMOVEL")
    const conta = getValues("NR_CONTA")
    const ida = getValues("NR_IDA")
    

    const hidrov = getValues("NR_HIDROMETRO")

    
    

    if(hidrov != null || hidrov != undefined)
    {

    if(hidrov.length < 3){
      Swal.fire({       
        icon: "warning",
        text: "favor Colocar o Código do Hidrometro(Medidor)"
      })
      return
    }
  }

    if(conta.length < 1){
      Swal.fire({       
        icon: "warning",
        text: "favor Colocar o Nr Conta"
      })
      return
    }

    if(ida.length < 1){
      Swal.fire({       
        icon: "warning",
        text: "favor Colocar o Nr ida"
      })
      return
    }
    
      if(imovelv.length < 6){
      

      
        Swal.fire({       
          icon: "warning",
          text: "favor Digitar um Código de Imovel válido!"
        })
        return
        
      }
     
     
         api.get('/imovel/user/'+user.user.OID_USUARIO).then((response) => {
              
        
          
        const OID_IMOVELres = response.data[0].OID_IMOVEL;



        setImovel({
          OID_IMOVEL: OID_IMOVELres,
          NR_IMOVEL:imovelv,
          NR_CONTA:conta,
          NR_IDA: ida,
          US_NIVEL: nivel.nivelp,
        })

         console.log(imovel)
        console.log(OID_IMOVELres)

      setHidrometro({
        OID_IMOVEL: idimovel.imovelid,
        NR_HIDROMETRO: hidrov,
        DS_DESCRICAO_HIDROMETRO: "AP/CASA "+idimovel.comp + " " +idimovel.bloco,
        DS_MODELO_HIDROMETRO: "Novo Modelo",
      })
      console.log(pessoa)


      api.put("/user/"+user.user.OID_USUARIO,pessoa).then((response) => {

        let im = {
          OID_IMOVEL: OID_IMOVELres,
          CD_IMOVEL:imovelv,
          NR_CONTA:conta,
          NR_IDA: ida,
          US_NIVEL: nivel.nivelp,
        }

        let hidro = {
          OID_IMOVEL: OID_IMOVELres,
        NR_MEDIDOR: hidrov,
        DS_DESCRICAO_MEDIDOR: "AP/CASA "+idimovel.comp + " " +idimovel.bloco,
        DS_MODELO_MEDIDOR: "Novo Modelo",
        }
        

       
        api.put("/imovel/"+OID_IMOVELres,im).then((response) => {


     if(hidrov != undefined && hidrov != ''){

          api
          .post("/hydrometers/", hidro )
          .then((response) => {
           
         let localStorageItem = JSON.parse(localStorage.getItem('user') );
 
        localStorageItem.user.DS_STATUS = null;

        window.localStorage.setItem("user", JSON.stringify(localStorageItem));



              Swal.fire({
                icon: "success",
                text: "Registro Cadastrado com sucesso!",
                timer: 5000,
              }).then(() => {
                window.location.reload();
                navigate("/");
              });  
             
          }).catch(function (error) {
            console.log(error);
            Swal.fire({
              icon: "warning",
              text: "Erro",
            });
          });
        }

       else{

          let localStorageItem = JSON.parse(localStorage.getItem('user') );
 
          localStorageItem.user.DS_STATUS = null;
  
          window.localStorage.setItem("user", JSON.stringify(localStorageItem));
  
  
  
                Swal.fire({
                  icon: "success",
                  text: "Registro Cadastrado com sucesso!",
                  timer: 5000,
                }).then(() => {
                  window.location.reload();
                  navigate("/");
                });
        }
        

      }).catch(function (error) {
        console.log(error);
        Swal.fire({
          icon: "warning",
          text: "O código do Imóvel já foi cadastrado no nosso Sistema",
        });
      });


      }).catch((error) => {
        if (!error?.response) {
        Swal.fire({
        
            
          icon: "warning",
          text: "Serviço Temporariamente Indisponivel"
        })
        
        }
        else if (error.response?.status === 400) {
          Swal.fire({       
            icon: "warning",
            text: "Email já cadastrado"
          })
          }
    
    console.log(error);
    })


     // console.log(phone)
      
    })
  
  
    
  }




  return (
    <React.Fragment>
    <div className="page-content">
      <label id="component-title">Cadastro | Morador</label>
      <Col md={8}>
              
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item active">
                 Preencha os dados para completar seu cadastro {idimovel ? "para o condominio " + idimovel.NM_RAZAO_SOCIAL+", AP/CASA "+idimovel.comp +"." : "."}
                </li>
              </ol>
            </Col>
   

   
      <form className="component-form container" style={{ margin: "0px" }}>
      {showState == 0?
        <div className="container">
        
          <div className="row">

            <div className="col-6">
            <label
                      className="col-md-12 col-form-label"
                    >CPF*
                    </label>
              <ReactInputMask
              {...register("DS_CPF")}
               
              mask ="999.999.999-99"
              type="text"
              defaultValue=""
              className="form-control form-control-lg"
               
                required
              />
            </div>
          </div>
          {/* <div className="row">
            <div className="col-6">
            <label
                      className="col-md-12 col-form-label"
                    >Sobrenome*
                    </label>
              <input
               {...register("DS_SOBRENOME")}
             
               type="text"
               defaultValue=""
               className="form-control form-control-lg"
                
                required
              />
            </div>
          </div>
          */}
          <div className="row">
            <div className="col-6">
            <label
                      className="col-md-12 col-form-label"
                    >Telefone*
                    </label>
              <ReactInputMask
              {...register("NR_TELEFONE")}
                mask ="(99)99999-9999"
                
              
                className="form-control form-control-lg"
              
                
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-3">
            <label
                      className="col-md-12 col-form-label"
                    >Sou Proprietário
                    </label>
              <input
               type="radio"
                id="pro"
                
                value="1"
                name="nivel"
                onChange={e=>setNivel(e.target.value)}
                checked
              />
            </div>

            <div className="col-3">
            <label
                      className="col-md-12 col-form-label"
                    >Sou Inquilino
                    </label>
              <input
               type="radio"
                id="inq"
                
                value="2"
                name="nivel"
                onChange={e=>setNivel(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-4 col-sm-6">
                <Button
                          color="info"
                          className="btn-lg btn-primary ml-5"
                          type="button"
                          value='1'
                          onClick={personalInformation}
                        
                      >
                        Continuar
                      </Button>
               </div>
          
        </div>
        : null }

{showState == 1 ?

<div className="container">
        
       

           <div className="mb-3 col-6 ">

                <div className="form-group">
                
                <div className="displayflex">
                  <label 
                    className="">Código do Imovel * 
                  
                  </label>
                  <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  /></div>
                 
                 </div>
                 {isShowncd && (
                <div className= {`box-right arrow-bottom`}><div>
                 <img src={imgCDIMV}  alt="CD" />
                </div> </div> 
                 )}
    
                  <input
                        {...register("NR_IMOVEL")}
                       
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                </div>
              </div>

              

              <div className="mb-3 col-6">

                <div className="form-group">

                <div className="displayflex">
                  <label  className="">Número da Conta*</label>

                <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShownnr(true)}
                  onMouseOut={() => setIsShownnr(false)}
                  /></div>

                </div>
                {isShownnr && (
                <div className= {`box-right arrow-bottom`}><div>
                 <img src={imgNCONTA}  alt="CD" />
                </div> </div> 
                 )}
                  
                  <input
                       {...register("NR_CONTA")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                </div>
              </div>
              <div className="mb-3 col-6">

                <div className="form-group">
                <div className="displayflex">

                  <label  className="">código I.D.A*</label>

                  <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShownida(true)}
                  onMouseOut={() => setIsShownida(false)}
                  /></div>

                  </div>
                  {isShownida && (
                <div className= {`box-right arrow-bottom`}><div>
                 <img src={imgIDA}  alt="CD" />
                </div> </div> 
                 )}
                  <input
                         {...register("NR_IDA")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                </div>
              </div>

              { idimovel.medidor == null ? 

              <div className="mb-3 col-6">

                <div className="form-group">

                <div className="displayflex">
                  <label  className="">Código Hidrômetro (Medidor) * </label>
                  <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShownhid(true)}
                  onMouseOut={() => setIsShownhid(false)}
                  /></div>

                  </div>
                  {isShownhid && (
                <div 
                 className= {`box-right arrow-bottom`}><div>
                 <img src={imgHIDRO}  alt="CD" />
                </div> </div> 
                 )}
                  <input
                  {...register("NR_HIDROMETRO")}
                       
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                        required
                      />
                </div>
              </div>
: ""
                  }

             

              
             
              <div className="mb-3 col-6 row">
                <div className="col-sm-6">
                  <div className="">
                    <a>
                  <span onClick={previusState}><i className="ti-angle-left"></i> Voltar </span>
                  </a>
                  </div>
                </div>
                <div className="text-end col-sm-6">
                <Button
                          color="info"
                          className="btn-lg btn-primary ml-5"
                          type="button"
                          value='1'
                          onClick={companyData}
                        
                      >
                        Registrar
                      </Button>
               </div>
             </div>
        
    
      </div>
: null }
        
      </form>
    </div>
  </React.Fragment>
  );
};

export default Identificacao;
