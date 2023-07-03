import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import ReactInputMask from "react-input-mask";
import Button from "components/shared/Button/Button";
import Inputs from "components/shared/Inputs/Inputs";
import Swal from "sweetalert2";

const HidrometroUpdate = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  const initialState = {
    number: "",
    desc: "",
    model: "",
    status: "",
    pulse: "",
  };

	const statusArray = [
    { id: "S", status: "Ativo" },
    { id: "N", status: "Inativo" },
  ];

  const [edit, setEdit] = useState(initialState);

  const fetchHydrometersId = () => {
    api.get(`/hydrometers/${id}`).then((response) => {
      let obj = response.data[0];
      obj = {
        id: obj.OID_MEDIDOR,
        number: obj.NR_MEDIDOR,
        desc: obj.DS_DESCRICAO_MEDIDOR,
        model: obj.DS_MODELO_MEDIDOR,
        pulse: obj.NR_CONSUMO_LITROS,
        status: obj.TP_ATIVO,
      };
      setEdit(obj);
    });
  };

  const onChangeHandler = (prop) => (event) => {
    setEdit({ ...edit, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let body = {
      NR_MEDIDOR: edit.number,
      DS_DESCRICAO_MEDIDOR: edit.desc,
      DS_MODELO_MEDIDOR: edit.model,
      NR_CONSUMO_LITROS: edit.pulse,
      TP_ATIVO: edit.status,
    };
    api
      .put(`/hydrometers/${id}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Medidor atualizado!",
        }).then(() => {
          navigate("/cadastro/hidrometro");
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "warning",
          title: "Dados Inválidos!",
        });
      });
  };

  useEffect(() => {
    fetchHydrometersId();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Editar | Medidor</label>
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
            <div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-edit"
                  label="Número Medidor"
                  value={edit.number}
                  onChange={onChangeHandler("number")}
                  styles={{ width: "100%" }}
                  
                />
              </div>
            </div>
						<div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-edit"
                  label="Descrição"
                  value={edit.desc}
                  onChange={onChangeHandler("desc")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
						<div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-edit"
                  label="Modelo"
                  value={edit.model}
                  onChange={onChangeHandler("model")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
						<div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-edit"
                  label="Pulso/Litro"
                  value={edit.pulse}
                  onChange={onChangeHandler("pulse")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            {/* <div className="row">
         
              <div className="col-6">
              <label  className="">Nr. Pulso <span ></span></label>
                <ReactInputMask
                  id="fab-edit"
                  label="Pulso/Litro"
                  mask = "999999"
                  value={edit.pulse}
                  onChange={onChangeHandler("pulse")}
                  className="form-control form-control-lg"
                  styles={{ width: "100%",border: "1px solid #dbdbdb",
                  borderRadius: "10px",
                  height: "1rem",
                  background: "ti-search",
                  paddingLeft: "1rem",
                  display: "inline", }}
                />
              </div>
            </div> */}
						<div className="row">
              <div className="col-6">
                <Inputs
                  id="fab-edit"
                  label="Status"
                  type="select"
                  options={[statusArray, "status"]}
									value={edit.status}
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

export default HidrometroUpdate;
