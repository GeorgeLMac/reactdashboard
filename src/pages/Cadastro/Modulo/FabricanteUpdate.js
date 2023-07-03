import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

import Button from "components/shared/Button/Button";
import Inputs from "components/shared/Inputs/Inputs";
import Swal from "sweetalert2";

const FabricanteUpdate = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  const initialState = {
    maker: "",
    contact: "",
    email: "",
    tel: "",
  };

  const [edit, setEdit] = useState(initialState);
  
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const contactRegex = /[^a-z A-Z]/gm;

  const fetchMakersId = () => {
    api.get(`/makerslora/${id}`).then((response) => {
      let obj = response.data[0];
      obj = {
        id: obj.OID_FABRICANTE_LORA,
        maker: obj.DS_FABRICANTE_LORA,
        contact: obj.NM_CONTATO,
        email: obj.DS_EMAIL,
        tel: obj.NR_TELEFONE,
      };
      setEdit(obj);
    });
  };

  const onChangeHandler = (prop) => (event) => {
    setEdit({ ...edit, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const errorStyle = "margin-bottom: 0; font-size: 80%;";
    if (edit.contact.match(contactRegex) || edit.contact.length < 3) {
      Swal.fire({
        icon: "warning",
        html:
          '<p style="margin-bottom: 0;">Digite Um <b>CONTATO</b> Válido</p>' +
          `<p style="${errorStyle}">Apenas Letras e Espaços</p>`,
      });
      return;
    }

    if (!edit.email.match(emailRegex)) {
      Swal.fire({
        icon: "warning",
        text: "Digite um EMAIL Válido",
      });
      return;
    }

    if (edit.tel.match(/\D/g)) {
      Swal.fire({
        icon: "warning",
        html:
          '<p style="margin-bottom: 0;">Digite Um <b>TELEFONE</b> Válido</p>' +
          `<p style="${errorStyle}">Apenas NÚMEROS</p>`,
      });
      return;
    }
    let body = {
      DS_FABRICANTE_LORA: edit.maker,
      NM_CONTATO: edit.contato,
      DS_EMAIL: edit.email,
      NR_TELEFONE: edit.tel,
    };
    api.put(`/makerslora/${id}`, body).then(() => {
      Swal.fire({
        icon: "success",
        title: "Fabricante atualizado!",
      }).then(() => {
        navigate("/cadastro/modulo/fabricantelora");
      });
    }).catch(() => {
      Swal.fire({
        icon: "warning",
        title: "Dados Inválidos!",
      });
    })
  };

  useEffect(() => {
    fetchMakersId();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Editar | Fabricante Lora</label>
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
                <Inputs
                  id="fab-edit"
                  label="Fabricante"
                  value={edit.maker}
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-register"
                  label="Contato"
                  value={edit.contact}
                  onChange={onChangeHandler("contact")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-register"
                  label="E-mail"
                  value={edit.email}
                  onChange={onChangeHandler("email")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-register"
                  label="Telefone"
                  value={edit.tel}
                  onChange={onChangeHandler("tel")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
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
      </div>
    </React.Fragment>
  );
};

export default FabricanteUpdate;
