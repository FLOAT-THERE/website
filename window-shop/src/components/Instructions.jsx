import React, { Component } from 'react';

export default class Instructions extends Component {

    goToCombos = () => {
        this.props.history.push('/combine')
    }
    goToSwiping = () => {
        this.props.history.push('/')
    }
    render() {
        return (

            <div className="justify-center items-center flex flex-col w-full">
                <div className="justify-center flex flex-col w-full lg:w-3/5 grid grid-rows-1 grid-cols-3 pb-4">
                    <div className="justify-center flex w-full grid grid-rows-2 grid-cols-0">
                        <div class="row-col-auto text-center justify-center w-full flex pb-2">
                            <button onClick={this.goToSwiping} className="focus:outline-none text-base text-green-300 border-2 border-green-300 rounded-full h-8 w-8 text-center">
                                1
                            </button>
                        </div>
                        <div className="text-center justify-center w-full flex">
                            <p className="text-xs">Like five or more items</p>
                        </div>
                    </div>
                    {this.props.atMakeCombos == true ?
                        <div className="justify-center flex w-full grid grid-rows-2 grid-cols-0">
                            <div class="text-center justify-center w-full flex">
                                <button onClick={this.goToCombos} className="focus:outline-none text-base text-green-300 border-2 border-green-300 rounded-full h-8 w-8 text-center">
                                    2
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-xs">Make combinations and save items</p>
                            </div>
                        </div> :
                        <div className="justify-center flex w-full grid grid-rows-2 grid-cols-0">
                            <div class="text-center justify-center w-full flex">
                                <button className="focus:outline-none pointer-events-none text-base text-gray-600 border-2 border-gray-300 rounded-full h-8 w-8 text-center">
                                    2
                        </button>
                            </div>
                            <div className="text-center">
                                <p className="text-xs">Make combinations and save items</p>
                            </div>
                        </div>}
                    {this.props.addedToCloset == true ? <div className="justify-center flex w-full grid grid-rows-2 grid-cols-0">
                        <div class="text-center justify-center w-full flex">
                            <button className="focus:outline-none text-base text-green-300 border-2 border-green-300 rounded-full h-8 w-8 text-center">
                                3
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-xs">Check out your curated closet</p>
                        </div>
                    </div> :
                        <div className="justify-center flex w-full grid grid-rows-2 grid-cols-0">
                            <div class="text-center justify-center w-full flex">
                                <button className="focus:outline-none pointer-events-none text-base text-gray-600 border-2 border-gray-300 rounded-full h-8 w-8 text-center">
                                    3
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-xs">Check out your curated closet</p>
                            </div>
                        </div>}

                </div>
            </div>
        )
    }

}