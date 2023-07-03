import React, { useState, useEffect ,useRef} from "react";
import { useForm } from "react-hook-form";

 import Button from "components/shared/Button/Button";
 import Input from "components/shared/Inputs/Inputs";
import SearchTable from "components/shared/SearchTable/SearchTable";
import api from '../../services/api';
import Swal from 'sweetalert2';
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";
import AuthService from "../../services/Auth.service";
import ReactInputMask from "react-input-mask";
import InputMask from 'react-input-mask';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import relojiodemo from "../../assets/images/relojiodemo.jpeg";
import './tool.css';

const Calibragem = () => {
  let {id, state } = useParams();
  const [stateId ] = useState(state);
  const [loraId ] = useState(id);
  let navigate = useNavigate();


  
 
  const [isShowncd, setIsShowncd] = useState(false);

  const initialState = {
    reloj: "0000000",
    reloj7: "",
   
  };

  const initialStatearray = {
    porta: "",
    nrregistro: "",
    idEquipDmae: "",
   
  };

  const [myArray, setMyArray] = useState([1, 2, 3,4]);

  const initialState2 = {
    pri: "0",
    seg: "0",
    ter: "0",
    qua: "0",
    qui: "0",
    sex: "0",
    set: "0",

   
  };

  const inputRef = useRef(null);

  const user = AuthService.getCurrentUser();

  
  let checkempresa = null;
  let razao = null;
  let DS_STATUS = null;
  let OID_USUARIO = null;
  if(user != null){
    DS_STATUS = user.user.DS_STATUS
    OID_USUARIO = user.user.OID_USUARIO
  if(user.empresa[0] != undefined){
    checkempresa = user.empresa[0].OID_EMPRESA
    razao = user.empresa[0].NM_RAZAO_SOCIAL;
  }
  }
  


  const [reload, setReload] = useState(false);
  const [lora, setLora] = useState([]);
  const [lorae, setLorae] = useState([]);
  const [relojcol1, setRelojcol1] =  useState(initialState2);
  const [relojcol2, setRelojcol2] =  useState(initialState2);
  const [relojcol3, setRelojcol3] =  useState(initialState2);
  const [relojcol4, setRelojcol4] =  useState(initialState2);

  const [relojio, setRelojio] = useState(initialState);
  const [relojio1, setRelojio1] = useState(initialState);
  const [relojio2, setRelojio2] = useState(initialState);
  const [relojio3, setRelojio3] = useState(initialState);
  const [relojio4, setRelojio4] = useState(initialState);

  const [relojio1t, setRelojio1t] = useState(initialState);
  const [relojio2t, setRelojio2t] = useState(initialState);
  const [relojio3t, setRelojio3t] = useState(initialState);
  const [relojio4t, setRelojio4t] = useState(initialState);

  const {register,setValue,getValues} = useForm();
  const [set, setCalib] =  useState(initialState);
  const [setp, setCalibp] =  useState(initialState);
  const [search, setSearch] = useState(initialState);
  const [setRegistro, setRegistroCadastro] = useState([]);
  // const [edit, setEdit] = useState({ watch: "", decLiter: 0, liter: 0 });
  const [edit, setEdit] = useState([]);
  const [editPulso, setEditPulso] = useState([]);
  
  const [pulso, setPulso] = useState(initialState);
  const [local, setLocal] = useState(initialState);
  const [values, setValues] = useState([]);
  const [equipDMAE, setEquipDMAE] = useState([]);
  const [calibp1, setCalibp1] = useState([]);
  const [calibp2, setCalibp2] = useState([]);
  const [calibp3, setCalibp3] = useState([]);
  const [calibp4, setCalibp4] = useState([]);
  const [valor, setValor] = useState([]);
  const [valor1, setValor1] = useState([]);
  const [valor2, setValor2] = useState([]);
  const [valor3, setValor3] = useState([]);
  const [valor4, setValor4] = useState([]);


  
  let lastTwoZeros = '';

  const formatValues = (arr) => {
    arr = {
      base: arr.BASE_TEMPO,
      battery: arr.BATERIA,
      register: arr.DATA_REGISTRO,
      nrregistro: arr.nrregistro,
      ui: arr.DEVICE_UI,
      gps: arr.GPS_ALTURA,
      hidro: arr.HIDROMETRO,
      local: arr.localidade,
      module: arr.NR_MODULO,
      clock: arr.RELOJOARIA,
      rss: arr.RSS,
      snr: arr.SNR,
       pulse: arr.VR_PULSO,
       pulse_ini : arr.PULSO.INICIAL,
      idEquipDmae: arr.OID_EQUIP_DMAE,
    };
    return arr;
  };

  const fetchLora = () => {
    
    let lora = [{ id: "",  lora: "Selecione..." }];
    api.get("/equipmentslora").then((response) => {
      response.data.map((elem) => {
        lora.push({
          
          lora: elem.NR_EQUIPAMENTO,
        });
      });
      setLora(lora);
     
    });
  };

  useEffect(() => {
   
    fetchLora();
  }, []);

  const submitHandler = (event) => {
    event.preventDefault();
    setCalibp({ ...initialState, searched: false });
    setCalib({ ...initialState, searched: false });
    if (search.hydro === "" && lorae.lora === "") {
      Swal.fire({
        icon: "warning",
        text: "Preencha ao menos um campo",
      });
      return;
    }
    const body = {
      NR_MEDIDOR: search.hydro,
      NR_EQUIPAMENTO: lorae.lora,
   
    };
    api.post("/calibration", body).then((response) => {
      let arr = response.data;
      if (arr.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Este Modulo não possui Registros, cadastre um kit primeiro!",
        });
        setValues([]);
        setCalib({ ...initialState, searched: false });
      } else {

        const result = [];

        for (let i = response.data.length - 1; i >= 0; i--) {
          const consumption = response.data[i];
          const data = {

            base: consumption.base_tempo,
            battery: consumption.bateria,
            register: consumption.data_registro,
            nrregistro: consumption.nrregistro,
            ui: consumption.device_ui,
            gps: consumption.gps_altura,
            hidro: consumption.hidrometro,
            local: consumption.localidade,
            module: consumption.nr_modulo,
            clock: consumption.relojoaria,
            rss: consumption.rss,
            snr: consumption.snr,
            porta: consumption.PORTA,
             pulse: consumption.vr_pulso,
             pulse_ini : consumption.pulso_inicial,
            idEquipDmae: consumption.oid_equip_dmae,
            idretorno: consumption.oidretorno,

          };
          

          result.push(data);
        }
        // console.log(arr);
        // setValues([formatValues(arr[0])]);
        // setValues(arr);
        let result2 = result;
        console.log(result)
        
        setRegistroCadastro(result[0].nrregistro)
        
        if (result.length < 4){
         result2 = result.concat(new Array(1).fill([result.length+1,result[0].idEquipDmae]));
        }
        
        // console.log(arr);
        // setValues([formatValues(arr[0])]);
        // setValues(arr);
     

        setCalib({ ...initialState, searched: false });
       
        setValues(result2.reverse());
        setSearch({ ...initialState, searched: true });
      }
    }).catch(function () {
      Swal.fire({
        icon: "warning",
        text: "Nenhum resultado encontrado, refaça a sua busca!",
      });
    });
  };


  const onChangeHandlerValor1 = (prop) => (event) => {
    setValor1({ ...search, [prop]: event.target.value });
  };
  const onChangeHandlerValor2 = (prop) => (event) => {
    setValor2({ ...search, [prop]: event.target.value });
  };
  const onChangeHandlerValor3 = (prop) => (event) => {
    setValor3({ ...search, [prop]: event.target.value });
  };
  const onChangeHandlerValor4 = (prop) => (event) => {
    setValor4({ ...search, [prop]: event.target.value });
  };


  const onChangeHandlerinicial = (prop) => (event) => {
   // let replace = event.target.value.replace(/\D/g)
     setValor({ valor, [prop]:  event.target.value });
   }

  const submitHandleredit = (event) =>{
    event.preventDefault();
   
    let lorar = '';

    if(calibp1[0]){

      lorar=calibp1[0].ui;
     // NM_PULSO_INICIAL: getValues('inicial1')?getValues('inicial1').replace(/\D/g,''):null,

    let registro1 =
     {
      DS_RELOJOARIA_INICIAL: relojio1.reloj,
      NM_PULSO_INICIAL: valor1.valor ? valor1.valor.replace(/\D/g,''):null,
      OID_USU_ALTER: OID_USUARIO
    };
    
    api
      .put(`/registrosportas/${calibp1[0].idEquipDmae}`, registro1)
    }

    if(calibp2[0]){
      lorar=calibp2[0].ui;
      let registro2 =
       {
        DS_RELOJOARIA_INICIAL: relojio2.reloj,
        NM_PULSO_INICIAL: valor2.valor ? valor2.valor.replace(/\D/g,''):null,
         OID_USU_ALTER: OID_USUARIO
      };
      
      api
        .put(`/registrosportas/${calibp2[0].idEquipDmae}`, registro2)
      }

      if(calibp3[0]){
        lorar=calibp3[0].ui;
        let registro3 =
         {
          DS_RELOJOARIA_INICIAL: relojio3.reloj,
          NM_PULSO_INICIAL: valor3.valor ? valor3.valor.replace(/\D/g,''):null,
           OID_USU_ALTER: OID_USUARIO
        };
        
        api
          .put(`/registrosportas/${calibp3[0].idEquipDmae}`, registro3)
        }

        if(calibp4[0]){
          lorar=calibp4[0].ui;
          let registro4 =
           {
            DS_RELOJOARIA_INICIAL: relojio4.reloj,
            NM_PULSO_INICIAL: valor4.valor ? valor4.valor.replace(/\D/g,''):null,
             OID_USU_ALTER: OID_USUARIO
          };
          
          api
            .put(`/registrosportas/${calibp4[0].idEquipDmae}`, registro4)
          }
      

   

          api
      .put(`/registros/resetar/${lorar}`)
      .then((response) => {
        setReload(true);
        Swal.fire({
          icon: "success",
          title: "Calibragem da porta feita com Sucesso",
        }).then(() => {

          
          navigate(`/calibragem/${lorar}`);
         
           window.location.reload(true)
          
          
			// history.push("/calibragem");
		})
      })
      .catch((error) => {
        Swal.fire({
          icon: "warning",
          text: "Erro de Conexão, Tente novamente em alguns minutos.",
        });
      });
    
    
}

  const submitHandlerPulso = (event) => {
    event.preventDefault();

    let lorar = '';

    lorar = edit.lora;

    if (
      
      edit.watch < 0 
    ) {
      Swal.fire({
        icon: "warning",
        text: "Valores para Litros e Dec. Litros tem que serem entre 0 e 9999",
      });
      return;
    }

    
    let aux = equipDMAE;
    aux = {
      ...aux,
      NM_PULSO_INICIAL: edit.watch,
      OID_USU_ALTER: OID_USUARIO
    };
    api
      .put(`/registrosportas/${edit.OID_REGISTRO_PORTA_MEDIDOR}`, aux)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Pulso Inicial Alterado com Sucesso",
        }).then(() => {
          navigate(`/calibragem/${lorar}`);
         
          window.location.reload(true)
		});
      })
      .catch((error) => {
        Swal.fire({
          icon: "warning",
          text: "Erro de Conexão, Tente novamente em alguns minutos.",
        });
      });
  };

  const onChangeHandlerlora = (prop) => (event) => {
    setLorae({ ...search, [prop]: event.target.value });
  };

  const onChangeHandler = (prop) => (event) => {
    setSearch({ ...search, [prop]: event.target.value });
  };

  const onChangeHandlerEdit = (prop) => (event) => {
    setEdit({ ...edit, [prop]: event.target.value });
  };
  const onChangeHandlerEditPulso = (prop) => (event) => {
    setEditPulso({ ...edit, [prop]: event.target.value });
  };
  const onChangeHandlerstuck = (prop) => (event) => {
    
  };

  const onChangeHandlerreloj = (prop) => (event) => {
    setEdit({ ...edit, [prop]: event.target.value });
  };
  const onChangeHandlerPulso = (prop) => (event) => {
    setPulso({ ...edit, [prop]: event.target.value });
  };
  const onChangeHandlerlocal = (prop) => (event) => {
    setLocal({ ...edit, [prop]: event.target.value });
  };

  function padWithLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

 
  const onChangeHandlerreloj1 = (prop) => (event) => {

    
    let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = padWithLeadingZeros(value, 7)
  
  event.target.value = value;

   setRelojcol1({ 
    ["set"]: value.slice(-1) ,
    ["sex"]: value.slice(-2,-1),
    ["qui"]: value.slice(-3,-2),
    ["qua"]: value.slice(-4,-3),
    ["ter"]: value.slice(-5,-3),
    ["seg"]: value.slice(-6,-4),
    ["pri"]: value.slice(-7,-5),
  });

    setRelojio1({ ...edit, [prop]: event.target.value });
  };

  const onChangeHandlerreloj2 = (prop) => (event) => {

    let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = padWithLeadingZeros(value, 7)
  
  event.target.value = value;

   setRelojcol2({ 
    ["set"]: value.slice(-1) ,
    ["sex"]: value.slice(-2,-1),
    ["qui"]: value.slice(-3,-2),
    ["qua"]: value.slice(-4,-3),
    ["ter"]: value.slice(-5,-3),
    ["seg"]: value.slice(-6,-4),
    ["pri"]: value.slice(-7,-5),
  });

    setRelojio2({ ...edit, [prop]: event.target.value });
  };
  const onChangeHandlerreloj3 = (prop) => (event) => {

    let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = padWithLeadingZeros(value, 7)
  
  event.target.value = value;

   setRelojcol3({ 
    ["set"]: value.slice(-1) ,
    ["sex"]: value.slice(-2,-1),
    ["qui"]: value.slice(-3,-2),
    ["qua"]: value.slice(-4,-3),
    ["ter"]: value.slice(-5,-3),
    ["seg"]: value.slice(-6,-4),
    ["pri"]: value.slice(-7,-5),
  });

    setRelojio3({ ...edit, [prop]: event.target.value });
  };
  const onChangeHandlerreloj4 = (prop) => (event) => {

    let value = event.target.value;
  value = value.replace(/\D/g, "");
  value = padWithLeadingZeros(value, 7)
  
  event.target.value = value;

   setRelojcol4({ 
    ["set"]: value.slice(-1) ,
    ["sex"]: value.slice(-2,-1),
    ["qui"]: value.slice(-3,-2),
    ["qua"]: value.slice(-4,-3),
    ["ter"]: value.slice(-5,-3),
    ["seg"]: value.slice(-6,-4),
    ["pri"]: value.slice(-7,-5),
  });

    setRelojio4({ ...edit, [prop]: event.target.value });
  };


  const handleClick = (calib) => {
   
    setCalib({ ...initialState, searched: false });
    setCalibp({ ...initialState, searched: true });

    setRelojio({

      reloj: calib.clock,
      
      
    });

    setEdit({

      OID_REGISTRO_PORTA_MEDIDOR: calib.idEquipDmae,
      lora: calib.ui,
      porta: calib.porta,
      watch: calib.pulse_ini ? calib.pulse_ini : "0",
      
    });

    setTimeout(
      window.scrollTo({
        // top: 0,
        top: 600,
        behavior: 'smooth',
        }),
      1000
  )

  }

  const handleClickpulso = (calib) => {
   
    console.log(calib.ui)
    const body = { NR_EQUIPAMENTO: calib.ui };
    api.post("/calibration", body).then((response) => {
      let arr = response.data;
      const result = [];

      for (let i = response.data.length - 1; i >= 0; i--) {
        const consumption = response.data[i];
        const data = {
       
       //   NR_MEDIDOR: consumption.MEDIDOR.NR_MEDIDOR,
        //  IDA: consumption.MEDIDOR.IDA,

          // NR_MEDIDOR: consumption.NR_HIDROMETRO_IMOVEL,
          // DS_MODELO_MEDIDOR: consumption.DS_MODELO_MEDIDOR,
          // DS_LOCALIDADE: consumption.DS_LOCALIDADE,
          // NR_DIFERENCA_CONSUMO:
          // Math.trunc(consumption.NR_VLR_PULSO/10) -
          // Math.trunc(oldValue.NR_VLR_PULSO/10) || 0,
          // NR_QUANTIDADE_LITROSMC: consumption.NR_QUANTIDADE_LITROS/1000,    
          // DT_RX_TIMED: new Date(consumption.DT_LEITURA).toLocaleDateString(),
          // DT_RX_TIMEH: new Date(consumption.DT_LEITURA).toLocaleTimeString(),

          base: consumption.base_tempo,
          battery: consumption.bateria,
          register: consumption.data_registro,
          nrregistro: consumption.nrregistro,
          ui: consumption.device_ui,
          gps: consumption.gps_altura,
          hidro: consumption.hidrometro,
          local: consumption.localidade,
          module: consumption.nr_modulo,
          clock: consumption.relojoaria,
          rss: consumption.rss,
          snr: consumption.snr,
          porta: consumption.PORTA,
           pulse: consumption.vr_pulso,
           pulse_ini : consumption.pulso_inicial,
          idEquipDmae: consumption.oid_equip_dmae,

        };
        
        result.push(data);
      }
      let result2 = result;
      setRegistroCadastro(result[0].nrregistro)
      if (result.length < 4){
       result2 = result.concat(new Array(1).fill([result.length+1,result[0].idEquipDmae]));
      }
      console.log(result)

     
      
      const p1 = result.filter(element => element.porta === 1);
      const p2 = result.filter(element => element.porta === 2);
      const p3 = result.filter(element => element.porta === 3);
      const p4 = result.filter(element => element.porta === 4);
      //  calib1.push(p1)
     
      setCalibp1(p1);
      setCalibp2(p2);
      setCalibp3(p3);
      setCalibp4(p4);

      
      setValor1(p1[0] ? { valor: p1[0].pulse } : { valor: "0" });
      setValor2(p2[0] ? { valor: p2[0].pulse } : { valor: "0" });
      setValor3(p3[0] ? { valor: p3[0].pulse } : { valor: "0" });
      setValor4(p4[0] ? { valor: p4[0].pulse } : { valor: "0" });
      
     
    
      setCalib({ ...initialState, searched: true });
      setCalibp({ ...initialState, searched: false });


    
     
      setValues(result2.reverse());
      setSearch({ ...initialState, searched: true });

     
   
    
    });
  }

  useEffect(() => {
    if (loraId) {
      const body = { NR_EQUIPAMENTO: loraId };
      api.post("/calibration", body).then((response) => {
        let arr = response.data;
        const result = [];

        for (let i = response.data.length - 1; i >= 0; i--) {
          const consumption = response.data[i];
          const data = {
         
         //   NR_MEDIDOR: consumption.MEDIDOR.NR_MEDIDOR,
          //  IDA: consumption.MEDIDOR.IDA,

            // NR_MEDIDOR: consumption.NR_HIDROMETRO_IMOVEL,
            // DS_MODELO_MEDIDOR: consumption.DS_MODELO_MEDIDOR,
            // DS_LOCALIDADE: consumption.DS_LOCALIDADE,
            // NR_DIFERENCA_CONSUMO:
            // Math.trunc(consumption.NR_VLR_PULSO/10) -
            // Math.trunc(oldValue.NR_VLR_PULSO/10) || 0,
            // NR_QUANTIDADE_LITROSMC: consumption.NR_QUANTIDADE_LITROS/1000,    
            // DT_RX_TIMED: new Date(consumption.DT_LEITURA).toLocaleDateString(),
            // DT_RX_TIMEH: new Date(consumption.DT_LEITURA).toLocaleTimeString(),

            base: consumption.base_tempo,
            battery: consumption.bateria,
            register: consumption.data_registro,
            nrregistro: consumption.nrregistro,
            ui: consumption.device_ui,
            gps: consumption.gps_altura,
            hidro: consumption.hidrometro,
            local: consumption.localidade,
            module: consumption.nr_modulo,
            clock: consumption.relojoaria,
            rss: consumption.rss,
            snr: consumption.snr,
            porta: consumption.PORTA,
             pulse: consumption.vr_pulso,
             pulse_ini : consumption.pulso_inicial,
            idEquipDmae: consumption.oid_equip_dmae,

          };
          
          

          result.push(data);
        }
        let result2 = result;
        setRegistroCadastro(result[0].nrregistro)
        if (result.length < 4){
         result2 = result.concat(new Array(1).fill([result.length+1,result[0].idEquipDmae]));
        }
        console.log(result)

       
        
        const p1 = result.filter(element => element.porta === 1);
        const p2 = result.filter(element => element.porta === 2);
        const p3 = result.filter(element => element.porta === 3);
        const p4 = result.filter(element => element.porta === 4);
        //  calib1.push(p1)
       
        setCalibp1(p1);
        setCalibp2(p2);
        setCalibp3(p3);
        setCalibp4(p4);


       
      if(state == "calib" ){
        setCalib({ ...initialState, searched: true });

      }
       
        setValues(result2.reverse());
        setSearch({ ...initialState, searched: true });

       
     
      
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(
      window.scrollTo({
        // top: 0,
        top: 600,
        behavior: 'smooth',
        }),
      1000
  )
  
  }, [set]);

  useEffect(() => {
   if(calibp1[0]){

   let value = (calibp1[0].clock?calibp1[0].clock:"0000000").replace(/\D/g, "");
    value = padWithLeadingZeros(value, 7)

    setRelojcol1({ 
      ["set"]: value.slice(-1) ,
      ["sex"]: value.slice(-2,-1),
      ["qui"]: value.slice(-3,-2),
      ["qua"]: value.slice(-4,-3),
      ["ter"]: value.slice(-5,-3),
      ["seg"]: value.slice(-6,-4),
      ["pri"]: value.slice(-7,-5),
    });
   
    setRelojio1({ "reloj": value });
   
   }
  
  
  }, [calibp1[0]]);

  useEffect(() => {
    if(calibp2[0]){
 
    let value = (calibp2[0].clock?calibp2[0].clock:"0000000").replace(/\D/g, "");
     value = padWithLeadingZeros(value, 7)
 
     setRelojcol2({ 
       ["set"]: value.slice(-1) ,
       ["sex"]: value.slice(-2,-1),
       ["qui"]: value.slice(-3,-2),
       ["qua"]: value.slice(-4,-3),
       ["ter"]: value.slice(-5,-3),
       ["seg"]: value.slice(-6,-4),
       ["pri"]: value.slice(-7,-5),
     });
    
     setRelojio2({ "reloj": value });

    }
   
   
   }, [calibp2[0]]);

   useEffect(() => {
    if(calibp3[0]){
 
    let value = (calibp3[0].clock?calibp3[0].clock:"0000000").replace(/\D/g, "");
     value = padWithLeadingZeros(value, 7)
 
     setRelojcol3({ 
       ["set"]: value.slice(-1) ,
       ["sex"]: value.slice(-2,-1),
       ["qui"]: value.slice(-3,-2),
       ["qua"]: value.slice(-4,-3),
       ["ter"]: value.slice(-5,-3),
       ["seg"]: value.slice(-6,-4),
       ["pri"]: value.slice(-7,-5),
     });
    
     setRelojio3({ "reloj": value });
    
    }
   
   
   }, [calibp3[0]]);

   useEffect(() => {
    if(calibp4[0]){
 
    let value = (calibp4[0].clock?calibp4[0].clock:"0000000").replace(/\D/g, "");
     value = padWithLeadingZeros(value, 7)
 
     setRelojcol4({ 
       ["set"]: value.slice(-1) ,
       ["sex"]: value.slice(-2,-1),
       ["qui"]: value.slice(-3,-2),
       ["qua"]: value.slice(-4,-3),
       ["ter"]: value.slice(-5,-3),
       ["seg"]: value.slice(-6,-4),
       ["pri"]: value.slice(-7,-5),
     });
    
     setRelojio4({ "reloj": value });
    
    }
   
   
   }, [calibp4[0]]);



console.log("valor"+valor.inicial1)
console.log("valor"+valor.inicial2)
console.log("valor"+valor.inicial3)
console.log("valor"+valor.inicial4)

  return (
    <React.Fragment>
      <div className="page-content">
     
          <title>Calibragem</title>
       
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Calibragem</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                 
                  </li>
                </ol>
              </Col>
            </Row>
          </div>
        </Container>

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
              

                <Row className="mb-3">
                    
                    <label
                      htmlFor="Equipamento"
                      className="col-md-2 col-form-label"
                    >
                      Modulo Lora
                    </label>
                    <div className="col-6" >
                    <Input
                      id="fab-search"
                      
                      options={[lora, "lora"]}
                      value={lorae.lora}
                      type="select"
                      onChange={onChangeHandlerlora("lora")}
                   
                    />
                  </div>
                  </Row>

                  <Row className="mb-3">
                    <div className="button-items text-center">
                      <Button
                        color="secondary"
                        className="btn-lg"
                        action={submitHandler}
                        text="Pesquisar"
                      >
                        Pesquisar
                        <i className="dripicons-search" />
                      </Button>
                    </div>
                  </Row>
              
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Container fluid>
          <div className="table-responsive">
            <table className="table align-middle table-nowrap mb-0 overflow-hidden">
              <thead className="table-light">
                <tr>
               
                  <th className="align-middle">Medidor</th>
                  <th className="align-middle">Porta</th>
                  <th className="align-middle">Módulo LORA</th>
                  <th className="align-middle">Localidade</th>
                  <th className="align-middle">Relojoaria</th>
                  <th className="align-middle">Device UI</th>
                  <th className="align-middle">SNR</th>
                  <th className="align-middle">RSS</th>
                  <th className="align-middle">GPS</th>
                   <th className="align-middle">Pulso</th> 
                   <th className="align-middle">Pulso Inicial</th> 
                  <th className="align-middle">Bateria</th>
                  <th className="align-middle">Base Tempo</th>
                  <th className="align-middle">Data</th>
                  <th className="align-middle">Hora</th>
                 
                  <th className="align-middle"> </th>
                  <th className="align-middle"> </th>
                </tr>
              </thead>
              <tbody>
              {/* {console.log(values)} */}
           
             
                {search.searched ? (
                 
                  values?.map((calib, key) => (
                   
                    <tr key={"_tr_" + key}>
                      {/* <td>
                        <a
                          type="button"
                           onClick={()=>{handleClick(calib)}}
                          //  onClick={ () => setEdit(calib)}
                          // onClick={e => handleClick(e, calib)}
                          // onClick={() => { console.log("button clicked");}}
                          // onClick = {(e) => console.log("button clicked")}
                          text="Pesquisar"
                         
                          
                          color="link"
                          size="sm"
                          className="btn btn-light waves-effect waves-light"
                        >
                          Calibrar
                        </a>
                      </td> */}
                      <td> {calib.hidro && (
                        <div>
                          {calib.hidro} {"   "} {" "}{" "}
                          <Link
                            type="button"
                            to={`/calibragem/Registro_Update/${setRegistro}/create`}
                            color="link"
                            size="sm"
                            className="btn btn-light waves-effect waves-light"
                          >
                            <i className="dripicons-document-edit" /> Trocar
                          </Link>
                        </div>
                      )}

                      {!calib.hidro ? 
                        <Link
                          type="button"
                          to={`/configuracao/registro-update/${setRegistro}/create`}
                          color="link"
                          size="sm"
                          className="btn btn-light waves-effect waves-light"
                        >
                          <i className="dripicons-plus" /> Adicionar Porta
                        </Link>
                      : ""} </td>
                      <td>{calib.porta}</td>
                      <td>{calib.module}</td>
                      <td>{calib.local}</td>
                      <td >{calib.clock}

                     
                             
                      </td>
                      <td>{calib.ui}</td>
                      <td>{calib.snr}</td>
                      <td>{calib.rss}</td>
                      <td>{calib.gps}</td>
                       <td>
                       {
                         (() => {
                            if(calib.ui){
                              return calib.pulse ? calib.pulse:"0" 
                            }
                         })()
                        }
                        </td> 
                       <td>
                       {(() => {
                        if (calib.ui && DS_STATUS == 10) {
                          return (
                            <div>
                              {calib.pulse_ini ? calib.pulse_ini : "0"}
                              <a
                                style={{ left: "5%" }}
                                type="button"
                                onClick={() => {
                                  handleClick(calib);
                                }}
                                color="link"
                                size="sm"
                                className="btn btn-light waves-effect waves-light"
                              >
                                <i className="dripicons-document-edit" />
                              </a>
                            </div>
                          );
                        } else {
                          return null
                        }
                      })()}
                        
                        </td> 
                      <td>{calib.battery}</td>
                      <td>{(calib.ui? "360min" :"" )} </td>
                      <td>
                      {calib.register ? new Date(calib.register).toLocaleDateString(): ""}
                      </td>
                      <td>
                      {calib.register ?new Date(calib.register).toLocaleTimeString(): ""}</td>
                      
                      <td>
                      {calib.ui ? 
                      <button 
                        type="button"
                        onClick={()=>{handleClickpulso(calib)}}
                        color="link"
                        size="sm"
                        className="btn-light waves-effect waves-light"
                      >
                        <i className="dripicons-cloud-upload" /> Enviar Dados
                      </button>
                      : ""}
                    
                      </td>
                      <td>
                        <Link
                          type="button"
                          to={`/cadastro/modulo/EquipamentoDmae-edit/${setRegistro}`}
                          color="link"
                          size="sm"
                          className="btn btn-light waves-effect waves-light"
                        >
                          <i className="dripicons-cloud-upload" /> Substituição
                        </Link>
                      </td>
                    </tr>
                  ))
                 
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </Container>
        {set.searched ? (

          <Container fluid>
             {isShowncd && (
                <div  className= {`box-right arrow-left`} ><div>
                 <img style={{ display: "block !important"}} src={relojiodemo} height="350" alt="CD"  onMouseOver={() => setIsShowncd(true)}  onMouseOut={() => setIsShowncd(false)}/>
                </div> </div> 
                 )}
            <div className="table-responsive mt-5 mb-1" style={{ fontSize: "110%",display: "flex" }}>

           
                    {calibp1[0]? (

                    
              
              <div className="col-md-3 ">
              <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Alteração Relojoaria</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                 
                  </li>
                </ol>
              </Col>
            </Row>
              <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Porta 
                  </label>
                  <span className="btext" >{calibp1[0] ? calibp1[0].porta :"0"}</span>
                </Row> 

                <input
                        {...register("relojio1", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="relojio1"
                        
                        value={relojio1.reloj? relojio1.reloj : "0000000"}
                      />
                
               {calibp1[0].pulse_ini == "0" || !calibp1[0].pulse_ini ?  (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                    Pulso Inicial
                  </label>
                  <div className="">
                  <input
                        //onChange={onChangeHandlerreloj1("reloj")}
                        //mask = "9999999"
                        onChange={onChangeHandlerValor1("valor")}
                        className="form-control form-control-lg"
                        type="text"
                        value={valor1.valor}
                       
                     
                      />

                  </div>
                </Row>
                 ) : (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                  Pulso Inicial 
                  </label>
                  <span className="btext" >{calibp1[0].pulse_ini ? calibp1[0].pulse_ini :"0"}</span>
                </Row> 
              )}
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                    Relógio
                  </label>
                  <div className="">
                  <ReactInputMask
                        onChange={onChangeHandlerreloj1("reloj")}
                        mask = "9999999"
                        className="form-control form-control-lg"
                        type="text"
                        // value={relojio1.reloj? relojio1.reloj :  relojio1t.reloj?relojio1t.reloj:"0000000" }
                        defaultValue={calibp1[0].clock ? calibp1[0].clock :"0000000"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />

                      
                
                  </div>
                </Row>

                <Row className="mb-1 col-md-8">
                  <div  className="col-md-12 col-form-label">
                  <label htmlFor="codigo" className="">
                    m3
                  </label>
                  <span className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  /> </span>
                  </div>

                  <div className="col-md-12">
                  <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol1.pri}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol1.seg}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol1.ter}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol1.qua}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol1.qui}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol1.sex}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol1.set}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                
                  </div>
                </Row>
                </div>
                 ) : (
                  <></>
                )}
                {calibp2[0]? (
              
              <div className="col-md-3">
              <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Alteração Relojoaria</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                 
                  </li>
                </ol>
              </Col>
            </Row>
              <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Porta 
                  </label>
                  <span className="btext" >{calibp2[0] ? calibp2[0].porta :"0"}</span>
                
                </Row> 
                
                <input
                        {...register("relojio2", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="relojio1"
                        
                        value={relojio2.reloj? relojio2.reloj : "0000000"}
                      />

                   { calibp2[0].pulse_ini == "0" || !calibp2[0].pulse_ini ? (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                    Pulso Inicial
                  </label>
                  <div className="">
                  <input
                        //onChange={onChangeHandlerreloj1("reloj")}
                        //mask = "9999999"
                        onChange={onChangeHandlerValor2("valor")}
                        className="form-control form-control-lg"
                        type="text"
                        value={valor2.valor}
                        
                        // value={relojio1.reloj? relojio1.reloj :  relojio1t.reloj?relojio1t.reloj:"0000000" }
                        //defaultValue={calibp2[0].pulse ? calibp2[0].pulse :"0"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />

                  </div>
                </Row>
                 ) : (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                  Pulso Inicial 
                  </label>
                  <span className="btext" >{calibp2[0].pulse_ini ? calibp2[0].pulse_ini :"0"}</span>
                </Row> 
              )}

                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Relógio
                  </label>
                  <div className="">
                  <ReactInputMask
                        onChange={onChangeHandlerreloj2("reloj")}
                        mask = "9999999"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue={calibp2[0].clock ? calibp2[0].clock :"0000000"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />
                
                  </div>
                </Row>
             

                <Row className="mb-1 col-md-8">
                <div  className="col-md-12 col-form-label">
                  <label htmlFor="codigo" className="">
                    m3
                  </label>
                  <span className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  /> </span>
                  </div>
                  <div className="col-md-12">
                  <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol2.pri}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol2.seg}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol2.ter}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol2.qua}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol2.qui}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol2.sex}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol2.set}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                
                  </div>
                </Row>
                </div>
                 ) : (
                  <></>
                )}
                {calibp3[0]? (
              
              <div className="col-md-3">
              <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Alteração Relojoaria</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
            
                  </li>
                </ol>
              </Col>
            </Row>
              <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Porta 
                  </label>
                  <span className="btext" >{calibp3[0] ? calibp3[0].porta :"0"}</span>
                </Row> 
                
                <input
                        {...register("relojio3", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="relojio1"
                        
                        value={relojio3.reloj? relojio3.reloj : "0000000"}
                      />

                         { calibp3[0].pulse_ini == "0" || !calibp3[0].pulse_ini ? (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                    Pulso Inicial
                  </label>
                  <div className="">
                  <input
                        //onChange={onChangeHandlerreloj1("reloj")}
                        //mask = "9999999"
                        onChange={onChangeHandlerValor3("valor")}
                        className="form-control form-control-lg"
                        type="text"
                        value={valor3.valor}
                        
                        // value={relojio1.reloj? relojio1.reloj :  relojio1t.reloj?relojio1t.reloj:"0000000" }
                        //defaultValue={calibp3[0].pulse ? calibp3[0].pulse :"0"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />

                  </div>
                </Row>
                 ) : (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                  Pulso Inicial 
                  </label>
                  <span className="btext" >{calibp3[0].pulse_ini ? calibp3[0].pulse_ini :"0"}</span>
                </Row> 
              )}

                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Relógio
                  </label>
                  <div className="">
                  <ReactInputMask
                        onChange={onChangeHandlerreloj3("reloj")}
                        mask = "9999999"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue={calibp3[0].clock ? calibp3[0].clock :"0000000"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />
                
                  </div>
                </Row>
             

                <Row className="mb-1 col-md-8">
                <div  className="col-md-12 col-form-label">
                  <label htmlFor="codigo" className="">
                    m3
                  </label>
                  <span className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  /> </span>
                  </div>
                  <div className="col-md-12">
                  <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol3.pri}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol3.seg}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol3.ter}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol3.qua}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol3.qui}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol3.sex}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol3.set}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                
                  </div>
                </Row>
                </div>
                 ) : (
                  <></>
                )}
                {calibp4[0]? (
              
              <div className="col-md-3">
              <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Alteração Relojoaria</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                 
                  </li>
                </ol>
              </Col>
            </Row>
              <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-8 col-form-label">
                    Porta 
                  </label>
                  <span className="btext" >{calibp4[0] ? calibp4[0].porta :"0"}</span>
                </Row> 


                <input
                        {...register("relojio4", { required: true })}
                        className="form-control form-control-lg"
                        type="hidden"
                        name="relojio1"
                        
                        value={relojio4.reloj? relojio4.reloj : "0000000"}
                      />

                        { calibp4[0].pulse_ini == "0" || !calibp4[0].pulse_ini ? (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                    Pulso Inicial
                  </label>
                  <div className="">
                  <input
                        //onChange={onChangeHandlerreloj1("reloj")}
                        //mask = "9999999"
                        onChange={onChangeHandlerValor4("valor")}
                        className="form-control form-control-lg"
                        type="text"
                        value={valor4.valor}
                        
                        
                        // value={relojio1.reloj? relojio1.reloj :  relojio1t.reloj?relojio1t.reloj:"0000000" }
                        //defaultValue={calibp4[0].pulse ? calibp4[0].pulse :"0"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />

                  </div>
                </Row>
                 ) : (
                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-12 col-form-label">
                  Pulso Inicial 
                  </label>
                  <span className="btext" >{calibp4[0].pulse_ini ? calibp4[0].pulse_ini :"0"}</span>
                </Row> 
              )}
                

                <Row className="mb-1 col-md-8">
                  <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Relógio
                  </label>
                  <div className="">
                  <ReactInputMask
                        onChange={onChangeHandlerreloj4("reloj")}
                        mask = "9999999"
                        className="form-control form-control-lg"
                        type="text"
                        defaultValue={calibp4[0].clock ? calibp4[0].clock :"0000000"}
                        // style={{textAlign: "center",fontSize: '20px' }}
                       
                      />
                
                  </div>
                </Row>

                
             

                <Row className="mb-1 col-md-8">
                <div  className="col-md-12 col-form-label">
                  <label htmlFor="codigo" className="">
                    m3
                  </label>
                  <span className="font20">
                  <HiOutlineQuestionMarkCircle
                  onMouseOver={() => setIsShowncd(true)}
                  onMouseOut={() => setIsShowncd(false)}
                  /> </span>
                  </div>
                  <div className="col-md-12">
                  <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol4.pri}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol4.seg}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol4.ter}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol4.qua}
                 style={{color: 'black', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol4.qui}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                  <input 
                   onChange={onChangeHandlerstuck}
                 value={relojcol4.sex}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                 <input 
                  onChange={onChangeHandlerstuck}
                 value={relojcol4.set}
                 style={{color: 'red', width: '16px'}}>

                 </input>
                
                  </div>
                </Row>
                </div>
                 ) : (
                  <></>
                )}
             
