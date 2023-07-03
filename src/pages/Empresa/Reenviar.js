import React, { useState,useRef, useEffect, useCallback } from 'react';
// import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { MdClose } from 'react-icons/md';
import { Col, Card, CardBody, Container, Row, Button } from 'reactstrap';
import { useSpring, animated } from 'react-spring';
 import styled from 'styled-components';
 import "./Modal.css"
 import api from '../../services/api';
//  import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
 import Input from "components/shared/Inputs/Inputs";
 import Swal from "sweetalert2";
 import { useForm } from "react-hook-form";
 

function VerMorador(props) {
    const [name, setName] = useState(props.name);
    const [id, setRole] = useState(props.id);

    const [showR, setShow] = useState(false);
    const [imovel, setImovel] = useState({})
    const handleClose = () => setShow(false);
    const handleShowR = () => setShow(true);

    useEffect(() => {
      api.get('/imovel/user/imovel/'+id).then((response) => {
        let body = {
          nome: response.data[0].DS_NOME +" "+ response.data[0].DS_SOBRENOME,
          email: response.data[0].DS_EMAIL,
          telefone: response.data[0].NR_TELEFONE,
          NR_IDA: response.data[0].NR_IDA,
          medidor: response.data[0].NR_MEDIDOR,
          PORTA: response.data[0].PORTA,
          TP_MEDIDOR: response.data[0].TP_MEDIDOR,
          Pulso: response.data[0].NR_CONSUMO_LITROS,
          DS_RELOJOARIA_INICIAL: response.data[0].DS_RELOJOARIA_INICIAL,
          DS_DESCRICAO_EQUIPAMENTO: response.data[0].DS_DESCRICAO_EQUIPAMENTO,
          DS_MODELO_MEDIDOR: response.data[0].DS_MODELO_MEDIDOR,
          OID_USUARIO: response.data[0].OID_USUARIO,
        };
        setImovel(body)
        console.log(response.data[0])
            console.log(imovel)
           
      });
    }, []);
  
  

    const Background = styled.div`
    width: 80%;
    height: 80%;
    
    
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  const ModalWrapper = styled.div`
    width: 700px;
    min-height: 300px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #fff;
    color: #000;
    
    
    position: relative;
    z-index: 10;
    border-radius: 10px;
  `;
  
  const ModalImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 10px 0 0 10px;
    background: #000;
  `;
  
  const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    
    line-height: 1.8;
    color: #141414;
  
    p {
      margin-bottom: 1rem;
    }
  
    button {
      padding: 10px 24px;
      
      border: none;
    }
  `;
  
  const div1 = styled.div`
   
   text-align: center;
  
  `;

  const dadosmed = styled.div`
   
  white-space: pre-line;
  
  `;

  

  const Divso = styled.div`
   
  border-bottom: 1px solid !important;
  padding-top: 5px;
  
  
  `;
  
  const CloseModalButton = styled(MdClose)`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
  `;
  
  const [data, setData] = useState([])


  const [pessoa, setPessoa] = useState({})

  const {reg,setValue,getValues} = useForm();



    const animation = useSpring({
        config: {
          duration: 250
        },
        opacity: showR ? 1 : 0,
        transform: showR ? `translateY(0%)` : `translateY(-100%)`
      });
    
      const closeModal = e => {
        
            setShow(false)
        
      };
    
      const keyPress = useCallback(
        e => {
          if (e.key === 'Escape') {
            setShow(false)
            console.log('I pressed');
          }
        }
        
      );
    
      useEffect(
        () => {
          document.addEventListener('keydown', keyPress);
          return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
      );
      let navigate = useNavigate();

      const companyData = (e) =>{

     
        let pessoa = {
          
          DS_EMAIL: imovel.email,
          CLIENT_SECRET : "mudar123",
          DS_NOME: imovel.nome,
        }
        
        console.log(pessoa)
  
         api.post("/user/updatesenha",pessoa).then((response) => {
  
       
          
          api
          .post("/mail/criaruser", pessoa )
           
            Swal.fire({
              icon: "success",
              text: "E-mail Enviado com Sucesso!",
              timer: 5000,
            }).then(() => {
              window.location.reload();
            });   
             
         
         
         
  
  
          }).catch(function (error) {
            console.log(error);
            Swal.fire({
              icon: "warning",
              text: "Serviço Temporariamente Indisponivel",
            });
          });
  
  
      
     
      }

    return (
        <>
       

            <span onClick={handleShowR}
            className="reenviar"> <br></br> Reenviar  
												</span>
                
                
                <Background onClick={handleClose} >

          <animated.div style={animation}>
          <Modal
                show={showR}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
            <ModalWrapper >
            <Modal.Header closeButton>
                    <Modal.Title>Reenviar E-mail</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>
              <ModalContent>
                <div className="divin">
                  <span>Ao clicar em Reenviar, será disparado novamente o E-mail com os registros de Pré-cadastro para o Morador.</span>
                
                <br></br>
                </div>
                <div className="divin">
                <Button
                color="info"
                className="btn-lg btn-primary"
               

                onClick={companyData}
                  
                >Reenviar </Button>
             
                </div>
               

                
              </ModalContent>
              
               </Modal.Body>
            </ModalWrapper>
            </Modal>
          </animated.div>
                    </Background>
                   
                {/* <Modal.Body>
                    <form
                        
                        id="editmodal"
                        className="w-full max-w-sm"
                    >
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label
                                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    
                                >
                                    Full Name
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                       
                    </form>
                </Modal.Body> */}
                {/* <Modal.Footer>
                    <button
                        className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                        onClick={handleClose}
                    >
                        Fechar
                    </button>
                   
                </Modal.Footer> */}
            
        </>
    );
}

export default VerMorador;
