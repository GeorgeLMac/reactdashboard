import React from "react";
import { Link } from "react-router-dom";

import "./InitialPage.css";
import logoBranco from "../../assets/images/logo-white.png"
import logoLight from "../../assets/images/logo-light.png"

const InitialEmpresa = () => {
    return (
        <React.Fragment>
            <div className="bg-syswater">
                <div className="center">
                <span className="image" style={{color: "white",fontWeight:"bold",fontSize: 70}}>Syskeeper</span>
                    {/* <img src={logoBranco} alt="LOGO_BRANCO" className="image" /> */}
                </div>

                <div className="center">
                    <p style={{color:"white"}}>Área do Síndico(a)</p>
                </div>
                <div className="center">
                    <Link to="/Cadastro/juridico" style={{marginRight: "2%"}}>
                        <button className="sign-up">Cadastre-se</button>
                    </Link>
                    <Link to="/login/juridico">
                        <button className="login">Login</button>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default InitialEmpresa;
