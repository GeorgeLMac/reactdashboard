import React, { useRef, useState , useEffect  } from "react";

//  import Button from "components/shared/Button/Button";
import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";

import api from "../../services/api";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Col, Card, CardBody, Container, Row, Button, Modal,
  ModalHeader,
  ModalBody,
  ModalFooter, Table} from 'reactstrap';

import VerMorador from './VerMorador';
import Reenviar from './Reenviar';
import AuthService from "../../services/Auth.service";
// import PersonAddIcon  from '@mui/icons-material/PersonAdd';
// import DomainAddIcon  from '@mui/icons-material/DomainAdd';

// import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';

const Moradores = () => {
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

  const [showModal, setShowModal] = useState(false);
 

  const modalRef = useRef();

  const openModal = () => {
 
    setShowModal(true);
  };

  const [employees, setEmployees] = useState([]);
  const handleShow = e => {
   
      setShowModal(true);
    
  };

//   function updateEmployee(id, newName, newRole) {
//     const updatedEmployees = employees.map((employee) => {
//         if (id == employee.id) {
//             return { ...employee, name: newName, role: newRole };
//         }

//         return employee;
//     });
//     setEmployees(updatedEmployees);
// }
 
  const [search, setSearch] = useState(initialState);
  const [values, setValues] = useState([]);
  const [showList, setShowList] = useState(false);
  const [data, setData] = useState([])
  const [modal, setmodal] = useState(false);
  const [imovel, setImovel] = useState({})

  const [id, setId] = useState(0)

  const toggleViewModal = (id) => {
    setId(id);
    setmodal(!modal);
    console.log(id)
  };


  useEffect(() => {
    if (id !== 0) {
		api.get('/imovel/user/imovel/'+id).then((response) => {
			let body = {
        nome: response.data[0].DS_NOME +" "+ response.data[0].DS_SOBRENOME,
        email: response.data[0].DS_EMAIL,
        telefone: response.data[0].NR_TELEFONE,
        NR_IDA: response.data[0].NR_IDA,
        medidor: response.data[0].NR_MEDIDOR,
        oid_medidor : response.data[0].medidorid,
        PORTA: response.data[0].PORTA,
        TP_MEDIDOR: response.data[0].TP_MEDIDOR,
        Pulso: response.data[0].NR_CONSUMO_LITROS,
        DS_RELOJOARIA_INICIAL: response.data[0].DS_RELOJOARIA_INICIAL,
        DS_DESCRICAO_EQUIPAMENTO: response.data[0].DS_DESCRICAO_EQUIPAMENTO,
        DS_MODELO_MEDIDOR: response.data[0].DS_MODELO_MEDIDOR,
      };
      setImovel(body)
      console.log(response.data[0])
          console.log(imovel)
         
		});
  }
	}, [id]);

  useEffect(() => {
		api.get('/imovel/'+checkempresa).then((response) => {
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
        imovel: elem.imovel,
        OID_IMOVEL: elem.OID_IMOVEL,
        nome: elem.DS_NOME,
        sobrenome: elem.DS_SOBRENOME,
        email: elem.DS_EMAIL,
        telefone: elem.NR_TELEFONE,
        status: elem.DS_STATUS,
        id: elem.OID_USUARIO,
      });
    });
    return arr;
  };
  
  return (
    
    <React.Fragment>
      
      <div className="page-content">
        
        <label id="component-title">Moradores | {razao}</label>

     
        <form className="component-form container" style={{ margin: "0px" }}>
          <div className="container">
            <div className="row" style={{ textAlign: "end" }}>
              
              <div className="col-6" style={{ alignSelf: "center" }}>
              <Link to="/cadastro/imovel-cadastro">
                <Button
                color="primary"
                className="btn-lg  btn-rounded"
               
                  
                  
                >Cadastrar IMÓVEL </Button>
                </Link>
              </div>
            </div>
           
            
           
            
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
                  IMÓVEL
									</th>
									<th className="align-middle">PROPRIETÁRIO/INQUILINO</th>
                 
									<th className="align-middle">STATUS</th>
									<th className="align-middle"></th>
								</tr>
							</thead>
							<tbody>
                {values.length >0 ? 
								values?.map((arr, key) => (
									<tr key={'_tr_' + key}>
                    
										<td>{arr.imovel} </td>
										<td>
                    {arr.nome == null ? (
                      <Link 
                     
                      to={`/cadastro/moradores-cadastro/${arr.OID_IMOVEL}`}
                      >
                      <Button
                      color="info"
                      className="btn-lg btn-primary"

                      >Cadastrar   </Button>
                      </Link>
												//  <span
                        //  className="reenviar"> <br></br> Adicionar   <PersonAddIcon/>
                        //              </span>
											) : (
                        <span>
												{arr.nome} {arr.sobrenome}
												</span>
											)}
                      
                      
                      
                      </td>
                   
										<td>
                      {console.log(arr.status)}
                      {console.log(arr.nome)}
                      {
                      (() => {
                        if(arr.status == null && arr.nome != null){
                          return  <span className="badge bg-success">
													Cadastro Completo
												</span>
                        }
                        if(arr.status == 1 && arr.nome != null){
                          return <span className="badge bg-info bg-primary">
													E-mail enviado
												</span>  
                        }
                        if(arr.status == null && arr.nome == null){
                         return <span className="badge bg-info bg-warning">
													Aguardando Cadastro
												</span>  
                        }
                      })()
                    }
                                            
											
                      {arr.status == 1 ? (
                        /* eslint-disable no-mixed-spaces-and-tabs */
												  <Reenviar
                          id={arr.OID_IMOVEL}
                          name={arr.nome}
                          role={arr.role}                          
                      />           
                      /* eslint-disable no-mixed-spaces-and-tabs */        
											) : null }

										</td>
										<td>				
                    <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => toggleViewModal(arr.OID_IMOVEL)}
            >
              Abrir
            </Button>
                      {/* <VerMorador
                                    id={arr.OID_IMOVEL}
                                    name={arr.nome}
                                    role={arr.role}
                                    
                                /> */}
										</td>
									</tr>
								)) : <tr><td>Nenhum Registro, Cadastre um Morador </td></tr>}
							</tbody>
						</table>
					</div>
          
      </div>
     
      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
           Informações Imóvel
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
            Email: <span className="text-primary">{imovel.email}</span>
            </p>
            <p className="mb-4">
            telefone: <span className="text-primary">{imovel.telefone ? imovel.telefone : "Aguardando Preenchimento do Morador"}</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Dados Imóvel</th>
                    <th scope="col"></th>
                    {/* <th scope="col">Price</th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        {/* <img src={modalimage1} alt="" className="avatar-sm" /> */}
                        IDA
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                        {imovel.NR_IDA ? imovel.NR_IDA : "Aguardando Preenchimento do Morador"}
                        </h5>
                       
                      </div>
                    </td>
                 
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                      Medidor: 
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                        {imovel.medidor ? imovel.medidor : "Aguardando Preenchimento do Morador"}

                        {imovel.medidor ?
                  <>
                  <Link
                      type="button"
                      to={`/cadastro/hidrometro-update/${imovel.oid_medidor}`}
                      color="link"
                      style={{ float: "right" }}
                      size="sm"
                      className="btn-light waves-effect waves-light"
                    >
                      <i className="dripicons-document-edit" />
                    </Link>
                    </> : null
                    }
                        </h5>

                        
                       
                      </div>
                    </td>
                   
                  </tr>
                 
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Fechar
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Moradores;
