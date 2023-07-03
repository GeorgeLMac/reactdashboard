import React, { useEffect, useState } from "react";

import Input from "components/shared/Inputs/Inputs";
import Button from "components/shared/Button/Button";
import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Fabricante = () => {
  const initialState = {
    maker: "",
    contact: "",
    email: "",
    tel: "",
  };

  const [search, setSearch] = useState(initialState);
  const [makers, setMakers] = useState([]);
  const [values, setValues] = useState([]);

  const [showList, setShowList] = useState(false);

  const fetchMakers = () => {
    let maker = [{ id: "", maker: "Selecione..." }];
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
    setSearch({ ...search, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!search.maker && !search.contact && !search.email && !search.tel) {
      Swal.fire({
        icon: "warning",
        text: "Digite ao meno UM campo para fazer a pesquisa!",
      });
      setShowList(false);
      return;
    }

    const body = {
      DS_FABRICANTE_LORA: Number(search.maker),
      NM_CONTATO: search.contact,
      DS_EMAIL: search.email,
      NR_TELEFONE: search.tel,
    };
    makers.map((maker) => {
      if (maker.id === body.DS_FABRICANTE_LORA) {
        body.DS_FABRICANTE_LORA = maker.maker;
      }
    });
    api
      .post("/makerslora/filter", body)
      .then((response) => {
        const arr = formatArray(response.data);
        if (arr.length === 0) {
          Swal.fire({
            icon: "warning",
            text: "Nenhum Resultado Encontrado, confira os valores e refaça sua busca",
          });
          setShowList(false);
        } else {
          Swal.fire({
            icon: "success",
            timer: 1000,
          });
          setValues(arr);
          setSearch(initialState)
          setShowList(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatArray = (data) => {
    let arr = [];
    data.map((elem) => {
      arr.push({
        id: elem.OID_FABRICANTE_LORA,
        maker: elem.DS_FABRICANTE_LORA,
        contact: elem.NM_CONTATO,
        email: elem.DS_EMAIL,
        tel: elem.NR_TELEFONE,
      });
    });
    return arr;
  };

  useEffect(() => {
    fetchMakers();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Pesquisa | Fabricante Lora</label>
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row" style={{ textAlign: "end" }}>
              <div className="col-6" style={{ textAlign: "start" }}>
                <Input
                  id="fab-search"
                  label="Fabricante Lora"
                  options={[makers, "maker"]}
                  value={search.maker}
                  type="select"
                  onChange={onChangeHandler("maker")}
                  styles={{ width: "100%" }}
                />
              </div>
              <div className="col-6" style={{ alignSelf: "center" }}>
                <Button
                  icon="ti-agenda"
                  text="Cadastrar"
                  link="/cadastro/modulo/fabricantelora-cadastro"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Input
                  id="contact"
                  label="Contato"
                  value={search.contact}
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
                  value={search.email}
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
                  value={search.tel}
                  onChange={onChangeHandler("tel")}
                  styles={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="row">
              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <Button
                  icon="ti-search"
                  text="Pesquisar"
                  action={submitHandler}
                  primaryColor="#5d4ec0"
                  hoverColor="#4eadc0"
                />
              </div>
            </div>
          </div>
        </form>
        <SearchTable
          tableHead={["Fabricante", "Contato", "E-Mail", "Telefone", ""]}
          tableBody={[values, 1]}
          showTable={showList}
        >
          {values?.map((maker, key) => (
            <td key={key}>
              <Link
                type="button"
                to={`/cadastro/modulo/fabricantelora-update/${maker.id}`}
                color="link"
                size="sm"
                className="btn-light waves-effect waves-light"
              >
                <i className="dripicons-document-edit" />
              </Link>
            </td>
          ))}
        </SearchTable>
      </div>
    </React.Fragment>
  );
};

export default Fabricante;
