import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import PropTypes from "prop-types";
import ReactInputMask from "react-input-mask";

import { Link, useParams } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import Swal from "sweetalert2";
import validator from 'validator';
import "./InitialPage.css";
import logoBranco from "../../assets/images/logo-sm.png"
// import useAuth from '../../services/useAuth';
// import AuthService from '../../services/Auth.service';
// import { AvField, AvForm } from "availity-reactstrap-validation";
import '../User/tool.css';
import api from '../../services/api';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import logoSys from "../../assets/images/logo-sys.png";

import imgCDIMV from "../../assets/images/CDIMOVEL.png"
import imgNCONTA from "../../assets/images/NRCONTA.png"
import imgIDA from "../../assets/images/IDA.png"
import imgHIDRO from "../../assets/images/CDHIDRO.png"


// const USER_REGEX = /^{8,43}$/;
// const USER_REGEX = /^[a-z]{3,23}$/;
// // const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;
// const PWD_REGEX = /^[A-z](?=.*[0-9]){6,24}$/;
// const REGISTER_URL = '/user/user';


const CadastroEmpresa = () => {


  const [showd,setShowd] = useState(true);
  const handleChange = () => { 
    
    setShowd(!showd); 
    
  }; 
  const [isShowncd, setIsShowncd] = useState(false);
  const [isShownnr, setIsShownnr] = useState(false);
  const [isShownida, setIsShownida] = useState(false);
  const [isShownhid, setIsShownhid] = useState(false);
  // const [consumptions, setConsumptions] = useState([]);
  const state = {
      countShowForm: 0,
    }
  


  const {register,setValue,getValues} = useForm();
  const [showState,setShowState] = useState(state.countShowForm)
  const [adress, setAdress] = useState({})
  const [company, setCompany] = useState({})
   const [user, setUser] = useState({})

   const [imovel, setImovel] = useState({})

   let [hidrometro, setHidrometro] = useState({})

  // console.log(hidrometro.NR_HIDROMETRO)
  // let teste = '';
  // console.log(hidrometro.NR_HIDROMETRO)

  // if(hidrometro.NR_HIDROMETRO != ''){
  //   teste = 'testeund'
  // }
  // if(hidrometro.NR_HIDROMETRO == ''){
  //   teste = 'und'
  // }
  // console.log(teste)
    
  const confirmSubmit =(data) =>{
    // console.log(company)
     //console.log(adress)
     //console.log(user)
     
   
  
  
       api
       .post("/user/user", user)
       .then((response) => {

        const companyData = 
        {"NR_CNPJ": company.NR_CNPJ,
        "NM_RAZAO_SOCIAL":company.DS_RAZAO_SOCIAL,
        "NR_TELEFONE":company.DS_TELEFONE,
        "CD_CEP":adress.NR_CEP.replace(/\D/g,''),
        "DS_LOGRADOURO":adress.DS_LOGRADOURO,
        "DS_BAIRRO":adress.DS_BAIRRO,
        "NR_LOGRADOURO":adress.NR_NUMERO,
        "DS_COMPL_LOGR":getValues('DS_COMPLEMENTO')?getValues('DS_COMPLEMENTO'):'N/A' ,
        "NM_CIDADE":adress.DS_CIDADE,
        "CD_ESTADO":adress.DS_ESTADO,
        "DS_PAIS":"Brasil",
        "CNPJCHECK":getValues("NR_CNPJ").replace(/\D/g,''),
        "OID_USUARIO": response.data.OID_USUARIO
      
      
      }

      console.log(companyData)



         api
         .post("/empresa/empresa", companyData )
         .then((res) => {

          console.log(res.data)

            let body = {
              OID_EMPRESA: res.data.OID_EMPRESA,
              CD_IMOVEL: imovel.CD_IMOVEL,
              NR_CONTA: imovel.NR_CONTA,
              NR_IDA: imovel.NR_IDA,
              OID_PROPRIETARIO: res.data.OID_USUARIO,
            };
            console.log(res)
          
          const idempresa = res.data.OID_EMPRESA;
          // setImovel({
          //   OID_EMPRESA: getValues(res.data[0].OID_EMPRESA)
     
          // })
        
          api
          .post("/imovel/imovel", body )
          .then((response) => {
           
            let hidro = hidrometro;
        if(hidrometro.NR_HIDROMETRO != undefined && hidrometro.NR_HIDROMETRO != ''){
            

            hidro = {
              OID_IMOVEL: response.data.OID_IMOVEL,
              NR_MEDIDOR: hidrometro.NR_HIDROMETRO,
              DS_DESCRICAO_MEDIDOR: "Master",
              DS_MODELO_MEDIDOR: "Novo Modelo"
              
            };
            console.log(hidro)

            api
          .post("/hydrometers/", hidro )
          .then((response) => {
           
            setShowState(5)
            Swal.fire({
              icon: "success",
              text: "Seu cadastro foi realizado com sucesso!",
              timer: 8000,
            });   
             
          }).catch(function (error) {
            console.log(error);
            Swal.fire({
              icon: "warning",
              text: "O código do Imóvel já foi cadastrado no nosso Sistema",
            });
          });
        }
        else{
          setShowState(5)
            Swal.fire({
              icon: "success",
              text: "Seu cadastro foi realizado com sucesso!",
              timer: 8000,
            });   
            }
             
          }).catch(function (error) {
            console.log(error);
            Swal.fire({
              icon: "warning",
              text: "O código do Imóvel já foi cadastrado no nosso Sistema",
            });
          });
      
         }).catch(function (error) {
           console.log(error);
           Swal.fire({
             icon: "warning",
             text: "Não foi possível realizar o cadastro da empresa",
           });
         });
 
            
       })
       .catch(function (error) {
         console.log(error);
         Swal.fire({
           icon: "warning",
           text: "E-mail/CPF já cadastrados no nosso sistema",
         });
       });
 
    
   }
 
   const errorAlert = (e) =>{
     Swal.fire({
       timer: 200000,
       text: e,
     });
   } 
   const checkCep = (e) =>{
     const cep = e.target.value.replace(/\D/g,'');
     if(cep.length ==8){
       fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res =>res.json()).then(data=>{
         setValue('DS_LOGRADOURO',data.logradouro)
         setValue('DS_COMPLEMENTO',data.complemento)
         setValue('DS_BAIRRO',data.bairro)
         setValue('DS_CIDADE',data.localidade)
         setValue('DS_ESTADO',data.uf)
 
 
       })
    }
   }

   const companyRegistration = (e) => {
    //  const recaptcha = getValues("confirmaRecaptcha")
      //if(recaptcha){
        if(showd){
         
      const cnpj = getValues("NR_CNPJ").replace(/\D/g,'');
  
        if(cnpj.length >13){
          const checkCnpj = {"NR_CNPJ": getValues("NR_CNPJ")}
          console.log(checkCnpj)
         
          api
      .get(`/empresa/`+cnpj)
      .then((response ) => {
      
      //   .post("/empresa/check",checkCnpj )
      // .then((response ) => {
        // console.log(response.data.validRegistration)
       
       
         console.log(response)
         console.log(response.data[0])
        
  
         
  
    
          if(response.data[0]===undefined){
            fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`).then(res =>res.json()).then(data=>{
              if(data.razao_social){ 
                setValue('DS_RAZAO_SOCIAL',data.razao_social)
                setValue('CNPJ',getValues("NR_CNPJ"))
                setShowState(1)          
              }else{
                Swal.fire({
                  icon: "error",
                  timer: 9000, 
                  title: 'CNPJ inválido',
                  text: '',
                });
    
              }
            
      //75.315.333/0030-43
      //01737672000147
            }).catch(function (error){
              console.log(error);
              Swal.fire({
                icon: "error",
                timer: 9000,
                text: 'Serviço temporáriamente indisponível',
              });
            })
  
  
  
          }
          else{
            Swal.fire({
              icon: "error",
              timer: 9000, 
              title: 'CNPJ Já Cadastrado',
              text: '',
            });
          }
  
      })
  
  
        }else{
          errorAlert("verifique o CNPJ digitado e tente novamente")
        }  
        
      //}else{
      //errorAlert("Preencha o recaptcha")
      //}
      }
      else{
        setShowState(1)  
      }

  }
    const companyData = (e) =>{
      let phone = getValues("DS_TELEFONE").replace(/\D/g,'')
      let imovel = getValues("CD_IMOVEL")
      let raz = getValues("DS_RAZAO_SOCIAL")
      let ida = getValues("CD_IMOVEL")
      let med = getValues("NR_HIDROMETRO")
      if(ida.length < 3){
        errorAlert("Favor Digitar um Código IDA válido!")
      }
      if(med.length < 3){
        errorAlert("Favor Digitar um Medidor  válido!")
      }

      if(raz.length < 3){
        errorAlert("Favor Preencher Razão Social Corretamente")
      }

      if(phone.length == 10 || phone.length == 11){
        if(imovel.length > 6 && ida.length > 3 && med.length > 3 && raz.length > 3  ){
        setCompany({
          NR_CNPJ:getValues("CNPJ"),
          DS_RAZAO_SOCIAL:getValues("DS_RAZAO_SOCIAL"),
          DS_TELEFONE: getValues("DS_TELEFONE")
        })
        setImovel({
          CD_IMOVEL:getValues("CD_IMOVEL"),
          NR_CONTA:getValues("NR_CONTA"),
          NR_IDA: getValues("NR_IDA")
        })

        setHidrometro({
          NR_HIDROMETRO:getValues("NR_HIDROMETRO"),
          
        })
       // console.log(phone)
        setShowState(2)
      }
      else{
        errorAlert("Favor Preencher os campos Obrigátorios Corretamente!")
      }
    }
    else{
      errorAlert("Favor preencher o Telefone!")
    }
      
    }
    const addressInformation = (e) =>{
      const addressInfo = getValues(["NR_CEP","DS_LOGRADOURO","DS_BAIRRO","NR_NUMERO","DS_CIDADE","DS_ESTADO"])
      let counter =0
     // console.log(addressInfo)
      addressInfo.forEach(info=>{
        if(!info){
          counter++
        }
      })
      if(counter ==0){
        setAdress({
          "NR_CEP":addressInfo[0],
          "DS_LOGRADOURO":addressInfo[1],
          "DS_BAIRRO":addressInfo[2],
          "NR_NUMERO":addressInfo[3].replace(/\D/g,''),
          "DS_CIDADE":addressInfo[4],
          "DS_ESTADO":addressInfo[5],
         
        })
        setShowState(3)
      }else{
        errorAlert("Favor preencher todos os dados!")
      }
      
    }
    const personalInformation = (e) =>{
      const personalInfo = getValues(["DS_NOME","DS_SOBRENOME","NR_TELEFONE","DS_EMAIL","CLIENT_SECRET","DS_CONFIRMASENHA"])
      let counter =0
      personalInfo.forEach(info=>{
        if(!info){
          counter++
        }
      })
      if(personalInfo[4] != personalInfo[5]){
        errorAlert("Favor verificar as senhas digitadas.")
        return
      }

      const cpf = getValues("DS_CPF").replace(/\D/g,'');
      
      if(cpf.length < 11){
        errorAlert("Favor digitar um cpf válido.")
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
      // let x = 0;
      // let y = 0;

      // let a = [];
      // let b = '';
      // let c = 11;
      // for (i = 0; i < 11; i++) {
      //   a[i] = cpf.charAt(i);
      //   if (i < 9) b += a[i] * --c;
      // }
      // if ((x = b % 11) < 2) {
      //   a[9] = 0;
      // } else {
      //   a[9] = 11 - x;
      // }
      // b = 0;
      // c = 11;
      // for (y = 0; y < 10; y++) b += a[y] * c--;
      // if ((x = b % 11) < 2) {
      //   a[10] = 0;
      // } else {
      //   a[10] = 11 - x;
      // }
      // if (cpf.charAt(9) != a[9] || cpf.charAt(10) != a[10]) {
      //   errorAlert("Favor digitar um CPF válido.")
      //   return
      // }


    
  
      if(counter ==0){
        if(!validator.isEmail(personalInfo[3])){
          errorAlert("Favor digitar um email válido.")
          return
        }
        setUser({
          "DS_NOME":personalInfo[0],
          "DS_SOBRENOME":personalInfo[1],
          "NR_TELEFONE":personalInfo[2],
          "DS_EMAIL":personalInfo[3],
          "CLIENT_SECRET":personalInfo[4],
          "DS_CPF":getValues("DS_CPF")
         // aceitaContato:getValues("confirmaCheck")
        })
        setShowState(4)
        return
      }else{
        errorAlert("Favor preencher todos os dados!")
        return
      }
      
  
    }
  
    const previusState = (e) => {
      state.countShowForm = showState
      if(state.countShowForm > 0){
        state.countShowForm--
      }
      if(state.countShowForm != 4){
      }
      setShowState(state.countShowForm)
    }
    
  
  



    return (
        
       
<React.Fragment>

<div className="bg-syswater">
                
     
        <title>Cadastro da Empresa</title>
      
      <div className="account-pages ">
        <Container>
        
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="overflow-hidden imagembg">
                <div className="bg-primary">
                  <div className="text-primary text-center p-4">
                    <h5 className="text-white font-size-20">Bem vindo!</h5>
                    <p className="text-white font-size-15">Cadastro destinado a Pessoas Jurídicas(PJ)</p>
                    <Link to="/" className="logo logo-admin">
                      <img src={logoBranco}  alt="logo" />
                    </Link>
                  </div>
                </div>

          <div className="p-4 card-body">
          <div className="p-3">
          {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{color:"red"}}>{errMsg}</p> */}
  {showState == 0?
            <div  className="form-horizontal mt-4 av-valid">
            
              <div className="mb-3">

              
                <div className="form-group">
                  <label  className="">CNPJ <span >*</span></label>
                  {showd ? 
                  <ReactInputMask
                        {...register("NR_CNPJ")} //onBlur={checkCnpj}
                        mask = "99.999.999/9999-99"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                        style={{textAlign: "center",fontSize: '20px' }}
                       
                      />
                  : <input
                 
                  
                  className="form-control form-control-lg"
                  type="text"
                  defaultValue=""
                  value="Clique em Continuar"
                  disabled
                  style={{textAlign: "center",fontSize: '20px' }}
                 
                />}
                </div>

              </div>
             
              <div className="mb-3 row">
                <div className="col-sm-4">
                  <div className="">
                    <p>
                    Já possui Cadastro?<br />
                    <span className="line">
                        <Link to="/login/juridico">Entrar</Link>
                    </span>
                    </p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="">
                    <p>
                    Não Possui CNPJ?<br />
                    <span className="line">
                    <input
                type="checkbox"
                
                onChange={() => setShowd(!showd)}
              ></input>
                    </span>
                    </p>
                  </div>
                </div>
                <div className="text-end col-sm-4">
                <Button
                        color="info"
                        className="btn-lg btn-primary"
                        type="button"
                        value='1'
                        onClick={companyRegistration}
                      >
                        Continuar
                      </Button>
                </div>
              </div>
             
            </div>
  : null }
 {showState == 1 ? 
             <div  className="form-horizontal mt-4 av-valid">
            
            <h6 className="page-title">Informações do Condomínio</h6>
             <div className="mb-3">

             {showd ? 
               <div className="form-group">
              
               
                 <label  className="">CNPJ*</label>
                 <input
                        {...register("CNPJ")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                        disabled

                      />
              
                </div>
             : ""}
              </div>
            
              <div className="mb-3">

                <div className="form-group">
                  <label  className="">Razão Social *</label>
                  <input
                        {...register("DS_RAZAO_SOCIAL")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                        

                      />
                 
                </div>
              </div>

              <div className="mb-3">

                <div className="form-group">
                <div className="displayflex">
                  <label  className="">Código do Imóvel do Condomínio *</label>
                  <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  /></div>
                  </div>

                  {isShowncd && (
                <div  className= {`box-right arrow-bottom`}><div>
                 <img src={imgCDIMV}  alt="CD" />
                </div> </div> 
                 )}

                  <input
                        {...register("CD_IMOVEL")}
                       
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                </div>
              </div>

              <div className="mb-3">

                <div className="form-group">
                  <label  className="">Telefone*</label>
                  <ReactInputMask
                        {...register("DS_TELEFONE")}
                        mask ="(99)99999-9999"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                </div>
              </div>

              <div className="mb-3">

                <div className="form-group">
                <div className="displayflex">
                  <label  className="">Número da Conta do Condomínio *</label>

                  <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShownnr(true)}
                  onMouseOut={() => setIsShownnr(false)}
                  /></div>

                </div>
                {isShownnr && (
                <div  className= {`box-right arrow-bottom`}><div>
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
              <div className="mb-3">

                <div className="form-group">
                <div className="displayflex">
                  <label  className="">Código I.D.A do Condomínio *</label>

                  <div className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShownida(true)}
                  onMouseOut={() => setIsShownida(false)}
                  /></div>

                  </div>
                  {isShownida && (
                <div 
                 className= {`box-right arrow-bottom`}><div>
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
              <div className="mb-3">

                <div className="form-group">
                <div className="displayflex">
                  <label  className="">Nº Medidor(Hidrômetro) Principal do Condomínio *</label>

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
             
              <div className="mb-3 row">
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
                        Continuar
                      </Button>
               </div>
             </div>
            
           </div>
: null}

{showState == 2 ?  
                    <div  className="form-horizontal mt-4 av-valid">
                    
                  <h6 className="page-title">Informações de endereço do condomínio</h6>

                   
                    <label
                      className="col-md-12col-form-label"
                    >CEP*
                    </label>
                      <ReactInputMask
                        {...register("NR_CEP")} onBlur={checkCep}
                        mask ="99999-999"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                    <label
                      className="col-md-12col-form-label"
                    >Logradouro*
                    </label>
                      <input
                        {...register("DS_LOGRADOURO")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                      <Row>
                      <Col lg={6}>
                        <label
                        className="col-md-12col-form-label"
                      >Bairro*
                      </label>
                        <input
                          {...register("DS_BAIRRO")}
                          className="form-control form-control-lg w-100"
                          type="text"
                          defaultValue=""
                        />
                        </Col>
                         <Col lg={6}>
                        <label
                        className="col-md-12col-form-label"
                        >Número*
                        </label>
                        <input
                          {...register("NR_NUMERO")}
                          className="form-control form-control-lg w-100"
                          type="number"
                          defaultValue=""
                          maxLength={10}
                        />
                        </Col>
                      </Row>
                      <label
                      className="col-md-12col-form-label"
                    >Complemento
                    </label>
                      <input
                        {...register("DS_COMPLEMENTO")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                      <label
                      className="col-md-12col-form-label"
                    >Cidade*
                    </label>
                      <input
                        {...register("DS_CIDADE")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                        
                      />
                                            <label
                      className="col-md-12col-form-label"
                    >Estado*
                    </label>
                      <input
                        {...register("DS_ESTADO")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                        maxLength="2"
                        placeholder="MG"
                        
                      />
                                            <label
                      className="col-md-12col-form-label"
                    >País*
                    </label>
                      <input
                        {...register("DS_PAIS")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue="Brasil"
                     
                      />

                  <div className="mb-3">
                  </div>
                    <div className="mb-3 row">

                    <div className="col-sm-6 mt-2">
                    <a>
                  <span onClick={previusState}><i className="ti-angle-left"></i> Voltar </span>
                  </a>
                  </div>
                  <div className="text-end col-sm-6">
                      <Button
                        color="info"
                        className="btn-lg btn-primary ml-2"
                        type="button"
                        value='1'
                        onClick={addressInformation}
                      >
                        Continuar
                      </Button>
                      
                    </div>
                    </div>
                  
                 
</div>
: null}
{showState == 3 ?  
 <div  className="form-horizontal mt-4 av-valid">
  <Row> 
          <Col lg={12}>
           <div className="page-title-box">
                  <Row className="mb-3" >
                  <h6 className="page-title">Informações Pessoais do Síndico</h6>
                  <div className="col-md-12">
                     

                    <div className="col-md-12">
                   
                    <label
                      className="col-md-12col-form-label"
                    >Nome*
                    </label>
                      <input
                        {...register("DS_NOME")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                    <label
                      className="col-md-12col-form-label"
                    >Sobrenome*
                    </label>
                      <input
                        {...register("DS_SOBRENOME")}
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      /><label
                      className="col-md-12col-form-label"
                    >Telefone*
                    </label>
                      <ReactInputMask
                        {...register("NR_TELEFONE")}
                        mask ="(99)99999-9999"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                      <label
                      className="col-md-12 col-form-label"
                    >CPF*
                    </label>
                      <ReactInputMask
                        {...register("DS_CPF")}
                        mask ="999.999.999-99"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue=""
                      />
                    <label
                      className="col-md-12col-form-label"
                    >Email*
                    </label>
                      <input
                        {...register("DS_EMAIL")}
                        className="form-control form-control-lg "
                        type="email"
                        placeholder="exemplo@email.com"
                        defaultValue=""
                      />
                      <p
                          {...register("validemail")}
                          />
                       <Row>
                      <Col lg={6}>
                    <label
                      className="col-md-12 col-form-label"
                    >Senha*
                    </label>
                      <input
                        {...register("CLIENT_SECRET")}
                        className="form-control form-control-lg w-100"
                        type="password"
                        defaultValue=""
                        maxLength={10}
                      />
                      </Col>
                      <Col lg={6}>
                    <label
                      className="col-md-12 col-form-label"
                    >Confirmar Senha*
                    </label>
                      <input
                        {...register("DS_CONFIRMASENHA")}
                        className="form-control form-control-lg "
                        type="password"
                        defaultValue=""
                        maxLength={10}
                      />
                     
                      
                      
                      </Col>
                      </Row>
                      <p><input
                      {...register("confirmaCheck")}
                      type="checkbox"
                      /> Aceito receber conteúdos e promoções por email.</p>
                                                      

                    </div>
                    <div className="mb-3">
                  </div>
                    <Row className="mb-3">
                    <div className="col-sm-6 ">
                    <a>
                  <span onClick={previusState}><i className="ti-angle-left"></i> Voltar </span>
                  </a>
                  </div>
                  <div className="text-end col-sm-6">
                      <Button
                        color="info"
                        className="btn-lg btn-primary"
                        type="button"
                        value='1'
                        onClick={personalInformation}
                      >
                        Continuar
                      </Button>
                    </div>
                  </Row>
                    
                  </div>
                  </Row>
            </div>
          </Col>
        </Row>
  </div>
: null}
  {showState == 4 ?  
    <div  className="form-horizontal mt-4 av-valid">
        <Row> 
        <Col lg={12}>
         <div className="page-title-box">
                <Row className="mb-3" >
                  <h6 className="page-title">Confirmação de Cadastro</h6>
                  <div className="col-md-3"></div>
                  <p>
                    Olá, {getValues("DS_NOME")}.<br></br>
                    Seu cadastro foi realizado com sucesso.
                  </p>
                  <p>
                    Para sua segurança, pedimos que acesse o botão abaixo e confirme seu cadastro
                  </p>
              

                <div className="col-sm-6 ">
                <a>
                  <span onClick={previusState}><i className="ti-angle-left"></i> Voltar </span>
                  </a>
                  </div>
                  <div className="text-end col-sm-6">
                  <Button
                    color="info"
                    className="btn-lg btn-primary"
                    type="button"
                    value='-1'
                    onClick={confirmSubmit}
                  >
                    Confirmar
                  </Button>
                </div>
                                      
                </Row>
          </div>
        </Col>
      </Row>
      </div>
: null}
 {showState == 5 ?  
    <div  className="form-horizontal mt-4 av-valid">
        <div className="p-4 card-body">
          <div className="p-3">
          <h2>Successo, clique em entrar para acessar o Syskeeper</h2>
                    <p className="font-size-20">
                        <a href="/login/juridico">Entrar</a>
                    </p>
           
          </div>
        </div>
      </div>
: null}

          </div>
        </div>

                
              </div>
            
            </Col>
          </Row>
           
           
        </Container>
        </div>
      </div>
    </React.Fragment>

    
    );
};

export default CadastroEmpresa;
