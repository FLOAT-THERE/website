import React, { Component } from 'react';

export default class ProductCard extends Component {

	constructor() {
		super()
	}

	render() {
		if (this.props.srcNumber >= 19) {
			return (
				<>
					<head>
						<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'></link>
					</head>
					<div className="pointer-events-none text-center bg-opacity-100">
						<div className="pointer-events-none bg-white m-auto overflow-hidden h-pch rounded-lg w-10/12 px-6 pt-6 pb-12 shadow-lg border border-gray-300 ">
							<div className="py-2 justify-center content-center outline-none">
								<p className=" text-lg font-title text-gray-600">Uh oh... You've run out of cards!</p>
								<br></br>
								<p className=" text-lg font-title text-gray-600">Come back next week to browse a new set of items!</p>
							</div>
						</div>
					</div>

				</>
			)
		}
		return (
			<>
				<head>
					<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'></link>
				</head>
				<div className="pointer-events-none text-center bg-opacity-100">
					<div className="pointer-events-none bg-white m-auto overflow-hidden h-pch rounded-lg w-10/12 px-6 pt-6 pb-12 shadow-lg border border-gray-300 ">
						<div className="overflow-hidden w-full h-imgh rounded-lg">
							<img key={this.props.imageSrcs[this.props.srcNumber]} className="rounded-lg w-full h-auto mx-auto block " src={this.props.imageSrcs[this.props.srcNumber]} alt="model" />
						</div>
						<div className="py-2 justify-center content-center outline-none">
							<p className=" text-lg font-title text-gray-600">{this.props.productTitles[this.props.srcNumber]}</p>
						</div>
					</div>
				</div>

			</>
		);
	}
}
