import React, { useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const FabricanteCadastro = () => {
  let navigate = useNavigate();
  const initialState = {
    maker: "",
    contact: "",
    email: "",
    tel: "",
  };

  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const contactRegex = /[^a-z A-Z]/gm;

  const [register, setRegister] = useState(initialState);

  const onChangeHandler = (prop) => (event) => {
    setRegister({ ...register, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const errorStyle = "margin-bottom: 0; font-size: 80%;";
    if (register.contact.match(contactRegex) || register.contact.length < 3) {
      Swal.fire({
        icon: "warning",
        html:
          '<p style="margin-bottom: 0;">Digite Um <b>CONTATO</b> Válido</p>' +
          `<p style="${errorStyle}">Apenas Letras e Espaços</p>`,
      });
      return;
    }

    if (!register.email.match(emailRegex)) {
      Swal.fire({
        icon: "warning",
        text: "Digite um EMAIL Válido",
      });
      return;
    }

    if (register.tel.match(/\D/g)) {
      Swal.fire({
        icon: "warning",
        html:
          '<p style="margin-bottom: 0;">Digite Um <b>TELEFONE</b> Válido</p>' +
          `<p style="${errorStyle}">Apenas NÚMEROS</p>`,
      });
      return;
    }

    const body = {
      DS_FABRICANTE_LORA: register.maker,
      NM_CONTATO: register.contact,
      DS_EMAIL: register.email,
      NR_TELEFONE: register.tel,
    };

    api
      .post("/makerslora", body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Fabricante cadastrado!",
        }).then(() => {
          navigate("/cadastro/modulo/fabricantelora")
        });
      })
      .catch(function () {
        Swal.fire({
          icon: "warning",
          text: "Confira todos os dados e faça o cadastro completo!",
        });
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Cadastrar | Fabricante Lora</label>
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/cadastro/modulo/fabricantelora"
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
                  id="fab-register"
                  label="Fabricante Lora"
                  value={register.maker}
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="contact"
                  label="Contato"
                  value={register.contact}
                  onChange={onChangeHandler("contact")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="email"
                  label="E-Mail"
                  value={register.email}
                  onChange={onChangeHandler("email")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="tel"
                  label="Telefone"
                  value={register.tel}
                  onChange={onChangeHandler("tel")}
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

export default FabricanteCadastro;
