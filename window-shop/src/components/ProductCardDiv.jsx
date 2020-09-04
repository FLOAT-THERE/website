import { TinderLikeCard } from 'react-stack-cards'
import React, { Component } from 'react';
import ProductCard from './ProductCard';
import { faCheck, faTimes, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProductByImgSrc, postDislikes, postLikes } from '../Recommendation'

class ProductCardDiv extends Component {

    constructor(props) {
        super(props)
        this.state = {
            directionTinder: "swipeDown"
        }
        this.Tinder = null
    }
    onLike = () => {
        var product = getProductByImgSrc(this.props.allProducts, this.props.imageSrcs[this.props.currentIndex])
        postLikes(product, this.props.customerId) // customer id hardcoded 
        this.props.likedImageSrcs[this.props.currentIndex] = this.props.imageSrcs[this.props.currentIndex]
        this.props.incrementIndex()
        this.props.incrementLikes()
        this.Tinder.swipe()
    }
    onDislike = () => {
        var product = getProductByImgSrc(this.props.allProducts, this.props.imageSrcs[this.props.currentIndex])
        postDislikes(product, this.props.customerId)
        this.props.incrementIndex();
        this.Tinder.swipe()
    }
    onClick = () => {
        this.props.history.push('/combine')
    }

    render() {

        if (this.props.imageSrcs.length === 0) {
            return (
                <div className="text-center">Loading...</div>
            )
        }
        if (this.props.currentIndex >= 19) {
            return (
                <>
                    <div className="justify-center flex w-full bg-gray-200 h-containerh">
                        <div className=" absolute z-50">
                            <TinderLikeCard
                                images={[]}
                                width="350"
                                height="250"
                                direction={this.state.directionTinder}
                                duration={400}
                                ref={(node) => this.Tinder = node}
                                className="tinder"
                            >
                                <ProductCard productTitles={this.props.productTitles} imageSrcs={this.props.imageSrcs} srcNumber={this.props.currentIndex} ></ProductCard>
                            </TinderLikeCard>
                        </div>
                        <div className="pt-pushdown">
                            <button onClick="" className="pointer-events-none focus:outline-none text-5xl text-gray-400 bg-white rounded-full h-24 w-24 items-center justify-center mr-16 shadow-lg">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <button onClick="" className="pointer-events-none focus:outline-none text-5xl text-gray-400 bg-white rounded-full h-24 w-24 items-center justify-center shadow-lg">
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        </div>
                    </div>
                    <div className="justify-center flex w-full h-16 my-6">
                        {this.props.currentLikes < 5 ?
                            (<button style={{ backgroundImage: "linear-gradient(to right,#c2d6d6, #c2d6d6)" }} className="pointer-events-none focus:outline-none text-xl text-gray-200 rounded-lg h-16 w-300 items-center justify-center shadow-lg">
                                <p style={{ fontWeight: "bold" }}><FontAwesomeIcon icon={faHeart} /> &nbsp;&nbsp; Make Combinations</p>
                            </button>)
                            :
                            <button onClick={this.onClick} style={{ backgroundImage: "linear-gradient(to right,#1BF5BD, #25DCC3)" }} className="focus:outline-none text-xl text-white rounded-lg h-16 w-300 items-center justify-center shadow-lg">
                                <p style={{ fontWeight: "bold" }}><FontAwesomeIcon icon={faHeart} /> &nbsp;&nbsp; Make Combinations</p>
                            </button>}
                    </div>
                    <br></br>
                    <br></br>
                </>
            )
        }

        return (
            <>
                <div className="justify-center flex w-full bg-gray-200 h-containerh">
                    <div className=" absolute z-50">
                        <TinderLikeCard
                            images={[0]}
                            width="350"
                            height="250"
                            direction={this.state.directionTinder}
                            duration={150}
                            ref={(node) => this.Tinder = node}
                            className="tinder"
                        >
                            <ProductCard productTitles={this.props.productTitles} imageSrcs={this.props.imageSrcs} srcNumber={this.props.currentIndex} ></ProductCard>
                        </TinderLikeCard>
                    </div>
                    <div className="pt-pushdown">
                        <button onClick={this.onDislike.bind(this)} className="focus:outline-none text-5xl text-red-700 bg-white rounded-full h-24 w-24 items-center justify-center mr-16 shadow-lg">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <button onClick={this.onLike.bind(this)} className="focus:outline-none text-5xl text-green-400 bg-white rounded-full h-24 w-24 items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    </div>
                </div>
                <div className="justify-center flex w-full h-16 my-6">
                    {this.props.currentLikes < 5 ?
                        (<button style={{ backgroundImage: "linear-gradient(to right,#c2d6d6, #c2d6d6)" }} className="pointer-events-none focus:outline-none text-xl text-gray-200 rounded-lg h-16 w-300 items-center justify-center shadow-lg">
                            <p style={{ fontWeight: "bold" }}><FontAwesomeIcon icon={faHeart} /> &nbsp;&nbsp; Make Combinations</p>
                        </button>) :
                        <button onClick={this.onClick} style={{ backgroundImage: "linear-gradient(to right,#1BF5BD, #25DCC3)" }} className="focus:outline-none text-xl text-white rounded-lg h-16 w-300 items-center justify-center shadow-lg">
                            <p style={{ fontWeight: "bold" }}><FontAwesomeIcon icon={faHeart} /> &nbsp;&nbsp; Make Combinations</p>
                        </button>}

                </div>
                <br></br>
                <br></br>

            </>
        );
    }
}

export default ProductCardDiv 