{/* 
               
               
              
              {/* </form> */}
            </div>
            <Alert color="warning">
                  <strong>Atenção!</strong> Certifique-se que os valores estão corretos , após atualizar, em caso de erro o processo deverá ser refeito.
                </Alert>
            <Row className="mb-1">
                  <label htmlFor="codigo" className=" col-form-label" />
                  <div className="col-md-2" style={{ marginTop: "1rem" }}>
                 
                      <Button
                        color="secondary"
                        className="btn-lg"
                        action={submitHandleredit}
                        text="atualizar"
                      >
                  
                       
                      </Button>
                  </div>
                </Row>
              

          </Container>
        ) : (
          <></>
        )}
         {setp.searched ? (
          <Container fluid>
            
            <div className="table-responsive mt-5  col-md-12 " style={{ fontSize: "110%" }}>
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Alteração Pulso Inicial</h6>
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item active">
                 
                  </li>
                </ol>
              </Col>
            </Row>
              {/* <form onSubmit={submitHandlerEdit} style={{ overflow: "hidden" }}> */}

              

              <Row className="mb-1 col-md-2">

              <label htmlFor="codigo" className=" col-form-label">
                    Porta 
                  </label>
                  <span className="btext " >{edit.porta}</span>

                  </Row> 
                  {/* <label htmlFor="codigo" className="col-md-2 col-form-label">
                    Porta
                  </label>
                  <div className="col-md-2">
                    <Input
                      min="0"
                      max="9999"
                      className="form-control form-control-lg"
                      type="number"
                      style={{ backgroundColor: "#f5f3f3 !important"  }}
                      value={edit.porta}
                      onChange={onChangeHandlerstuck}
                      disabled
                      readonly
                    />
                  </div> */}
               
                


                <Row className="mb-1 col-md-2">
                  <label htmlFor="codigo" className=" col-form-label">
                    Pulso Inicial
                  </label>
                  <div className="">
                  <input   
                        className="form-control form-control-lg"
                        type="text"
                        id="fab-edit"
                      
                        value={edit.watch}
                        onChange={onChangeHandlerreloj("watch")}
                      />
                
                  </div>
                </Row>

               
                <Row className="mb-1">
                  <label htmlFor="codigo" className="" />
                  <div className="col-md-3" style={{ marginTop: "1rem" }}>
                 
                      <Button
                        color="secondary"
                        className="btn-lg"
                        action={submitHandlerPulso}
                        text="Atualizar"
                      >
                  
                       
                      </Button>
                  </div>
                </Row>
              {/* </form> */}
            </div>
          </Container>
        ) : (
          <></>
        )}
      </div>
    </React.Fragment>
  );
};

export default Calibragem;
