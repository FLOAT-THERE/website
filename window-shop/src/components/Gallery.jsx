import React, { Component } from 'react';
import { postCloset, getProductByImgSrc } from '../Recommendation'

export default class Gallery extends Component {

    state = {
        upperProductTypes: [],
        upperImageId: null,
        lowerImageId: null,
        fullImageId: null,
        postedToCloset: false
    }

    constructor() {
        super();
        this.allProductTypes().then((data) => {
            this.setState({
                upperProductTypes: data
            })
        });
    }

    // retrieve all product types
    allProductTypes = () => {
        return new Promise((resolve) => {
            var upperImageTypes = new Set();
            upperImageTypes.add("Tops");
            upperImageTypes.add("Sweaters");
            upperImageTypes.add("Jackets and Vests");
            upperImageTypes.add("Shirts");
            upperImageTypes.add("top");
            upperImageTypes.add("Tanks");
            resolve(upperImageTypes)
        })

    }
    displayImage = (id) => {
        this.closeAlert(); // turns off savetocloset alert message 
        var productId = 0;
        for (var j = 0; j < this.props.allProducts.length; ++j) {
            if (this.props.allProducts[j].image.src === this.props.likedImageSrcs[id]) {
                productId = j;
                break;
            }
        }
        if (this.state.upperProductTypes.has(this.props.allProducts[productId].product_type)) {
            this.setState({
                upperImageId: id,
                fullImageId: null
            })
        } else if (this.props.allProducts[productId].product_type == "Dresses" || this.props.allProducts[productId].product_type == "Jumpsuits" || this.props.allProducts[productId].product_type == "Cover-ups" || this.props.allProducts[productId].product_type == "Dresses + Rompers") {
            this.setState({
                upperImageId: null,
                lowerImageId: null,
                fullImageId: id
            })
        }
        else {
            this.setState({
                lowerImageId: id,
                fullImageId: null
            })
        }

    }
    postItemsToCloset = () => {
        this.props.changeAddedToCloset(); // instruction turns green
        if (this.state.upperImageId != null) {
            var item = getProductByImgSrc(this.props.allProducts, this.props.likedImageSrcs[this.state.upperImageId]);
            postCloset(item, this.props.customerId);
            this.setState({
                postedToCloset: true
            })
        }
        if (this.state.lowerImageId != null) {
            var item = getProductByImgSrc(this.props.allProducts, this.props.likedImageSrcs[this.state.lowerImageId]);
            postCloset(item, this.props.customerId);
            this.setState({
                postedToCloset: true
            })
        }
        if (this.state.fullImageId != null) {
            var item = getProductByImgSrc(this.props.allProducts, this.props.likedImageSrcs[this.state.fullImageId]);
            postCloset(item, this.props.customerId);
            this.setState({
                postedToCloset: true
            })
        }

    }
    closeAlert = () => {
        this.setState({
            postedToCloset: false
        })
    }
    render() {
        return (
            <>
                {this.state.postedToCloset == true ?
                    <div className="w-2/3 m-auto">
                        <div className="flex justify-center w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">Saved to closet</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <button onClick={this.closeAlert}>
                                    <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                </button>
                            </span>
                        </div>
                    </div>
                    : <></>}
                <div className="flex items-center justify-center w-full bg-gray-200 h-containerh">
                    <div className="overflow-scroll sm:w-820 h-containerh grid sm:grid-cols-2 grid-cols-mobileCols m-auto">
                        <div className="min-h-0 w-full bg-gray-200 h-containerh px-2 sm:px-6 py-6 m-auto">
                            <div className=" w-full h-full gap-3 grid grid-rows-mobileRows grid-cols-mobileCols-2 sm:grid-rows-picRows sm:grid-cols-picCols overflow-scroll">
                                {
                                    this.props.likedImageSrcs.map((src, i) => {
                                        return (
                                            <a onClick={this.displayImage.bind(this, i)} style={{ cursor: 'pointer' }} >
                                                <div className="pointer-events-none bg-white m-auto overflow-hidden h-full rounded-lg w-full px-2 pt-2 pb-12 border border-gray-300 ">
                                                    <div className="overflow-hidden w-full h-full rounded-lg">
                                                        <img className=" w-full h-auto mx-auto block " src={src} alt="model" />
                                                    </div>
                                                    <div className="py-2 text-center outline-none">
                                                        <p className=" text-xs font-title text-gray-600">{this.props.productTitles[i]}</p>
                                                    </div>
                                                </div>
                                            </a>

                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="min-h-1 w-full bg-gray-200 h-containerh px-2 sm:px-6 py-6 m-auto">
                            <div className="pointer-events-none bg-white m-auto overflow-hidden h-full rounded-lg w-full px-2 pt-6 border border-gray-300 ">
                                {this.state.upperImageId != null || this.state.lowerImageId != null ?
                                    <>
                                        <div className="overflow-hidden w-10/12 h-56 m-auto">
                                            <img className=" w-full h-auto mx-auto block " src={this.state.upperImageId == null ? "https://www.publicdomainpictures.net/pictures/30000/nahled/plain-white-background.jpg" : this.props.likedImageSrcs[this.state.upperImageId]} alt="model" />
                                        </div>
                                        <div className="overflow-hidden w-10/12 h-64 m-auto pt-6">
                                            <img className=" w-full h-auto mx-auto block " src={this.state.lowerImageId == null ? "https://www.publicdomainpictures.net/pictures/30000/nahled/plain-white-background.jpg" : this.props.likedImageSrcs[this.state.lowerImageId]} alt="model" />
                                        </div>
                                    </> : <></>}
                                {this.state.fullImageId != null ?
                                    <div className="overflow-hidden w-10/12 h-pch m-auto pt-6">
                                        <img className=" w-full h-auto mx-auto block " src={this.props.likedImageSrcs[this.state.fullImageId]} alt="model" />
                                    </div> : <></>}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="justify-center flex w-full h-16 my-6">
                    <div className="overflow-scroll sm:w-820 grid sm:grid-cols-2 grid-cols-mobileCols m-auto">
                        <div >
                        </div>
                        <div className="w-full sm:w-10/12 m-auto">
                            <button onClick={this.postItemsToCloset} style={{ backgroundImage: "linear-gradient(to right,#1BF5BD, #25DCC3)" }} className=" focus:outline-none text-lg text-white rounded-lg h-16 w-full items-center justify-center shadow-lg">
                                <p style={{ fontWeight: "bold" }}>Save to closet</p>
                            </button>
                        </div>
                    </div>
                </div>
                <br></br>
                <br></br>
            </>
        )
    }

}