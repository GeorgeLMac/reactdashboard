import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "../store/layout/global.css"


import PropTypes from 'prop-types';
// import "./assets/scss/theme.scss";

import { layoutTypes } from "../constants/layout";

import VerticalLayout from "../components/VerticalLayout/";
import HorizontalLayout from "../components/HorizontalLayout/";
import NonAuthLayout from "../components/NonAuthLayout";




//

import Dashboard from "../pages/Dashboard/index.js";

//cadastros

//configuration
import Payload from "../pages/Cadastro/Configuration/Payload";
import CadastroPayload from "../pages/Cadastro/Configuration/PayloadCadastro";
import AcoesEquipamento from "../pages/Cadastro/Configuration/AcoesEquipamento";
import AcoesEquipamentoUpdate from "../pages/Cadastro/Configuration/AcoesEquipamentoUpdate";
import RegistroUpdate from "../pages/Cadastro/Configuration/RegistroUpdate";
import Registro_Update from "../pages/Calibragem/Registro-Update";

//modulos
import Fabricante from "../pages/Cadastro/Modulo/Fabricante";
import FabricanteCadastro from "../pages/Cadastro/Modulo/FabricanteCadastro";
import FabricanteUpdate from "../pages/Cadastro/Modulo/FabricanteUpdate";
import EquipamentoLora from "../pages/Cadastro/Modulo/EquipamentoLora";
import EquipamentoLoraCadastro from "../pages/Cadastro/Modulo/EquipamentoLoraCadastro";
import EquipamentoLoraUpdate from "../pages/Cadastro/Modulo/EquipamentoLoraUpdate";

import Hidrometro from "../pages/Cadastro/Hidrometro";
import HidrometroCadastro from "../pages/Cadastro/HidrometroCadastro";
import HidrometroUpdate from "../pages/Cadastro/HidrometroUpdate";
import EquipamentoKit from "../pages/Cadastro/EquipamentoKIT";
import EquipamentoKitCadastro from "../pages/Cadastro/EquipamentoKITCadastro";
import EquipamentoKITUpdate from "../pages/Cadastro/EquipamentoKITUpdate";

//calibragem
import EditEquipamentoDmae from "../pages/Calibragem/EquipamentoDmae-edit";

import Calibragem from "../pages/Calibragem/Calibragem";
import Consumo from "../pages/Consumo/Consumo";

import Questions from "../pages/Questions/Questions";
import Ajuda from "../pages/Questions/ajuda";

import Support from "../pages/Support/Support";

//Usuarios
import ResetarSenha from "../pages/User/ResetarSenha";
import EsqueciSenha from "../pages/User/EsqueciSenha";
import LoginUsuario from "../pages/User/Login";
import CadastroUsuario from "../pages/User/Cadastro";
import LoginEmpresa from "../pages/Empresa/Login";
import CadastroEmpresa from "../pages/Empresa/Cadastro";
import InitialPage from "../pages/InitialPage/index";
import InitialUsuario from "../pages/InitialPage/indexusuario";
import InitialEmpresa from "../pages/InitialPage/indexempresa";

//EMPRESA
import Condominios from "../pages/Empresa/Condominios";
import Moradores from "../pages/Empresa/Moradores";
import MoradoresCadastro from "../pages/Empresa/MoradoresCadastro";
import ImovelCadastro from "../pages/Empresa/ImovelCadastro";
import Logout from "../pages/Authentication/Logout"

//Identificação
import Identificacao from "../pages/User/identificacao";

import AuthService from "../services/Auth.service";

