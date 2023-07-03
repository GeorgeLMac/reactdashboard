import React, { useState , useEffect  } from "react";

import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Col, Card, CardBody, Container, Row } from 'reactstrap';

import AuthService from "../../services/Auth.service";

const Condominios = () => {
  const initialState = {
    number: "",
    desc: "",
    model: "",
    status: "",
  };

  const user = AuthService.getCurrentUser();

  let checkempresa = null;
  let razao = null;
  if(user != null){
  if(user.empresa[0] != undefined){
    checkempresa = user.empresa[0].OID_EMPRESA
    razao = user.empresa[0].NM_RAZAO_SOCIAL;
  }
  }

  const statusArray = [
    { id: "", status: "Selecione..." },
    { id: "S", status: "Ativo" },
    { id: "N", status: "Inativo" },
  ];

  const [search, setSearch] = useState(initialState);
  const [values, setValues] = useState([]);
  const [showList, setShowList] = useState(false);
  const [data, setData] = useState([])

  useEffect(() => {
		api.get('/empresa/').then((response) => {
			let arr = [];
			arr = formatArray(response.data);
			setData(arr)
			setValues(arr);
		});
	}, []);


  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!search.number && !search.desc && !search.model && !search.status) {
      Swal.fire({
        icon: "warning",
        text: "Preencha ao menos um campo para fazer uma pesquisa",
      });
      return;
    }

    if (!search.number && (search.desc || search.model) && !search.status) {
      Swal.fire({
        icon: "warning",
        text: "Preencha o campo Status para fazer uma pesquisa sem Número Hidrômetro",
      });
      return;
    }

    let body = {
      NR_HIDROMETRO: search.number,
      DS_DESCRICAO_HIDROMETRO: search.desc,
      DS_MODELO_HIDROMETRO: search.model,
      TP_ATIVO: search.status,
    };

    api
      .post("/hydrometers/filter", body)
      .then((response) => {
        let arr = formatArray(response.data);
        if (arr.length === 0) {
          Swal.fire({
            icon: "warning",
            text: "Nenhum resultado encontrado, refaça a sua busca!",
          });
          setShowList(false);
        } else {
          Swal.fire({
            icon: "success",
            timer: 500,
          });
          arr.map((elem) => {
            if (elem.status === "S") {
              elem.status = "Ativo";
            }
            if (elem.status === "N") {
              elem.status = "Inativo";
            }
          });

          console.log(arr);
          setValues(arr);
          setSearch(initialState);
          setShowList(true);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "warning",
          text: "Erro Tente Novamente!",
        });
        setShowList(false);
      });
  };

  const formatArray = (data) => {
    let arr = [];
    data.map((elem) => {
      arr.push({
        cnpj: elem.NR_CNPJ,
        razao: elem.NM_RAZAO_SOCIAL,
        cep: elem.CD_CEP,
        telefone: elem.NR_TELEFONE,
        
      });
    });
    return arr;
  };
  
  return (
    <React.Fragment>
      <div className="page-content">
        <label id="component-title">Lista de Condomínios cadastrados | Syskeeper</label>

     
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            {/* <div className="row" style={{ textAlign: "end" }}>
              
              <div className="col-6" style={{ alignSelf: "center" }}>
                <Button
                  icon="ti-user"
                  text="Cadastrar Morador"
                  link="/cadastro/moradores-cadastro"
                  
                />
              </div>
            </div> */}
           
            
           
            
          </div>
        </form>
        {/* <SearchTable
          tableHead={[
            "Nome",
            
            "",
          ]}
          tableBody={[values, 1]}
          showTable={showList}
        >
          {values?.map((maker, key) => (
            <td key={key}>
              <Link
                type="button"
                to={`/cadastro/hidrometro-update/${maker.id}`}
                color="link"
                size="sm"
                className="btn-light waves-effect waves-light"
              >
                <i className="dripicons-document-edit" />
              </Link>
            </td>
          ))}
        </SearchTable> */}
        <div className="table-responsive">
						<table className="table align-middle table-nowrap mb-0">
							<thead className="table-light">
								<tr>
									<th className="align-middle">
										CNPJ
									</th>
									<th className="align-middle">Razão Social</th>
									<th className="align-middle">CEP</th>
									<th className="align-middle">Tel.</th>
									<th className="align-middle">Status</th>
									
								</tr>
							</thead>
							<tbody>
                {values.length >0 ? 
								values?.map((arr, key) => (
									<tr key={'_tr_' + key}>
										<td>{arr.cnpj} </td>
										<td>{arr.razao}</td>
										<td>{arr.cep}</td>
										<td>{arr.telefone}</td>
										<td>
											{arr.status == null ? (
												<span className="badge bg-success">
													Cadastro Completo
												</span>
											) : (
												<span className="badge bg-danger bg-primary">
													Cadastro Incompleto
												</span>
											)}
										</td>
										{/* <td>
											<Link
												type="button"
												to={``}
												color="link"
												size="sm"
												className="btn-light waves-effect waves-light"
											>
												<i className="dripicons-document-edit" />
											</Link>
										</td> */}
									</tr>
								)) : <tr><td>Nenhum Registro </td></tr>}
							</tbody>
						</table>
					</div>
      </div>
    </React.Fragment>
  );
};

export default Condominios;
