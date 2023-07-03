// import { Divider } from '@mui/material';
import Button from 'components/shared/Button/Button';
import React from 'react';

const Support = () => {
	return (
		<div className="page-content">
			<label id="component-title">Suporte Técnico</label>
			<div className="container">
				{/* <div className="row" style={{marginBottom: "1rem", marginTop: "1rem"}}>
					<Button text="Chat Online"/>
				</div> */}
				<div className="row">
					<label style={{fontSize: "20px"}}>Telefone: (34) 3222-2222</label>
					{/* <Divider
						style={{ borderColor: 'purple', border: 'solid' }}
					/> */}
				</div>
				<div className="row">
					<label style={{fontSize: "20px"}}>WhatsApp: (34) 9.9999-9999</label>
					
				</div>
				<div className="row">
					<label style={{fontSize: "20px"}}>Email: suporte@syswater.com.br</label>
					
				</div>
			</div>
		</div>
	);
};

export default Support;
