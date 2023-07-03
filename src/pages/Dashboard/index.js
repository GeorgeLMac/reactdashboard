import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import AuthService from "../../services/Auth.service";
import BarChart from "../AllCharts/chartjs/barchart";
import ReactApexChart from "react-apexcharts";
import { useSelector, useDispatch } from 'react-redux';

//i18n
import { withTranslation } from "react-i18next";
const Dashboard = props => {


  const [duration, setDuration] = useState("year");
  const dispatch = useDispatch();
 
 
  // const { visitor } = useSelector(state => ({
  //   visitor: state.DashboardBlog.visitor
  // }));


  const user = AuthService.getCurrentUser();

  let checkempresa = null;
  let razao = null;
  let DS_STATUS = null;
  if(user != null){
    DS_STATUS = user.user.DS_STATUS
  if(user.empresa[0] != undefined){
    checkempresa = user.empresa[0].OID_EMPRESA
    razao = user.empresa[0].NM_RAZAO_SOCIAL;
  }
  }


  const series2 = [56, 38, 26];
  const options2 = {
    labels: ["Series A", "Series B", "Series C"],
   
    legend: { show: !1 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  };

  
  

  const [periodType, setPeriodType] = useState("yearly");

  const [series, setSeries] = useState([
    {
      name: "Current",
      data: [],
    },
  ]);
  
  const generateRandomData = () => {
    const startDate = new Date("2023-06-10"); // Start date
    const endDate = new Date("2023-06-30"); // End date
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const newSeries = [];
  
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const brazilianDate = date.toLocaleDateString("pt-BR"); // Convert date to Brazilian format
      const randomValue = Math.floor(Math.random() * 100) + 1; // Generate random value between 1 and 100
  
      newSeries.push({
        x: brazilianDate,
        y: randomValue,
      });
    }
  
    setSeries([
      {
        name: "Current",
        data: newSeries,
      },
    ]);
  };
  
  useEffect(() => {
    generateRandomData();
  }, []);
  


  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    // colors: apexCardUserChartColors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: (  []),
    },

    markers: {
      size: 3,
      strokeWidth: 3,

      hover: {
        size: 4,
        sizeOffset: 2,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  //meta title
  document.title = "Dashboard | Syskeeper";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />
          
          {
                      (() => {
                        if(DS_STATUS == 10 || checkempresa != null){
                          return <div className="container-fluid">
                          

                          <Row>
          <Col lg={4}>
            <Card className="mini-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total Condominios</p>
                    <h5 className="mb-0">2</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bxs-book-bookmark"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total Imóveis</p>
                    <h5 className="mb-0">9</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bxs-note"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Total Medidores</p>
                    <h5 className="mb-0">7</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bxs-message-square-dots"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>


        <Row>
        <Col xl={8}>
        
        <Card style={{ }} >
          <CardBody>
            <div className="d-flex flex-wrap">
              <h5 className="card-title me-2">Consumo Geral Condominio Syskeeper</h5>
              <div className="ms-auto">
                <div className="toolbar d-flex flex-wrap gap-2 text-end">
                  <button type="button" className="btn btn-light btn-sm" >
                    Tudo
                  </button>{" "}
                  <button type="button" className="btn btn-light btn-sm" >
                    1M
                  </button>{" "}
                  <button type="button" className="btn btn-light btn-sm" >
                    6M
                  </button>{" "}
                  <button type="button" className="btn btn-light btn-sm active" >
                    12M
                  </button>{" "}
                </div>
              </div>
            </div>

            <Row className="text-center">
              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Hoje</p>
                  <h5>44m3</h5>
                </div>
              </Col>

              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Esse Mês</p>
                  <h5>
                    1024m3{" "}
                    <span className="text-success font-size-13">
                      0.2 % <i className="mdi mdi-arrow-up ms-1"></i>
                    </span>
                  </h5>
                </div>
              </Col>

              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Esse Ano</p>
                  <h5>
                    102354m3{" "}
                    <span className="text-success font-size-13">
                      0.1 % <i className="mdi mdi-arrow-up ms-1"></i>
                    </span>
                  </h5>
                </div>
              </Col>
            </Row>

            <Row>
            <hr className="mb-4" />
            <div id="area-chart" className="col-xl-12" dir="ltr" style={{ overflow: "hidden" }}>
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
                className="apex-charts"
              />
            </div>
            </Row>
          </CardBody>
        </Card>
        </Col>

        <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Status Imóveis</h4>

            <div>
              <div id="donut-chart">
                <ReactApexChart
                  options={options2}
                  series={series2}
                  type="donut"
                  height={260}
                  className="apex-charts"
                />
              </div>
            </div>

            <div className="text-center text-muted">
              <Row>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 ">
                      <i className="mdi mdi-circle text-primary me-1" /> Com Medidor
                      
                    </p>
                    <h5>6</h5>
                  </div>
                </Col>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 ">
                      <i className="mdi mdi-circle text-success me-1" /> Sem Medidor
                      
                    </p>
                    <h5>2</h5>
                  </div>
                </Col>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 ">
                      <i className="mdi mdi-circle text-danger me-1" /> Medidor com Problemas
                      
                    </p>
                    <h5>3</h5>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
      </Row>
                          
                          <div className="row">
                            <Col lg={12}>
                            <Card>
                                <CardBody>
                                
                                  <BarChart />
                                </CardBody>
                                </Card>
                            </Col>
                            </div>
                          </div> 
                         
                        }
                        if(DS_STATUS != 10 && checkempresa == null){
                          return <div className="container">
                          <div className="row">
                            <div className="col" style={{textAlign: "center", fontSize: "25px", marginTop: "3.5rem"}}>
                              <label>Seja Bem Vindo Ao Sistema Syskeeper!</label>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col" style={{textAlign: "center"}}>
                              <label>Sistema de Gerenciamento e consulta de medidores para Condomínios</label>
                            </div>
                          </div>
                        </div> 
                        }
                       
                      })()
                    }


          

          </Container>
          </div>
    </React.Fragment>
  );
};


export default withTranslation()(Dashboard);
