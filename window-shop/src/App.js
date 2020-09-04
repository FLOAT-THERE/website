import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import base64 from 'base-64';
import Customer from './components/Customer';
import ProductCardDiv from './components/ProductCardDiv';
import Header from './components/Header'
import Instructions from './components/Instructions';
import Gallery from './components/Gallery';
import { recommend, numLikes, numDislikes } from './Recommendation';


class App extends Component {
	state = {
		allProducts: [],
		allProductTypes: [],
		recommendedImageSrcs: [],
		recommendedProductTitles: [],
		likedImageSrcs: [],
		currentIndex: 0,
		currentLikes: 0,
		customerId: null,
		numDislikes: 0,
		numLikes: 0,
		atMakeCombos: false,
		addedToCloset: false
	};

	// takes all data from api and puts it into state variables
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
			}).then(() => {
				this.getRecommendedProducts(this.state.allProducts)
			}).catch((err) => console.log(err));

	}

	// gets recommended products 
	getRecommendedProducts = (allProducts) => {
		recommend(this.state.customerId).then((recommendedProducts) => {
			var srcArray = [];
			var titleArray = [];
			var amount = 0;
			for (var i = 0; i < allProducts.length; ++i) {
				if (amount < 20 && allProducts[i].id == recommendedProducts[amount][0]) {
					srcArray[amount] = allProducts[i].image.src;
					titleArray[amount] = allProducts[i].title;
					i = -1;
					++amount;
				}
				if (amount >= 20) {
					break;
				}
			}
			this.setState({ numDislikes: numDislikes })
			this.setState({ numLikes: numLikes })
			this.setState({ recommendedImageSrcs: srcArray });
			this.setState({ recommendedProductTitles: titleArray });
		})

	}
	// retrieves and updates customer id 
	setCustomerId = (customerId) => {
		this.setState({
			customerId: customerId
		})
	}
	incrementLikes = () => {
		this.setState({
			currentLikes: this.state.currentLikes + 1
		})
		if (this.state.currentLikes == 4) { this.changeAtMakeCombos() }

	}
	incrementIndex = () => {
		this.setState({
			currentIndex: this.state.currentIndex + 1
		})
	}
	changeAtMakeCombos = () => {
		this.setState({
			atMakeCombos: true
		})
	}
	changeAddedToCloset = () => {
		this.setState({
			addedToCloset: true
		})
	}

	render() {
		return (
			<>
				<Header />
				<Router>
					<Route path="/" exact render={(props) =>

						<Customer {...props}
							setCustomerId={this.setCustomerId}
							customerId={this.state.customerId}
						/>
					} />
					<Route path="/" exact render={(props) =>
						<>
							<Instructions {...props}
								atMakeCombos={this.state.atMakeCombos}
								addedToCloset={this.state.addedToCloset}
							/>
							<ProductCardDiv {...props}
								productTitles={this.state.recommendedProductTitles}
								likedImageSrcs={this.state.likedImageSrcs}
								allProducts={this.state.allProducts}
								imageSrcs={this.state.recommendedImageSrcs}
								currentIndex={this.state.currentIndex}
								currentLikes={this.state.currentLikes}
								incrementIndex={this.incrementIndex}
								incrementLikes={this.incrementLikes}
								customerId={this.state.customerId}
							/>
						</>
					} />
					<Route path="/combine" render={(props) =>
						<>
							<Instructions {...props}
								atMakeCombos={this.state.atMakeCombos}
								addedToCloset={this.state.addedToCloset}
							/>
							<Gallery {...props}
								allProducts={this.state.allProducts}
								productTitles={this.state.recommendedProductTitles}
								likedImageSrcs={this.state.likedImageSrcs}
								allProductTypes={this.state.allProductTypes}
								changeAddedToCloset={this.changeAddedToCloset}
								customerId={this.state.customerId}
							/>
						</>
					} />
				</Router>
			</>
		);
	}

}

export default App;