
import React, {  useRef, useState,useEffect } from 'react';

import AuthService from '../../services/Auth.service';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoBranco from "../../assets/images/logo-sm.png";
import Swal from "sweetalert2";
import "./InitialPage.css";
import api from "../../services/api";
// const LOGIN_URL = '/user/login';


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const EsqueciSenha = () => {
    // const { setAuth } = useAuth();

    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    // const userRef = useRef();
    const errRef = useRef();

    const [DS_EMAIL, setUser] = useState('');
    const [CLIENT_SECRET, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

   
    useEffect(() => {
        setErrMsg('');
    }, [DS_EMAIL, CLIENT_SECRET])

    
    
   
    const handleSubmit = async (e) => {
        e.preventDefault();



        try {

          let body = {
            DS_EMAIL: DS_EMAIL,
         
          }


          api
          .post("/mail/rsenha", body )
          .then((response) => {

            Swal.fire({
              icon: "success",
              text: "Verifique sua caixa de e-mail!",
              timer: 50000,
            }).then(() => {
              
              navigate("/");
            });  
           
        }).catch(function (error) {
          console.log(error);
          Swal.fire({
            icon: "warning",
            text: "Erro",
          });
        });
          
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Servidor err');
            } else if (err.response?.status === 400) {
                setErrMsg('E-mail ou senha inválidos');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            // errRef.current.focus();
        }
    }

    return (

      <div className="bg-syswater">

        <div className="account-pages ">
        <div className="container">
  <div className="justify-content-center row">
    <div className="col-md-8 col-lg-6 col-xl-4">
      <div className="overflow-hidden imagembg">
        <div className="bg-primary">
          <div className="text-primary text-center p-4">
            <h5 className="text-white font-size-20">Esqueci a Senha!</h5>
            <p className="text-white-50">Digite o E-mail a baixo para recuperar a senha</p>
            <a className="logo logo-admin" href="/">
            <img src={logoBranco} alt="LOGO_BRANCO" className="image2" />
            </a>
          </div>
        </div>
        <div className="p-4 card-body">
          <div className="p-3">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{color:"red"}}>{errMsg}</p>
            <form onSubmit={handleSubmit}  className="form-horizontal mt-4 av-valid">
              <div className="mb-3">
                <div className="form-group">
                  <label  className="">Email</label>
                  <input
                  className=" is-pristine av-valid form-control"
                    type="email"
                    id="DS_EMAIL"
                    value={DS_EMAIL}
                    onChange={(e) => setUser(e.target.value)}
                    required
                />
                 
                </div>
              </div>
             
              <div className="mb-3 row">
              
                <div className=" col-sm-6">
                  <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Enviar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 
</div> 
       </div> 

    )
}

export default EsqueciSenha
