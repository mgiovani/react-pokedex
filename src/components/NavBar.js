import React, { Component } from 'react'

export default class NavBar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top" style={{
                    backgroundColor: "#ef5350",
                }}>
                    <a href="#" className="navbar-brand col-sn-2 col-md-2 align-items-center">Pokedex</a>
                </nav>
                
            </div>
        )
    }
}
