import Select from 'react-select';
import React, { useState } from 'react';
import Axios from 'axios';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-monokai';

const options = [
	{ value: 'javascript', label: 'javascript' },
	{ value: 'python', label: 'python' },
	{ value: 'Java', label: 'Java' },
	{ value: 'C', label: 'C' },
];
const defValue = `function add(){
  return "Hello World"
}
console.log(add())`;
function App() {
	const [source, setsource] = useState(defValue);
	const [id, setId] = useState('');
	const [output, setoutput] = useState('');
	const [input, setinput] = useState('');
	const [selectedOption, setselectedOption] = useState({
		value: 'javascript',
		label: 'javascript',
	});
	function onChange(newValue) {
		setsource(newValue);
	}

	const handleChange = (selected) => {
		setselectedOption(selected);
	};

	const Compile = async () => {
		await Axios.get(
			`https://judge0-ce.p.rapidapi.com/create?source_code=${source}&language=${selectedOption.value}&input=${input}&api_key=4229c91d5cmsh068c7f0a35ce7b1p10dadfjsn1a611e55b0ae`
		).then(({ data }) => {
			setId(data.id);
			console.log(data.id);
		});
	};

	const Run = async () => {
		await Axios.get(
			`https://judge0-ce.p.rapidapi.com/get_details?id=${id}&api_key=4229c91d5cmsh068c7f0a35ce7b1p10dadfjsn1a611e55b0ae`
		).then(({ data }) => {
			if (data.stderr) {
				setoutput(data.stderr);
				setId(null);
				return;
			}
			setoutput(data.stdout);
			setId(null);
		});
	};
	return (
		<div className='App'>
			<div className='select-div'>
				<div className='title-div'>Select Language</div>
				<Select
					value={selectedOption}
					onChange={handleChange}
					options={options}
				/>
              
			</div>
            
			<div className='cover'>
				<div className='editor-div'>
					<div className='title-div'>Write Your Code:</div>

					<AceEditor
						defaultValue={defValue}
						width='60vw'
                        height='90vh'
						showPrintMargin={true}
						showGutter={true}
						highlightActiveLine={true}
						mode={selectedOption.value}
						// mode='python'
						theme='monokai'
						fontSize={16}
						onChange={onChange}
						name='UNIQUE_ID_OF_DIV'
						editorProps={{ $blockScrolling: true }}
						setOptions={{
							tabSize: 2,
						}}
					/>						
				</div>
				<div className='box-container'>
                <div className='box'>
						<div>Output:</div>
						<textarea value={output} disabled />
					</div>

					<div className='box-1'>
						<div>Input:</div>
						<textarea className='textinput' onChange={(e) => setinput(e.target.value)} />
					</div>

                    <button className='compile-btn' onClick={Compile}>Compile and Execute</button>

					<div className='status'>
						<h3  onSubmit={Run}>Status :</h3>
						<h3 >Memory :</h3>
						<h3 >Time :</h3>
					</div>
					
				</div>
			</div>
		</div>
	);
}
export default App;
