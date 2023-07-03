import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";


// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

import AuthService from "../../services/Auth.service";
const user = AuthService.getCurrentUser();




// console.log(user.empresa[0])
// console.log(user.empresa[0].OID_EMPRESA)

let checkempresa = null;
let DS_STATUS = null;
if(user != null){
	
	DS_STATUS = user.user.DS_STATUS
 if(user.empresa[0] != undefined){
  checkempresa = user.empresa[0].OID_EMPRESA
 

 }
}


const SidebarContent = props => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
    <SimpleBar className="h-100" ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{props.t("Menu")} </li>

          <li>
            <Link to="/" activeClassName="active">
              <i className="bx bx-home-circle"></i>
              <span>{props.t("Dashboards")}</span>
            </Link>
          </li>

          {DS_STATUS == 10 ?
          <>
          <li>
            <Link to="/condominios" >
              <i className="bx bxs-building-house"></i>
              <span>{props.t("Condomínios")}</span>
            </Link>
          </li>
          </>
          : null}


          {checkempresa != null ?
          <>
          <li>
            <Link to="/Moradores" >
              <i className="bx bxs-user-detail"></i>
              <span>{props.t("Moradores")}</span>
            </Link>
          </li>
          </>
          : null}


          {DS_STATUS == 1 ?
          <>
          <li className="menu-title">{props.t("Identificação")} </li>

          <li>
            <Link to="/identificacao" >
              <i className="bx bxs-user-detail"></i>
              <span className="badge rounded-pill bg-danger float-end">
                  1
                </span>
              <span>{props.t("Identificacao")}</span>
            </Link>
          </li>
          </>
          : null}


          {checkempresa != null || DS_STATUS == 10 ?
					<>	
          
       
          <li className="menu-title">{props.t("Cadastros")}</li>

          <li>
            <Link to="/#" className="has-arrow" >
              <i className="bx bxs-eraser"></i>
              
             
              
              <span>{props.t("Cadastros")}</span>
            </Link>
            <ul className="sub-menu">
             
            <li>
                <Link to="/#" className="has-arrow " >{props.t("Módulo")} <i className="mdi-chevron-right has-content"></i></Link>

                <ul className="sub-menu">
                <li>
                <Link to="/cadastro/modulo/fabricantelora">{props.t("Fabricante LORA")}</Link>
                </li>

              <li>
                <Link to="cadastro/modulo/equipamentolora">{props.t("Modulos LORA")}</Link>
              </li>

                </ul>
              </li>
              <li>
                <Link to="/cadastro/hidrometro">{props.t("Medidores")}</Link>
              </li>
              <li>
                <Link to="/cadastro/equipamentokit">{props.t("Equipamento Kit")}</Link>
              </li>
            </ul>
          </li>
          </>
          : null }

         

        
          { DS_STATUS == 10  ?
					<>	

          <li className="menu-title">Configuração</li>

          <li>
            <Link to="/#" className="has-arrow" >
              <i className="bx bxs-wrench"></i>
            
              <span>{props.t("Configuração")}</span>
            </Link>
            <ul className="sub-menu">
             
           
              <li>
                <Link to="/configuracao/payload">{props.t("Payloads")}</Link>
              </li>
              <li>
                <Link to="/calibragem">{props.t("Calibração")}</Link>
              </li>

              <li>
                <Link to="/configuracao/acoesequipamentos">{props.t("Ações Equipamentos")}</Link>
              </li>
            </ul>
          </li>
          
          </>
					: null}	

        

          

          {DS_STATUS == null || DS_STATUS == 10  ?
					<>				

          
          <li className="menu-title">Informações</li>

          <li>
            <Link to="/consumo" >
              <i className="bx bx-receipt"></i>
              <span>{props.t("consumo")}</span>
            </Link>
          </li>
          
          </>
					: null}	

        
       
           
        </ul>
      </div>
    </SimpleBar>
  </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
