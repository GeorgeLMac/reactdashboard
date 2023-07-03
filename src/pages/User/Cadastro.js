import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./InitialPage.css";
import logoBranco from "../../assets/images/logo-sm.png"
import useAuth from '../../services/useAuth';
import AuthService from '../../services/Auth.service';

import axios from '../../services/api';

// const USER_REGEX = /^{8,43}$/;
const USER_REGEX = /^[a-z]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;
const PWD_REGEX = /^[A-z](?=.*[0-9]){6,24}$/;
const REGISTER_URL = '/user/user';


const CadastroUsuario = () => {


    const userRef = useRef();
    const errRef = useRef();

    const [DS_EMAIL, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [CLIENT_SECRET, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(DS_EMAIL));
    }, [DS_EMAIL])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(CLIENT_SECRET));
        setValidMatch(CLIENT_SECRET === matchPwd);
    }, [CLIENT_SECRET, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [DS_EMAIL, CLIENT_SECRET, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
       
        const v2 = PWD_REGEX.test(CLIENT_SECRET);
        if ( !v2) {
            setErrMsg("Senha com tamnho minimo 6 e máximo 24 e Pelo menos uma letra Maiscula");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ DS_EMAIL, CLIENT_SECRET }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    
                }
            );
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Servidor Err');
            } else if (err.response?.status === 409) {
                setErrMsg('E-mail já Cadastradoo');
            } else {
                setErrMsg('E-mail já Cadastrado')
            }
            errRef.current.focus();
        }
    }




    return (
        
       

<>
            {success ? (

<section>
<div className="account-pages my-5 pt-sm-5">
           <div className="container">
  <div className="justify-content-center row">
    <div className="col-md-8 col-lg-6 col-xl-4">
      <div className="overflow-hidden card">
        <div className="bg-primary">
          <div className="text-primary text-center p-4">
            <h5 className="text-white font-size-20">Bem vindo!</h5>
            <p className="text-white-50">Obrigado Por cadastrar</p>
            <a className="logo logo-admin" >
            <img src={logoBranco} alt="LOGO_BRANCO" className="image2" />
            </a>
          </div>
        </div>
        <div className="p-4 card-body">
          <div className="p-3">
          <h1>Successo</h1>
                    <p>
                        <a href="/login">Entrar</a>
                    </p>
           
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 
</div>
</section>
) : (
    <section>
            <div className="account-pages my-5 pt-sm-5">
           <div className="container">
  <div className="justify-content-center row">
    <div className="col-md-8 col-lg-6 col-xl-4">
      <div className="overflow-hidden card">
        <div className="bg-primary">
          <div className="text-primary text-center p-4">
            <h5 className="text-white font-size-20">Bem vindo!</h5>
            <p className="text-white-50">Cadastre para poder logar ao Syskeeper</p>
            <a className="logo logo-admin" href="/">
            <img src={logoBranco} alt="LOGO_BRANCO" className="image2" />
            </a>
          </div>
        </div>
        <div className="p-4 card-body">
          <div className="p-3">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" style={{color:"red", marginTop: "10px"}}>{errMsg}</p>
          <form onSubmit={handleSubmit}  className="form-horizontal mt-4 av-valid">
              <div className="mb-3">
                <div className="form-group">
                <label htmlFor="DS_EMAIL">
               Digite o  email:
                            {/* <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} /> */}
                        </label>
                 
                  <input
                            type="email"
                            id="DS_EMAIL"
                            className="form-control is-untouched is-pristine av-valid"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={DS_EMAIL}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />

                </div>
              </div>
              <div className="mb-3">
                <div className="form-group">
                <label htmlFor="CLIENT_SECRET">
                            Senha:
                            {/* <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} /> */}
                        </label>
                        <input
                            type="password"
                            id="CLIENT_SECRET"
                            className="is-untouched is-pristine av-valid form-control"
                            onChange={(e) => setPwd(e.target.value)}
                            value={CLIENT_SECRET}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
               <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            6 a 24 Caracteres.<br />
                            {/* Incluir uma letra maiúscula e minuscula , um número and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span> */}
                        </p>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-group">
                <label htmlFor="confirm_pwd">
                            Confirmar Senha:
                            {/* <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} /> */}
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            className="is-untouched is-pristine av-valid form-control"
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Precisa ser igual a senha
                        </p>
                
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-sm-6">
                  <div className="form-check">
                  <p>
                Possui Conta?<br />
                <span className="line">
                    <Link to="/Login">Entrar</Link>
                </span>
                 </p>
                  </div>
                  
                </div>
                <div className="text-end col-sm-6">
                  <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Cadastrar</button>
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
</section>
            )}
        </>
    
    );
};

export default CadastroUsuario;
