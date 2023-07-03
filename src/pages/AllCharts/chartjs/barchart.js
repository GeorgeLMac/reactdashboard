import React, { useState, useEffect,useRef } from "react";
import { sum } from "lodash";
import { Bar } from "react-chartjs-2";
//import ReactExport from "react-export-excel";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import Input from "components/shared/Inputs/Inputs";
import Swal from "sweetalert2";
import api from "../../../services/api";
import AuthService from "../../../services/Auth.service";



//const ExcelFile = ReactExport.ExcelFile;
//const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
//const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
//
const initialData = [
  {
    MES: "",
    MAIORPULSO: "",
    MENORPULSO: "",
    DEVICE: "",
    NR_HIDROMETRO: "",
    IDA: "",
    DS_LOCALIDADE: "",
  },
  {
    MES: "",
    MAIORPULSO: "",
    MENORPULSO: "",
    DEVICE: "",
    NR_HIDROMETRO: "",
    IDA: "",
    DS_LOCALIDADE: "",
  },
];

const initialData2 = [
  {
    MES: "",
    MAIORPULSO: "",
    MENORPULSO: "",
    DEVICE: "",
    NR_HIDROMETRO: "",
    IDA: "",
    DS_LOCALIDADE: "",
  },
];








function BarChart() {



  //Busca Medidores

const initialState = {
  maker: "",
  desc: "",
  model: "",
  number: "",
};



const Empresa = {
  OID_EMPRESA: "",
  NM_RAZAO_SOCIAL: "",
 
};



const [searchm, setSearchm] = useState(initialState);
let [makers, setMakers] = useState([]);
const [condos, setCondo] = useState([]);

let [lc, setLc] = useState (Empresa);

let stateempresa = null;

  const user = AuthService.getCurrentUser();



    let checkempresa = null;
    let DS_STATUS = null;
    if(user != null){
      
      DS_STATUS = user.user.DS_STATUS
    if(user.empresa[0] != undefined){
      checkempresa = user.empresa[0].OID_EMPRESA
    

    }
    }

    const fetchMakers = () => {
      let maker = [{  maker: "Selecione..." }];
      api.get("/imovel/hidro/"+user.user.OID_USUARIO).then((response) => {
        response.data.map((elem) => {
          maker.push({
             id: elem.NR_MEDIDOR,
            maker: "Medidor: "+elem.NR_MEDIDOR+" - "+elem.imovel,
           
            
          });
        });
        setMakers(maker);
      });
    };

    const fetchCondo = () => {
      let condo = [{ id: "",  condo: "Selecione..." }];
      api.get("/empresa/").then((response) => {
        response.data.map((elem) => {
          condo.push({
            id: elem.OID_EMPRESA,
            condo: elem.NM_RAZAO_SOCIAL,
            
          });
        });
        setCondo(condo);
      });
    };

    useEffect(() => {
      fetchMakers();
    }, []);
  
    //if(DS_STATUS == 10){
      useEffect(() => {
        fetchCondo();
      }, []);
   // }

   const onChangeCondo = (prop) => (event) => {
    setLc({ ...lc, [prop]: event.target.value});

    stateempresa = event.target.value;
   
      fetchHidroCondo();
    
    
    
  };
  


  const fetchHidroCondo = () => {
    let maker = [{  maker: "Selecione..." }];
    api.get("/imovel/empresa/"+stateempresa).then((response) => {
      response.data.map((elem) => {
        maker.push({
          id: elem.NR_MEDIDOR,
          maker: "Medidor: "+elem.NR_MEDIDOR+" - "+elem.imovel,
          
        });
      });
      setMakers(maker);
    });
  };
 

//Busca Medidores



  const [showInfos, setShowInfos] = useState([]);
  const [reseta, setReseta] = useState([]);
  const [showDisplay, setShowDisplay] = useState("none");
  const [showPulse, setShowPulse] = useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initialData);
  const [data2, setData2] = useState(initialData2);
  const [search, setSearch] = useState({
    ida: undefined,
    hydro: undefined,
    dateInit: '',
    dateEnd: '',
  });
  const [typeHidro, setTypeHidro] = useState({
    ativo: 0,
    inativo: 0
  });

  const [localidade, setLocalidade] = useState([]);
  const [hidrometro, setHidrometro] = useState("");
  const [ida, setIda] = useState("");
  const [values, setValues] = useState([]);
  const [mes, setMes] = useState([]);
  //const [mes, setMes] = useState(new Set());
  const [day, setDay] = useState(false);
  const [filter, setFilter] = useState(false)
  const [values2, setValues2] = useState([]);
  const [mes2, setMes2] = useState([]);
  const [device, setDevice] = useState([]);
  const [here, setHere] = useState(1);
  const [total2, setTotal2] = useState([]);
  const [EquipmentsDMAE, setEquipmentsDMAE] = useState([]);
  const [total, setTotal] = useState("");
  const [titleAlarm, setTitleAlarm] = useState("");
  const [titleAlarmTipe, setTitleAlarmTipe] = useState("");

  const [meter, setMeter] = useState({
    h_24: 0,
    h_12: 0,
    h_3: 0,
  });
  const [alarm, setAlarm] = useState({
    total: 0,
    corte: 0,
    vazamento: 0,
    ataque_magnetico: 0,
    reverso: 0,
  });

  useEffect(() => {
     alarms();
    // meters();
    // hidrometerType();
  }, []);
  function resetSearch() {
    resetStates();
    setShowPulse("");
    setTotal("");
    setSearch({
      ida: "",
      hydro: "",
      dateInit: '',
      dateEnd: '',

    });
  }
  function resetStates() {
    
    let resettotal = null;
    setIsLoading(true);
    setShowDisplay("none");
    setLocalidade([]);
    setHidrometro("");
    setIda("");
    let reset2 = mes.splice(0, mes.length);
    let reset = values.splice(0, values.length);
    // setValues([]);
    // setMes([]);
    setValues([]);
    setMes([]);
    setMes2([]);
    setTotal("");
   
   
    
    
    setValues2([]);
    setDevice([]);
    setDay(false)
    setFilter(false)
  }
  const alarms = async () => {
    await api
      .post("/consumptions/alarm", {
        TYPE: "GERAL",
        DS_STATUS: DS_STATUS,
        OID_EMPRESA : checkempresa,
      })
      .then((response) => {
        let pulso = parseInt(response.data[0].pulso_1) + parseInt(response.data[0].pulso_2) + parseInt(response.data[0].pulso_3)+ parseInt(response.data[0].pulso_4);
        let valvula = parseInt(response.data[0].valvula_1) + parseInt(response.data[0].valvula_2) + parseInt(response.data[0].valvula_3)+ parseInt(response.data[0].valvula_4);
        let reverso = parseInt(response.data[0].reverso_1) + parseInt(response.data[0].reverso_2) + parseInt(response.data[0].reverso_3)+ parseInt(response.data[0].reverso_4);
        let totalAlarm =
          pulso +
          response.data[0].status_da_valvula +
          response.data[0].ataque_magnetico;

        setAlarm({
          total: totalAlarm,
          corte: pulso,
          vazamento: valvula,
          ataque_magnetico: response.data[0].ataque_magnetico,
          reverso: reverso,
        });
      });
  };

  const meters = async () => {
    await api
      .post("/consumptions/meters", {
        HOUR: "HOUR",
        TYPE: "FULL",
      })
      .then((response) => {
        setMeter({
          h_24: response.data.METERS24,
          h_12: response.data.METERS12,
          h_3: 0
        });
      });
  };
  const hidrometerType = async () => {
    await api
      .post("/consumptions/hidrometer", {
        TYPE: "FULL",
      })
      .then((response) => {
        setTypeHidro({
          ativo: response.data[0].ATIVOS,
          inativo: response.data[0].INATIVOS
        });
      });
  };
  useEffect(() => {
    api.get("/registrosportas").then((response) => {
      let arr = [];
      arr = response.data;
      
      setEquipmentsDMAE(arr);
      for (let i = 0; i < arr.length; i++) {
        if (
          arr[i].NR_MEDIDOR === hidrometro &&
          Number(arr[i].DS_RELOJOARIA_INICIAL) !== null
        ) {
          console.log("arr"+arr[i].DS_RELOJOARIA_INICIAL)
          setTotal2(Number(arr[i].DS_RELOJOARIA_INICIAL));
        //  setTotal2(Number(arr[i].DS_RELOJOARIA_INICIAL));
        }
      }
    });
  }, [hidrometro]);
  const showMeters = async (filter) => {
    await api
      .post("/consumptions/meters", {
        HOUR: filter,
        TYPE: "",
      })
      .then((response) => {
        setShowInfos(response.data);
        setShowDisplay("block");
        setTitleAlarm("Medidores sem consumo " + filter);
        setTitleAlarmTipe("");
      });
  };
  const showTypeHidro = async (filter) => {
    await api
      .post("/consumptions/hidrometer", {
        TYPE: filter,
      })
      .then((response) => {
        setShowInfos(response.data);
        setShowDisplay("block");
        if (filter == "ATIVOS") {
          setTitleAlarm("Hidrometros Ativos");

        } else if (filter == "INATIVOS") {
          setTitleAlarm("Hidrometros Inativos");

        }
        setTitleAlarmTipe("");
      });
  };
  const showAlarms = async (filter) => {
    await api
      .post("/consumptions/alarm", {
        TYPE: filter,
        DS_STATUS: DS_STATUS,
        OID_EMPRESA : checkempresa,
      })
      .then((response) => {
        setShowInfos(response.data);
        setShowDisplay("block");
        setTitleAlarm("Alarmes das ultimas 24 horas --> ");
        if (filter == "CORTE") {
          setTitleAlarmTipe("Corte de cabo do Pulso");
        } else if (filter == "VAZAMENTO") {
          setTitleAlarmTipe("Vazamento no Pulso");
        } else if (filter == "ATAQUE") {
          setTitleAlarmTipe("Ataque Magnético");
        } else if (filter == "REVERSO") {
          setTitleAlarmTipe("Consumo Reverso");
        }
      });
  };
  const showHidro = async (idHidro) => {
    setHidrometro(idHidro.target.innerHTML);
    setSearch({
      ida: undefined,
      hydro: idHidro.target.innerHTML,
    });
    submitHandler(idHidro.target.innerHTML);
  };

  useEffect(() => {
    let intArray = values.map((str) => parseInt(str))
    setValues2(intArray)
  }, [values]);

  const submitHandlerPrevent = async (event) => {
    event.preventDefault();
   
     setValues([])
     setMes([])
    // let reset = 2;
    // setReseta(reset)
    // setValues([], () => {
 

    //   submitHandler();
    // });
    

      submitHandler();
   
    

   
  };
  const submitHandler = async (idHidro) => {
    // if (typeof idHidro == 'string') {

    //   search.hydro = idHidro;
    // }
    if (hidrometro !== undefined || ida !== undefined) {
   
        

      await api
        .post("/consumptions/draw", {
          NR_HIDROMETRO: day ? hidrometro : search.hydro,
         // NR_HIDROMETRO: "Y22G601060 - PL1/2b028f15",
          IDA: search.ida,
          TYPE: "MES",
          DATE: { "start": search.dateInit ? search.dateInit : "", "end": search.dateEnd ? search.dateEnd : "" }
        })
        .then((response) => {
           
          var d = '';
          let oldValue = 0
          var lastMax = 0;
          setReseta(oldValue)
          var k = 0;
          resetStates();
          let sumPulse = 0
          let countMes = "";
          for (var i = 0; i < response.data.length; i++) {
           
            // if (typeof response.data[i].menorpulso == "undefined") {
            //   response.data[i].menorpulso = 0;
            // }
            // if (typeof response.data[i].maiorpulso == "undefined") {
            //   response.data[i].maiorpulso = 0;
            // }
            response.data[i].menorpulso = Math.trunc(
              response.data[i].menorpulso
            );
            response.data[i].maiorpulso = Math.trunc(
              response.data[i].maiorpulso
            );
            if (i === 0) {

              countMes = response.data[i].mes;
              sumPulse = sumPulse + (response.data[i].maiorpulso - response.data[i].menorpulso)
              console.log("0-"+response.data[i].maiorpulso - response.data[i].menorpulso)

               if (!search.dateInit ){
               let parts = response.data[i].mes.split("/");
               response.data[i].mes =  `${parts[1]}/${parts[0]}`;
                }
                else{
                    let parts = response.data[i].mes.split("/");
               response.data[i].mes =  `${parts[2]}/${parts[1]}`;
                }

              let newArraymes = [ ...mes, response.data[i].mes]
              setMes((oldState) => [
                ...oldState,
                (newArraymes),
              ]);
              // let mes2 = mes.push(response.data[i].mes)
              // setMes(mes2);
              let newArray = [ parseInt( response.data[i].maiorpulso - response.data[i].menorpulso )]
               setValues((oldState) => [
                 ...oldState,
                 (newArray),
               ]);
             //  setValues(newArray)
              // setValues(
              //   response.data[i].maiorpulso - response.data[i].menorpulso,
              // );
             
              //let values2 = values.push(response.data[i].maiorpulso - response.data[i].menorpulso);
              //setValues(values2)
              //setValues([values.concat(new Array(1).fill([response.data[i].maiorpulso - response.data[i].menorpulso]))]);
              // concat(new Array(1).fill([result.length+1,result[0].idEquipDmae])
              // setValues([...values, response.data[i].maiorpulso - response.data[i].menorpulso]);
              lastMax = response.data[i].maiorpulso
              
              if (countMes == response.data[i].mes) {
                setHidrometro(response.data[i].nr_hidrometro);
                setIda(response.data[i].ds_localidade);
                setLocalidade(response.data[i].ds_localidade);
              } else {
                setHidrometro(response.data[i].nr_hidrometro);
                setIda(response.data[i].ds_localidade);
                setLocalidade(response.data[i].ds_localidade);
              }
            } else {
              console.log("else"+response.data[i].maiorpulso)
               const dataFiltered = data.slice(0, 2);
               setData(dataFiltered);

               if (!search.dateInit ){
                let parts = response.data[i].mes.split("/");
                response.data[i].mes =  `${parts[1]}/${parts[0]}`;
               }
               else{
                let parts = response.data[i].mes.split("/");
                response.data[i].mes =  `${parts[2]}/${parts[1]}`;
                    }

              let newArraymes = [ ...mes, response.data[i].mes]
              setMes((oldState) => [
                ...oldState,
                (newArraymes),
              ]);
              oldValue = response.data[i].menorpulso - lastMax
              sumPulse = sumPulse + (response.data[i].maiorpulso - response.data[i].menorpulso )


              let newArray = [ parseInt(response.data[i].maiorpulso - response.data[i].menorpulso )]
                 setValues((oldState) => [
                 ...oldState,
                 (newArray),
               ]);
              // setValues(newArray)

              // setValues((oldState) => [
              //   ...oldState,
              //   (response.data[i].maiorpulso - response.data[i].menorpulso + oldValue),
              // ]);      


              // this.setState({
              //   values:[...this.state.values, newArray]
              // });
             // setValues([values.concat(new Array(1).fill([response.data[i].maiorpulso - response.data[i].menorpulso + oldValue]))]);
            // let values2 = values.concat(response.data[i].maiorpulso - response.data[i].menorpulso);
              //setValues(values2)
              //values = values.concat(new Array(1).fill([response.data[i].maiorpulso - response.data[i].menorpulso + oldValue]));
              //setValues([values.concat(response.data[i].maiorpulso - response.data[i].menorpulso + oldValue)]);
              // setValues((oldState) => [
              //   ...oldState,
              //   (response.data[i].maiorpulso - response.data[i].menorpulso + oldValue),
              // ]);
              // setValues(prevSet => new Set(prevSet.add(response.data[i].maiorpulso - response.data[i].menorpulso + oldValue)));

              //    setValues(
              //   (response.data[i].maiorpulso - response.data[i].menorpulso + oldValue)
              // );
              lastMax = response.data[i].maiorpulso
            }


            // setMes(prevSet => new Set(prevSet.add(response.data[i].mes)));
              console.log("mes"+response.data[i].mes)
            //setMes((oldState) => [...oldState, response.data[i].mes]);
            // let mes2 = mes.concat(response.data[i].mes)
            //   setMes(mes2);
            setHere(1);
            // if (total === "") {
              setTotal(sumPulse);
            

            if (k > 0) {
               d = response.data[i];
              setData2((oldState) => [...oldState, d]);
            } else {
                d = response.data[i];
               setData((oldState) => [...oldState, d]);
              setIsLoading(false);
            }
          }
          search.dateInit ? setShowPulse(sumPulse) : ""
          search.dateInit ? setDay(false) : ""
          search.dateInit ? setFilter(true) : ""

        })
        .catch((error) => {
          resetStates();
          
          let resp = error.response.data.split('*')
          Swal.fire({
            title: resp[1],
            icon: "warning",
          });
        });

    }
  };
  const showDay = async (filter) => {
console.log("Filter"+filter)
let m = filter.toString();
let parts = m.substring(0, 2);
// let month = parts[0];
    await api
      .post("/consumptions/draw", {
        NR_HIDROMETRO: hidrometro,
        IDA: ida,
        TYPE: "DAY",
        MES: parts,
      })
      .then((response) => {
       
        var d = '';
        let oldValue = 0
        var lastMax = 0
        var k = 0;
        resetStates();
        let sumPulse = 0
        let countMes = "";
      
        for (var i = 0; i < response.data.length; i++) {
          if (typeof response.data[i].menorpulso == "undefined") {
            response.data[i].menorpulso = 0;
          }
          response.data[i].menorpulso = Math.trunc(response.data[i].menorpulso);
          response.data[i].maiorpulso = Math.trunc(response.data[i].maiorpulso);
          if (i === 0) {
            response.data[i].menorpulso = Math.trunc(
              response.data[i].menorpulso
            );
            response.data[i].maiorpulso = Math.trunc(
              response.data[i].maiorpulso
            );
            countMes = response.data[i].mes;
            sumPulse = sumPulse + (response.data[i].maiorpulso - response.data[i].menorpulso)
            // let mes2 = mes.push(response.data[i].mes)
            // let mes3 = mes.concat(mes2)
            //   setMes(mes3);

            // let parts = response.data[i].mes.split("/");
            //     response.data[i].mes =  `${parts[1]}/${parts[0]}`;
            let parts = response.data[i].mes.split("/");
                response.data[i].mes =  `${parts[1]}/${parts[0]}`;

            let newArraymes = [ ...mes, response.data[i].mes]
            setMes((oldState) => [
              ...oldState,
              (newArraymes),
            ]);

              let newArray = [ parseInt(response.data[i].maiorpulso - response.data[i].menorpulso )]
                 setValues((oldState) => [
                 ...oldState,
                 (newArray),
               ]);
            //   let values2 = values.push(response.data[i].maiorpulso - response.data[i].menorpulso );
            // let values3 = values.concat(values2);
          
            //   setValues(values3)
            // setValues((oldState) => [
            //   ...oldState,
            //   response.data[i].maiorpulso - response.data[i].menorpulso,
            // ]);
            lastMax = response.data[i].maiorpulso


            if (countMes == response.data[i].mes) {
              setHidrometro(response.data[i].nr_hidrometro);
              setIda(response.data[i].ds_localidade);
              setLocalidade(response.data[i].ds_localidade);
            } else {
              setHidrometro(response.data[i].nr_hidrometro);
              setIda(response.data[i].ds_localidade);
              setLocalidade(response.data[i].ds_localidade);
            }
          } else {
             const dataFiltered = data.slice(0, 2);
             setData(dataFiltered);
            console.log("dias"+[i]+response.data[i].mes)
            console.log("valordia"+[i]+response.data[i].maiorpulso - response.data[i].menorpulso )
            oldValue =  lastMax - response.data[i].menorpulso 
            sumPulse = sumPulse + (response.data[i].maiorpulso - response.data[i].menorpulso + oldValue)

            let parts = response.data[i].mes.split("/");
                response.data[i].mes =  `${parts[1]}/${parts[0]}`;

            let newArray = [ parseInt(response.data[i].maiorpulso - response.data[i].menorpulso )]
            setValues((oldState) => [
            ...oldState,
            (newArray),
             ]);

            //  let parts = response.data[i].mes.split("/");
            //     response.data[i].mes =  `${parts[1]}/${parts[0]}`;
             
             let newArraymes = [ ...mes, response.data[i].mes]
             setMes((oldState) => [
               ...oldState,
               (newArraymes),
             ]);
            // setValues((values2) => [
            //   ...values2
            // ]);
            lastMax = response.data[i].maiorpulso
          }

          // let mes2 = mes.concat(response.data[i].mes)
          //     setMes(mes2);
          // setMes((oldState) => [...oldState, response.data[i].mes]);
          setHere(2);

          if (k > 0) {
             d = response.data[i];
            setData2((oldState) => [...oldState, d]);
          } else {
             d = response.data[i];
            setData((oldState) => [...oldState, d]);
            setIsLoading(false);
            setDay(true);
          }
        }
        search.dateInit ? setShowPulse(sumPulse) : ""
      })
      .catch((error) => {
        let resp = error.response.data.split('*')
        Swal.fire({
          title: resp[1],
          icon: "warning",
        });
      });
  };
  const onChangeHandler = (prop) => (event) => {
    setSearch((oldState) => ({ ...oldState, [prop]: event.target.value }));
  };

  const onChangeHandlerm = (prop) => (event) => {
    setSearchm({ ...search, [prop]: event.target.value });
    console.log(search)
  };

  console.log("valuesfim"+values)
  console.log("mesfim"+mes)
  const newData = [0, ...values2];
  // intArray = values.map((str) => parseInt(str))
  const chartData = {
    
    labels: mes,
  // labels: ['2023/01', '2023/02'],
    datasets: [
      {
        label: "teste", //this.state.data[0]?.DEVICE,
        backgroundColor: "rgb(0, 87, 170)",
        borderColor: "rgb(0, 87, 170)",
        borderWidth: 1,
        hoverBackgroundColor: "rgb(0, 87, 170)",
        hoverBorderColor: "rgb(0, 87, 170)",
       // data: [3, 7],
        data: values2,
        //total: 0,
        total: sum(values2).toFixed(2),
      },
    ],
  };

  const option = {
    tootlbar: {
      show: false,
    },

    responsive: true,
   scales: {
       yAxes: [{
           ticks: {
               beginAtZero: true
                  }
              }]
            },
        
      


    legend: {
      display: false,
    },

    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var total = dataset.total;
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return currentValue + " (" + percentage + "%)";
        },
        title: function (tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
    onClick: function (event, element) {
      if (element.length == 0) {
      } else {
       
        if (day == false && filter == false) {         
          showDay(element[0]._model.label);
        }
      }
    },
  };

  console.log(showInfos)

  return (
    <>
    
      {isLoading ? (
        <>
          {showDisplay == "none" ? (
            <>
              <div style={{ display: "flex" }}>
                {/* <div
                  style={{
                    borderWidth: 0.1,
                    borderStyle: "solid",
                    borderColor: "#F6F6F8",
                    borderRadius: 5,
                    width: 350,
                  }}
                >
                  <div
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 15,
                      backgroundColor: "#CEEBEF",
                    }}
                  >
                    <div
                      className="font-size-18 col-md-12"
                      style={{ fontWeight: "bold", width: 350 }}
                    >
                      Medidores
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        borderWidth: 0.1,
                        borderStyle: "solid",
                        borderColor: "#F6F6F8",
                        width: 350,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 15,
                        }}
                        onClick={() => showMeters("24h")}
                      >
                        <div style={{ fontWeight: "bold" }}>Sem Consumo 24 Horas</div>
                        <div>{meter.h_24}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        borderWidth: 0.1,
                        borderStyle: "solid",
                        borderColor: "#F6F6F8",
                        width: 350,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 15,
                        }}
                        onClick={() => showMeters("12h")}
                      >
                        <div style={{ fontWeight: "bold" }}>Sem Consumo 12 Horas</div>
                        <div>{meter.h_12}</div>
                      </div>
                    </div>
                  </div>


                </div> */}

                <div style={{ display: "flex" }}>
                  <div
                    className="col-md-12"
                    style={{
                      borderWidth: 0.1,
                      borderStyle: "solid",
                      borderColor: "#F6F6F8",
                      borderRadius: 5,
                      width: 550,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 15,
                        backgroundColor: "#CEEBEF",
                      }}
                    >
                      <div
                        className="font-size-18 col-md-12"
                        style={{ fontWeight: "bold" }}
                      >
                        Alarmes das ultimas 24 horas
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          borderWidth: 0.1,
                          borderStyle: "solid",
                          borderColor: "#F6F6F8",
                          width: 550,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 15,
                            cursor:"pointer"
                          }}
                          onClick={() => showAlarms("CORTE")}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            Corte de Cabo do Pulso
                          </div>
                          <div>{alarm.corte}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          borderWidth: 0.1,
                          borderStyle: "solid",
                          borderColor: "#F6F6F8",
                          width: 550,
                        }}
                        onClick={() => showAlarms("VAZAMENTO")}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 15,
                            cursor:"pointer"
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            Possível Vazamento
                          </div>
                          <div>{alarm.vazamento}</div>
                        </div>
                      </div>



                      <div
                        style={{
                          borderWidth: 0.1,
                          borderStyle: "solid",
                          borderColor: "#F6F6F8",
                          width: 550,
                        }}
                        onClick={() => showAlarms("ATAQUE")}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 15,
                            cursor:"pointer"
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            Ataque Magnético
                          </div>
                          <div>{alarm.ataque_magnetico}</div>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            borderWidth: 0.1,
                            borderStyle: "solid",
                            borderColor: "#F6F6F8",
                            width: 550,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              padding: 15,
                              cursor:"pointer"
                            }}
                            onClick={() => showAlarms("REVERSO")}
                          >
                            <div style={{ fontWeight: "bold" }}>Consumo Reverso</div>
                            <div>{alarm.reverso} </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>


              {/* <div style={{ display: "flex" }}>
                <div
                  className="col-md-12"
                  style={{
                    borderWidth: 0.1,
                    borderStyle: "solid",
                    borderColor: "#F6F6F8",
                    borderRadius: 5,
                    width: 350,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 15,
                      backgroundColor: "#CEEBEF",
                    }}
                  >
                    <div
                      className="font-size-18 col-md-12"
                      style={{ fontWeight: "bold" }}
                    >
                      HIDROMETROS
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        borderWidth: 0.1,
                        borderStyle: "solid",
                        borderColor: "#F6F6F8",
                        width: 350,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 15,
                        }}
                        onClick={() => showTypeHidro("ATIVOS")}
                      >
                        <div style={{ fontWeight: "bold" }}>
                          Ativos
                        </div>
                        <div>{typeHidro.ativo}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        borderWidth: 0.1,
                        borderStyle: "solid",
                        borderColor: "#F6F6F8",
                        width: 350,
                      }}
                      onClick={() => showTypeHidro("INATIVOS")}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 15,
                        }}
                      >
                        <div style={{ fontWeight: "bold" }}>
                          Inativos
                        </div>
                        <div>{typeHidro.inativo}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

            </>
          ) : (
            <></>
          )}
          <div style={{ display: showDisplay }}>
            <div>
              <span className="font-weight-bold font-size-18 h2 mt-4 card-title">
                {titleAlarm}
              </span>
              <span className="font-weight-normal card-title">
                {titleAlarmTipe}
              </span>
            </div>
            <div className="col-sm-12 mb-2 card-title d-flex justify-content-end">
              {/* <ExcelFile
                style={{ display: showDisplay }}
                className="d-flex justify-content-center"
              >
                <ExcelSheet data={showInfos} name="Localizações">
                  <ExcelColumn label="HIDROMETRO" value="HIDROMETRO" />
                  <ExcelColumn label="ENDEREÇO" value="LOCALIDADE" />
                </ExcelSheet>
              </ExcelFile> */}

              <button className="btn btn-link ml-2" onClick={resetSearch}>
                Voltar
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-nowrap mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="align-middle">Medidor</th>
                    <th className="align-middle">Localização</th>
                    <th className="align-middle">Módulo</th>
                  </tr>
                </thead>
                <tbody>
                  {showInfos?.map((element, key) => (
                    <tr key={"_tr_" + key}>
                      <td >{element.hidrometro}</td>
                      <td>{element.localidade} </td>
                      <td>{element.modulo} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {day ? (
            <>
              <div className="col-sm-12 mb-2 card-title d-flex justify-content-end">
                <button className="btn btn-link ml-2" onClick={submitHandler}>
                  Voltar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="col-sm-12 mb-2 card-title d-flex justify-content-end">
                <button className="btn btn-link ml-2" onClick={resetSearch}>
                  Voltar
                </button>
              </div>
            </>
          )}

          <Row className="justify-content-center">
            <Col sm={4}>
              <div className="text-center">
                <h5 className="mb-0 font-size-20">{ida}</h5>
                <p className="text-muted">Condominio</p>
              </div>
            </Col>
            <Col sm={4}>
              <div className="text-center">
                <h5 className="mb-0 font-size-20">{hidrometro}</h5>
                <p className="text-muted">HIDROMETRO</p>
              </div>
            </Col>
            {/* <Col sm={4}>
              <div className="text-center">
                <h5 className="mb-0 font-size-20">{localidade}</h5>
                <p className="text-muted">Endereço</p>
              </div>
            </Col> */}
          </Row>
          <Bar width={600} height={245} data={chartData} options={option} />
        </>
      )}
    </>
  );
}

export default BarChart;
