import React, {Component} from 'react';
import PokemonCard from './PokemonCard';
import Axios from 'axios';

export default class PokemonList extends Component {
  state = {
    url: 'https://pokeapi.co/api/v2/pokemon/?limit=151',
    pokemon: null,
  };

  async componentDidMount() {
    try {
      const res = await Axios.get(this.state.url);
      this.setState({pokemon: res.data['results']});
    } catch {}
  }

  render() {
    return (
      <React.Fragment>
        {this.state.pokemon ? (
          <div className="row">
            {this.state.pokemon.map(pokemon => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
              />
            ))}
          </div>
        ) : (
          <h1>Loading Pokemon List...</h1>
        )}
      </React.Fragment>
    );
  }
}
