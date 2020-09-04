import React, { Component } from 'react';
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class ProductCard extends Component {

    render() {
        return (
            <>
                <head>
                    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'></link>
                </head>
                <script src="https://kit.fontawesome.com/74fefd4d77.js" crossOrigin="anonymous"></script>
                <div className="text-center">
                    <div className="py-3 content-center">
                        <button className="focus:outline-none bg-transparent h-16 w-2/5 items-center justify-center rounded-md shadow-lg border-solid border-4 border-teal-200">
                            <FontAwesomeIcon icon={faShoppingBag} />
                            <br>
                            </br>
                            <p className="text-xs font-sans">save to closet</p>
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
