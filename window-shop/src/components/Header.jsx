import React, { Component } from 'react';

class Header extends Component {

    render() {
        return (
            <>
                <head>
                    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'></link>
                </head>
                <div className="text-center pt-5 pb-4">
                    <p className="text-xl">Start curating your own closet!</p>
                </div>
            </>
        )
    }

}

export default Header