import React, { useState } from 'react';



import logo from '../../assets/images/bgw.jfif';



const Ajuda = () => {
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
			{/* <div className="col-9">
				<List>
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
						<img src={logo}  />
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
							<ListItemText primary="Como gerar relatórios mensais?" />
						</ListItemButton>
					</ListItem>
					<Collapse in={openReport} timeout="auto" unmountOnExit>
						<div style={{marginLeft: "7%"}}>Dummy Text</div>
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
						<div style={{marginLeft: "7%"}}>Dummy Text</div>
					</Collapse>
					<Divider
						style={{ borderColor: 'purple', border: 'solid' }}
					/>
				</List>
			</div> */}
			<div className="col-3" />
		</div>
	);
};

export default Ajuda;
