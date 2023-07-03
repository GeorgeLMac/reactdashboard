import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

import Button from "components/shared/Button/Button";
import Inputs from "components/shared/Inputs/Inputs";
import Swal from "sweetalert2";

const EquipamentoLoraUpdate = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  const initialState = {
    maker: "",
    desc: "",
    model: "",
    number: "",
  };

  const [edit, setEdit] = useState(initialState);
  const [makers, setMakers] = useState([]);

  const fetchEquipLoraId = () => {
    api.get(`/equipmentslora/${id}`).then((response) => {
      let obj = response.data[0];
      obj = {
        maker: obj.OID_FABRICANTE_LORA,
        desc: obj.DS_DESCRICAO_EQUIPAMENTO,
        model: obj.DS_MODELO_EQUIPAMENTO,
        number: obj.NR_EQUIPAMENTO,
      };
      setEdit(obj);
    });
  };

  const fetchMakers = () => {
    let maker = [];
    api.get("/makerslora").then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.OID_FABRICANTE_LORA,
          maker: elem.DS_FABRICANTE_LORA,
        });
      });
      setMakers(maker);
    });
  };

  const onChangeHandler = (prop) => (event) => {
    setEdit({ ...edit, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const body = {
      OID_FABRICANTE_LORA: edit.maker,
      DS_DESCRICAO_EQUIPAMENTO: edit.desc,
      DS_MODELO_EQUIPAMENTO: edit.model,
      NR_EQUIPAMENTO: edit.number,
    };
    api.put(`/equipmentslora/${id}`, body).then(() => {
      Swal.fire({
        icon: "success",
        title: "Equipamento atualizado!",
      })
        .then(() => {
          navigate("/cadastro/modulo/equipamentolora");
        })
        .catch(() => {
          Swal.fire({
            icon: "warning",
            title: "Dados Inválidos!",
          });
        });
    });
  };

  useEffect(() => {
    fetchEquipLoraId();
    fetchMakers();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Editar | Equipamento Lora</label>
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/cadastro/modulo/equipamentolora"
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
                  options={[makers, "maker"]}
                  value={edit.maker}
                  type="select"
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-register"
                  label="Descrição Equipamento"
                  value={edit.desc}
                  onChange={onChangeHandler("desc")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-register"
                  label="Modelo Equipamento"
                  value={edit.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-register"
                  label="Número Equipamento (MAC ADDRESS)"
                  value={edit.number}
                  onChange={onChangeHandler("number")}
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

export default EquipamentoLoraUpdate;
