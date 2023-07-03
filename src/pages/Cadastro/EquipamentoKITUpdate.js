import React, { useEffect, useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";

import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EquipamentoKitUpdate = () => {
  let navigate = useNavigate();
  let { id } = useParams();
  const initialState = {
    hydro: "",
    lora: "",
    location: "",
    region: "NORTE",
    latitude: "",
    longitude: "",
    locationType: "F",
    clock: "",
  };

  const regionArray = [
    { id: "NORTE", region: "Norte" },
    { id: "SUL", region: "Sul" },
    { id: "LESTE", region: "Leste" },
    { id: "OESTE", region: "Oeste" },
  ];
  const locationTypeArray = [
    { id: "F", locationType: "Final" },
    { id: "T", locationType: "Temporária" },
  ];

  const [register, setRegister] = useState(initialState);

  const [hydro, setHydro] = useState([]);
  const [lora, setLora] = useState([]);

  const fetchHydro = (id, idLora, obj) => {
    api.get(`/hydrometers/${id}`).then((response) => {
      let hydro = [];
      const elem = response.data[0];
      hydro.push({
        id: elem.OID_HIDROMETRO,
        hydro: elem.NR_HIDROMETRO,
      });
      setHydro(hydro);
      const temp = { ...obj, hydro: hydro[0].hydro };
      setRegister(temp);
      fetchLora(idLora, temp);
    });
  };

  const fetchLora = (id, obj) => {
    api.get(`/equipmentslora/${id}`).then((response) => {
      let lora = [];
      const elem = response.data[0];
      lora.push({
        id: elem.OID_EQUIPAMENTO_LORA,
        lora: elem.NR_EQUIPAMENTO,
      });
      setLora(lora);
			console.log(lora)
      setRegister({ ...obj, lora: lora[0].lora });
    });
  };

  console.log(register);

  const fetchKitId = () => {
    let obj = [];
    api
      .get(`/equipmentsdmae/${id}`)
      .then((response) => {
        obj = response.data[0];
        obj = {
          hydro: obj.OID_HIDROMETRO,
          lora: obj.OID_EQUIPAMENTO_LORA,
          location: obj.DS_LOCALIDADE,
          region: obj.DS_LOCALIZACAO_REGIAO,
          latitude: obj.DS_LOCALIZACAO_LATITUDE,
          longitude: obj.DS_LOCALIZACAO_LONGITUDE,
          locationType: obj.TP_LOCALIZACAO,
          clock: obj.DS_RELOJOARIA_INICIAL,
        };
      })
      .then(() => {
        fetchHydro(obj.hydro, obj.lora, obj);
      });
  };

  const onChangeHandler = (prop) => (event) => {
    setRegister({ ...register, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let checkHydro = true;
    let checkLora = true;

    let hydrometer = {};
    let equip = {};

    hydro.map((elem) => {
      if (elem.hydro === register.hydro) {
        hydrometer = elem;
        checkHydro = false;
      }
    });
    lora.map((elem) => {
      if (elem.lora === register.lora) {
        equip = elem;
        checkLora = false;
      }
    });

    if (checkHydro) {
      Swal.fire({
        icon: "warning",
        title: "Por Favor Digite um Hidrômetro Válido",
      });
      return;
    }

    if (checkLora) {
      Swal.fire({
        icon: "warning",
        title: "Por Favor Digite um Equipamento Lora Válido",
      });
      return;
    }

    const body = {
      OID_HIDROMETRO: hydrometer.id,
      OID_EQUIPAMENTO_LORA: equip.id,
      DS_LOCALIDADE: register.location,
      DS_LOCALIZACAO_REGIAO: register.region,
      DS_LOCALIZACAO_LONGITUDE: register.longitude,
      DS_LOCALIZACAO_LATITUDE: register.latitude,
      TP_LOCALIZACAO: register.locationType,
      DS_RELOJOARIA_INICIAL: register.clock,
    };

		console.log(body)
		console.log(lora)

    api
      .put(`/equipmentsdmae/${id}`, body)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Equipamento atualizado!",
        }).then(() => {
					navigate("/cadastro/equipamentokit")
				});
      })
      .catch(function () {
        Swal.fire({
          icon: "warning",
          title: "Falha na Atualização, verifique os dados e tente novamente",
        });
      });
  };

  useEffect(() => {
    fetchKitId();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Editar | Equipamento KIT</label>
      
        <div>
          <Button
            icon="bx bx-left-arrow-circle"
            iconPosition="left"
            primaryColor="#f8f7ff"
            hoverColor="#f8f7ff"
            text="Voltar"
            link="/cadastro/equipamentokit"
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
                  id="hydro"
                  label="Hidrômetro"
                  value={register.hydro}
                  onChange={onChangeHandler("hydro")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="lora"
                  label="Equipamento Lora"
                  value={register.lora}
                  onChange={onChangeHandler("lora")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="location"
                  label="Localidade"
                  value={register.location}
                  onChange={onChangeHandler("location")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="region"
                  label="Região"
                  type="select"
                  options={[regionArray, "region"]}
                  value={register.region}
                  onChange={onChangeHandler("region")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="latitude"
                  label="Latitude"
                  value={register.latitude}
                  onChange={onChangeHandler("latitude")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="longitude"
                  label="Longitude"
                  value={register.longitude}
                  onChange={onChangeHandler("longitude")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="locationType"
                  label="Tipo de Localização"
                  type="select"
                  options={[locationTypeArray, "locationType"]}
                  value={register.locationType}
                  onChange={onChangeHandler("locationType")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="clock"
                  label="Relojoaria Inicial"
                  value={register.clock}
                  onChange={onChangeHandler("clock")}
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

export default EquipamentoKitUpdate;
