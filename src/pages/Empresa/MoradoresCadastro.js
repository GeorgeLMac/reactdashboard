import React, { useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import {  Col, Container, Row } from "reactstrap";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate, Link, useParams } from "react-router-dom";
import AuthService from "../../services/Auth.service";
import validator from 'validator';
import { useForm } from "react-hook-form";

const MoradoresCadastro = () => {

  let { id } = useParams();
  const [idimovel, ] = useState(id);
  let navigate = useNavigate();
  const initialState = {
    nome: "",
    sobrenome: "",
    email: "",
    senha: ""
  };

  const {reg,setValue,getValues} = useForm();

  const user = AuthService.getCurrentUser();

  let checkempresa = null;
    if(user != null){
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    }
    }
    

  const [register, setRegister] = useState(initialState);

  const onChangeHandler = (prop) => (event) => {
    setRegister({ ...register, [prop]: event.target.value });
  };

  const submitHandler = (event) => {

     
    event.preventDefault();
    const personalInfo = [register.nome,register.sobrenome,register.email,register.senha]
    console.log(personalInfo)
    let counter =0
      personalInfo.forEach(info=>{
        if(!info){
          counter++
        }
      })

      if(register.senha.length == 0){
        Swal.fire({       
          icon: "warning",
          text: "Preencha a senha"
        })
        return
      }

      if(counter ==0){
        if(!validator.isEmail(personalInfo[2])){
          Swal.fire({       
            icon: "warning",
            text: "Favor digitar um email válido"
          })
          return
        }
     
    
   
    console.log(register);
    let body = {
    
      DS_NOME: register.nome,
      DS_SOBRENOME: register.sobrenome,
      DS_EMAIL: register.email,
      CLIENT_SECRET: register.senha,
      DS_STATUS: 1
    }
    
    console.log(body)


    api.post("/user/user", body).then((response) => {

      

      let imovel = {
    
        
        OID_PROPRIETARIO: response.data.OID_USUARIO
      }

      api
      .put("/imovel/adicionar/"+idimovel, imovel )
      .then((response) => {
       

        api
      .post("/mail/criaruser", body )
       
        Swal.fire({
          icon: "success",
          text: "Morador Cadastrado com sucesso!",
          timer: 4000,
        }).then(() => {
          navigate("/moradores");
        });   
         
      }).catch(function (error) {
        console.log(error);
        Swal.fire({
          icon: "warning",
          text: "Serviço Temporariamente Indisponivel",
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
  }else{
    Swal.fire({       
      icon: "warning",
      text: "Preencher Todos os Campos obrigátorios"
    })
    return
  }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastrar | Morador</label>
        <Col md={8}>
								
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item active">
										Aqui será feito o pré-cadastro simples do morador, ele será notificado por e-mail digitado abaixo com as informações de acesso incluindo a senha.
									</li>
								</ol>
							</Col>
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/moradores"
            styles={{
              marginLeft: "1.5rem",
              background: "#f8f7ff",
              color: "blue",
            }}
          />
        </div>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row">
              <div className="col-6">
                <Input
                  id="nome"
                  label="Nome do Morador*"
                  value={register.nome}
                  onChange={onChangeHandler("nome")}
                  styles={{ width: "100%" }}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="sobrenome"
                  label="Sobrenome do Morador*"
                  value={register.sobrenome}
                  onChange={onChangeHandler("sobrenome")}
                  styles={{ width: "100%" }}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                 
                  id="email"
                  label="Email do Morador*"
                  value={register.email}
                  onChange={onChangeHandler("email")}
                  styles={{ width: "100%" }}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="senha"
                  label="Senha de acesso para o Morador*"
                  placeholder="mudar123"
                  value={register.senha}
                  onChange={onChangeHandler("senha")}
                  styles={{ width: "100%" }}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <Button
                  icon="ti-user"
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

export default MoradoresCadastro;
