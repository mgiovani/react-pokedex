import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import PokemonDetails from './components/PokemonDetails';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className='App'>
                <NavBar />
                <div className='container'>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route
                            exact
                            path='/pokemon/:pokemonId'
                            component={PokemonDetails}
                        />
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
