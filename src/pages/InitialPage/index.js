import React from "react";
import { Link } from "react-router-dom";

import "./InitialPage.css";
import { Col, Card, CardBody, Container, Row, Button} from "reactstrap";
import logoBranco from "../../assets/images/logo-white.png"
import logoLight from "../../assets/images/logo-light.png"
// import { fontWeight } from "@mui/system";
import logoSys from "../../assets/images/logo-sys.png";

const InitialPage = () => {
    return (
        <React.Fragment>
            <div className="bg-syswater">
                <div className="center">

                <span  className="image" >
                <span className="image" style={{color: "white",fontWeight:"bold",fontSize: 70}}>Syskeeper</span>
              {/* <span
              style={{color: "black",fontWeight:"600",fontSize: 55,marginLeft:"auto",marginright:"auto",textAlign: "center"}}>
                <img src={logoSys} className="logologo " alt="Logo Syswater" height="40" /> syskeeper</span>
                {/* <span className="image" style={{color: "white",fontWeight:"bold",fontSize: 70}}>Syskeeper</span> */}
                    {/* <img src={logoBranco} alt="LOGO_BRANCO" className="image" />   */}
              </span> 
                    {/* <span className="image" style={{color: "white",fontWeight:"bold",fontSize: 70}}>Syskeeper</span> */}
                    {/* <img src={logoBranco} alt="LOGO_BRANCO" className="image" />   */}
                </div>
                <div className="center">
                    <Link to="/juridico" style={{marginRight: "2%"}}>
                        {/* <Button   className="login">Sou Síndico(a)</Button> */}
                        <button className="sign-up">Sou Síndico(a)</button>
                    </Link>
                    <Link to="/login/fisico">
                        <Button className="login">Sou Morador(a)</Button>
                        {/* <Button color="purple" className="btn-lg login">Sou Morador(a)</Button> */}
                        {/* <button className="sign-up">Sou Morador(a)</button> */}
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default InitialPage;