const allRoutes = () => {
  // const [currentUser,setCurrentUser] = useState(undefined);
  const user = AuthService.getCurrentUser();


  const getLayout = (layoutType) => {
    let Layout = VerticalLayout;
    switch (layoutType) {
      case layoutTypes.VERTICAL:
        Layout = VerticalLayout;
        break;
      case layoutTypes.HORIZONTAL:
        Layout = HorizontalLayout;
        break;
      default:
        break;
    }
    return Layout;
  };

  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));

  const Layout = getLayout(layoutType);

  

  let checkempresa = null;
  let DS_STATUS = null;
  if(user != null){
    console.log(user)
    DS_STATUS = user.user.DS_STATUS
  if(user.empresa[0] != undefined){
    checkempresa = user.empresa[0].OID_EMPRESA
 

 }
}



  // useEffect(() => {
  //   const user = AuthService.getCurrentUser();

  //   if (user) {
  //     setCurrentUser(user);
  //   }
  // }, []);

  function publicRoutes() {
    return (
      <React.Fragment>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/*" element={<InitialPage />} />
          <Route path="/index" element={<InitialPage />} />
          <Route path="/juridico" element={<InitialEmpresa />} />
          <Route path="/fisico" element={<InitialUsuario />} />
          

          <Route path="/Login/fisico" element={<LoginUsuario />} />
          {/* <Route path="/Cadastro/fisico" element={<CadastroUsuario />} />  */}
          <Route path="/Login/juridico" element={<LoginEmpresa />} />
          <Route path="/Cadastro/juridico" element={<CadastroEmpresa />} />
          <Route path="/ajuda/ajuda" element={<Ajuda />} />
          <Route path="/ajuda/ajuda" element={<Ajuda />} />
          <Route path="/recuperar" element={<EsqueciSenha />} />
          <Route path="/resetar/:id" element={<ResetarSenha />} />
          
        </Routes>
      </React.Fragment>
    );
  }

  function privateRoutes() {
    return (
      <React.Fragment>
        <Layout>
          <Routes>

          {checkempresa != null ?

            <Route
            path="/moradores"
            element={<Moradores />}
            />

            
          : null }

          {DS_STATUS == 10 ?

          <Route
          path="/condominios"
          element={<Condominios />}
          />


          : null }

          <Route path="/logout" element={<Logout />} />
                    

            <Route
              path="/cadastro/moradores-cadastro/:id"
              element={<MoradoresCadastro />}
            />
            <Route
              path="/cadastro/imovel-cadastro"
              element={<ImovelCadastro />}
            />

            <Route path="/" element={<Dashboard />} />
            <Route
              path="/configuracao/payload"
              element={<Payload />}
            />
            <Route
              path="/configuracao/payload-cadastro"
              element={<CadastroPayload />}
            />
            <Route
              path="/configuracao/acoesequipamentos"
              element={<AcoesEquipamento />}
            />
            <Route
              path="/configuracao/acoesequipamentos-update/:id"
              element={<AcoesEquipamentoUpdate />}
            />

            <Route
              path="/configuracao/acoesequipamentos-update/:id/:state"
              element={<AcoesEquipamentoUpdate />}
            />

            <Route
              path="/configuracao/registro-update/:id/:state"
              element={<RegistroUpdate />}
            />

            <Route
              path="/calibragem/registro_update/:id/:state"
              element={<Registro_Update />}
            />

            <Route
              path="/cadastro/modulo/fabricantelora"
              element={<Fabricante />}
            />
            <Route
              path="/cadastro/modulo/fabricantelora-cadastro"
              element={<FabricanteCadastro />}
            />
            <Route
              path="/cadastro/modulo/fabricantelora-update/:id"
              element={<FabricanteUpdate />}
            />
            <Route
              path="/cadastro/modulo/equipamentolora"
              element={<EquipamentoLora />}
            />
            <Route
              path="/cadastro/modulo/equipamentolora-cadastro"
              element={<EquipamentoLoraCadastro />}
            />
            <Route
              path="/cadastro/modulo/equipamentolora-update/:id"
              element={<EquipamentoLoraUpdate />}
            />

            <Route
              path="/cadastro/modulo/equipamentolora-update/:id/:state"
              element={<EquipamentoLoraUpdate />}
            />

        <Route
              path="/cadastro/modulo/EquipamentoDmae-edit/:id"
              element={<EditEquipamentoDmae />}
            />

            <Route path="/cadastro/hidrometro" element={<Hidrometro />} />
            <Route
              path="/cadastro/hidrometro-cadastro"
              element={<HidrometroCadastro />}
            />
            <Route
              path="/cadastro/hidrometro-update/:id"
              element={<HidrometroUpdate />}
            />
            <Route
              path="/cadastro/equipamentokit"
              element={<EquipamentoKit />}
            />
            <Route
              path="/cadastro/equipamentokit-cadastro"
              element={<EquipamentoKitCadastro />}
            />
            <Route
              path="/cadastro/equipamentokit-update/:id"
              element={<EquipamentoKITUpdate />}
            />

            <Route path="/calibragem" element={<Calibragem />} />

            <Route path="/calibragem/:id" element={<Calibragem />} />

            <Route path="/calibragem/:id/:state" element={<Calibragem />} />

            {DS_STATUS != null ?
            <Route
              path="/identificacao"
              element={<Identificacao />}
            />
            : null}

            <Route path="/consumo" element={<Consumo />} />

            <Route path="/duvidas" element={<Questions />} />
            <Route path="/suporte" element={<Support />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </React.Fragment>
    );
  }

  return user ? privateRoutes() : publicRoutes();
};

export default allRoutes;
