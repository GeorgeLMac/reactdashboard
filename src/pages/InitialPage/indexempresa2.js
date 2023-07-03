import React from "react";
import { Link } from "react-router-dom";
import { Col, Card, CardBody, Container, Row, Button} from "reactstrap";
import "./InitialPage.css";
import logoBranco from "../../assets/images/logo-white.png"
import logoLight from "../../assets/images/logo-light.png"
import logoSys from "../../assets/images/logo-sys.png";
const InitialEmpresa = () => {
    return (
        <React.Fragment>
            <div className="bg-syswater">
                <div className="center">
                <span  className="image" >
              <span
              style={{color: "black",fontWeight:"600",fontSize: 55,marginLeft:"auto",marginright:"auto",textAlign: "center"}}>
                <img src={logoSys} className="logologo " alt="Logo Syswater" height="40" /> syskeeper</span>
                {/* <span className="image" style={{color: "white",fontWeight:"bold",fontSize: 70}}>Syskeeper</span> */}
                    {/* <img src={logoBranco} alt="LOGO_BRANCO" className="image" />   */}
              </span>
                </div>

                <div className="center">
                    <p style={{color:"black"}}>Área do Síndico(a)</p>
                </div>
                <div className="center">
                    <Link to="/Cadastro/juridico" style={{marginRight: "2%"}}>
                    <Button  color="purple" className="btn-lg login">Cadastre-se</Button>
                        {/* <button className="sign-up">Cadastre-se</button> */}
                    </Link>
                    <Link to="/login/juridico">
                    <Button  color="purple" className="btn-lg login">Login</Button>
                        {/* <button className="login">Login</button> */}
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default InitialEmpresa;
