import React, { useState } from 'react';

import Button from 'components/shared/Button/Button';
import Input from 'components/shared/Inputs/Inputs';
import SearchTable from 'components/shared/SearchTable/SearchTable';

const styles = {
	label: { textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' },
};

const Consumo = () => {
	const initialState = {
		hydro: '',
		lora: '',
    start: '',
    finish: '',
	};

	const [search, setSearch] = useState(initialState);
	const [showList] = useState(false);

	const onChangeHandler = (prop) => (event) => {
		setSearch({ ...search, [prop]: event.target.value });
	};

	return (
		<div className="page-content">
			<label id="component-title">Consumo</label>
			<form
				className="component-form container"
				style={{ margin: '0px' }}
			>
				<div className="container">
					<div className="row">
						<div className="col-5">
							<Input
								id="hydro"
								label="Número Hidrômetro"
								value={search.hydro}
								onChange={onChangeHandler('hydro')}
								styles={{ width: '100%' }}
							/>
						</div>
						<label style={styles.label} className="col-1">
							ou
						</label>
						<div className="col-5">
							<Input
								id="lora"
								label="Número Equipamento"
								value={search.lora}
								onChange={onChangeHandler('lora')}
								styles={{ width: '100%' }}
							/>
						</div>
						<div className="col-1"></div>
					</div>
					<div className="row" style={{marginTop: "5px"}}>
						<div className="col-2">
            <Input
								id="start"
								label="Início"
								value={search.start}
								onChange={onChangeHandler('start')}
								styles={{ width: '100%' }}
							/>
            </div>
						<div className="col-2">
            <Input
								id="finish"
								label="Fim"
								value={search.finish}
								onChange={onChangeHandler('finish')}
								styles={{ width: '100%' }}
							/>
            </div>
						<div className="col-3"></div>
						<div className="col-5"></div>
					</div>
				</div>
			</form>				
      <SearchTable
          tableHead={[
            "IDA",
            "Número",
            "Cód. Hidrômetro",
            "Modelo Hidrômetro",
            "Localização",
            "Data",
            "Hora",
            "Bateria",
            "Pulso",
            "Bateria",
            "Base Tempo",
            "Vr. Pulso HD",
            "Nr Pulso",
            "Litros",
            "Diferença/Consumo",
            "Alarme",
          ]}
          tableBody={[]}
          showTable={showList}
        />
		</div>
	);
};

export default Consumo;
