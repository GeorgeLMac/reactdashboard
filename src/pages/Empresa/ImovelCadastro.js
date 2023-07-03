import React, { useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import {  Col, Container, Row } from "reactstrap";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/Auth.service";
import validator from 'validator';
import { useForm } from "react-hook-form";

const ImovelCadastro = () => {
  let navigate = useNavigate();
  const initialState = {
    nome: "",
    sobrenome: "",
    email: "",
    senha: ""
  };



  const user = AuthService.getCurrentUser();

  let checkempresa = null;
    if(user != null){
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    }
    }
    

    const {register,setValue,getValues} = useForm();

  // const onChangeHandler = (prop) => (event) => {
  //   setRegister({ ...register, [prop]: event.target.value });
  // };

  const submitHandler = (event) => {

     
    event.preventDefault();
    

    
        const comp = getValues("IM_COMPLEMENTO")

        let bloco = getValues("IM_BLOCO")


        if(comp.length < 1){
          Swal.fire({       
            icon: "warning",
            text: "favor Colocar o Nr do AP ou casa"
          })
          return
        }

        if(bloco.length < 1){
          bloco = null;
        }
    
   
    
    

      

      let imovel = {
    
        OID_CONDOMINIOATUAL: checkempresa,
        IM_COMPLEMENTO: comp,
        IM_BLOCO: bloco,
      }

      api
      .post("/imovel/imovel", imovel )
      .then((response) => {
       

       
       
        Swal.fire({
          icon: "success",
          text: "AP/CASA Cadastrado com sucesso!",
          timer: 16000,
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

     

 
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastrar | IMÓVEL</label>
        <Col md={8}>
								
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item active">
										Aqui será feito o cadastro do AP/CASA, após isso será possivel adicionar moradores na página de Moradores.
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
          <div className="mb-3 col-6">

<div className="form-group">
<label
        className="col-md-12col-form-label"
        >Nº AP ou Casa* (Apenas Números ou letra identificatória)
        </label>
        <input
          {...register("IM_COMPLEMENTO")}
          className="form-control form-control-lg w-100"
          type="text"
          defaultValue=""
         
        />
</div>
</div>
<div className="mb-3 col-6">

<div className="form-group">
<label
        className="col-md-12col-form-label"
        >Bloco (Caso Existir no Condomínio)
        </label>
        <input
          {...register("IM_BLOCO")}
          className="form-control form-control-lg w-100"
          type="text"
          defaultValue=""
        
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

export default ImovelCadastro;
