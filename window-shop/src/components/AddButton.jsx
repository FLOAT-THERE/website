import React, { Component } from 'react';
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class ProductCard extends Component {

    render() {
        return (
            <>
                <script src="https://kit.fontawesome.com/74fefd4d77.js" crossOrigin="anonymous"></script>

                <div className="m-auto overflow-hidden w-10/12 px-12 border border-gray text-center">
                    <div className="py-2 content-center outline-none">
                        <button onClick={this.props.onClick} className="focus:outline-none bg-transparent rounded-full h-10 w-10 items-center justify-center border border-black">
                            <FontAwesomeIcon icon={this.props.addCard === true ? faMinus : faPlus} />
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
