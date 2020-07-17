import React, { Component } from 'react';
import axios from 'axios';
import base64 from 'base-64';
import ProductCard from './components/ProductCard';
import SaveToCloset from './components/SaveToCloset';
import AddButton from './components/AddButton';

class App extends Component {
	state = {
		allProducts: [],
		allImageSrcs: [],
		addCard: false
	};

	// takes all data from api and puts it into allProducts
	constructor() {
		super();

		const token = 'b9bdb0efc4f677ef3e699ea413280eb3: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';
		const hash = base64.encode(token);
		const Basic = 'Basic ' + hash;

		var herokuCors = 'https://cors-anywhere.herokuapp.com/';
		let url = herokuCors + 'https://float-there.myshopify.com/admin/api/2020-04/products.json?limit=250';

		axios
			.get(url, { headers: { Authorization: Basic } })
			.then((data) => {
				this.setState({ allProducts: data.data.products });
				var srcArray = [];
				this.state.allProducts.forEach((product, i) => {
					srcArray[i] = product.image.src;
				});
				this.setState({ allImageSrcs: srcArray });
			})
			.catch((err) => console.log(err));
	}


	handleAddButtonClick = () => {
		let currState = this.state.addCard;
		this.setState({
			addCard: !currState
		})
	}

	render() {
		return (
			<div className="pt-4">
				<SaveToCloset></SaveToCloset>
				<ProductCard imageSrcs={this.state.allImageSrcs} />
				{this.state.addCard === false ? null : (<ProductCard imageSrcs={this.state.allImageSrcs} />)}
				<AddButton onClick={this.handleAddButtonClick} addCard={this.state.addCard} />
			</div>
		);
	}
}

export default App;
