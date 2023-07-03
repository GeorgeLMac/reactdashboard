import React, { useState } from 'react';



const Questions = () => {
	const [selectedIndex, setSelectedIndex] = useState('');

	const [openHydro, setOpenHydro] = useState(false);
	const [openModule, setOpenModule] = useState(false);
	const [openReport, setOpenReport] = useState(false);
	const [openEquip, setOpenEquip] = useState(false);

	const openMenu = (event, menu) => {
		const selected = menu;
		console.log(menu);
		setSelectedIndex(menu);
		if (selected === 'hydro') {
			setOpenHydro(!openHydro);
		} else if (selected === 'module') {
			setOpenModule(!openModule);
		} else if (selected === 'report') {
			setOpenReport(!openReport);
		} else if (selected === 'equip') {
			setOpenEquip(!openEquip);
		}
	};

	return (
		<div className="page-content">
			<label id="component-title">Central de Ajuda</label>
			<div className="col-9">
				{/* <List>
					<ListItem disablePadding className="sidebarItem">
						<ListItemButton
							onClick={(event) => openMenu(event, 'hydro')}
						>
							<ListItemIcon className="sidebarItem">
								<AddIcon />
							</ListItemIcon>
							<ListItemText primary="Como Registro um hidrômetro?" />
						</ListItemButton>
					</ListItem>
					<Collapse in={openHydro} timeout="auto" unmountOnExit>
						<div style={{marginLeft: "7%"}}>Dummy Text</div>
					</Collapse>
					<Divider
						style={{ borderColor: 'purple', border: 'solid' }}
					/>

					<ListItem disablePadding className="sidebarItem">
						<ListItemButton
							onClick={(event) => openMenu(event, 'module')}
						>
							<ListItemIcon className="sidebarItem">
								<AddIcon />
							</ListItemIcon>
							<ListItemText primary="Onde Cadastro um módulo?" />
						</ListItemButton>
					</ListItem>
					<Collapse in={openModule} timeout="auto" unmountOnExit>
						<div style={{marginLeft: "7%"}}>Dummy Text</div>
					</Collapse>
					<Divider
						style={{ borderColor: 'purple', border: 'solid' }}
					/>

					<ListItem disablePadding className="sidebarItem">
						<ListItemButton
							onClick={(event) => openMenu(event, 'report')}
						>
							<ListItemIcon className="sidebarItem">
								<AddIcon />
							</ListItemIcon>
							<ListItemText primary="Como Funciona a Leitura de Consumo?" />
						</ListItemButton>
					</ListItem>
					<Collapse in={openReport} timeout="auto" unmountOnExit>
						<div style={{marginLeft: "7%"}}>Por meio da leitura do hidrômetro, você consegue acompanhar o padrão de consumo mensal de água na sua residência, uma informação que não só ajuda a manter as contas sob controle como também facilita a identificação, com mais agilidade, de vazamentos ou quaisquer ocorrências que gerem alterações significativas na sua média de consumo.</div>
					</Collapse>
					<Divider
						style={{ borderColor: 'purple', border: 'solid' }}
					/>

					<ListItem disablePadding className="sidebarItem">
						<ListItemButton
							onClick={(event) => openMenu(event, 'equip')}
						>
							<ListItemIcon className="sidebarItem">
								<AddIcon />
							</ListItemIcon>
							<ListItemText primary="Onde encontro as informações do meu equipamento de transmissão?" />
						</ListItemButton>
					</ListItem>
					<Collapse in={openEquip} timeout="auto" unmountOnExit>
						<div style={{marginLeft: "7%"}}>Cada hidrômetro possui uma numeração de série, que corresponde à matrícula do imóvel e não pode ser utilizado em outra residência. Essa numeração fica logo abaixo ou ao lado do visor, marcado no ferro. Com esse número fica mais fácil identificar por exemplo, se a leitura está correta ou não e ainda, solicitar uma aferição.</div>
					</Collapse>
					<Divider
						style={{ borderColor: 'purple', border: 'solid' }}
					/>
				</List> */}
			</div>
			<div className="col-3" />
		</div>
	);
};

export default Questions;
