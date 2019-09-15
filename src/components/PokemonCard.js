import React, { Component } from 'react';
import { Link } from 'react-router-dom';

function zeroPad(num) {
    var zero = 3 - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
}

export default class PokemonCard extends Component {
    state = {
        name: '',
        imageUrl: '',
        pokemonId: ''
    };

    componentDidMount() {
        const { name, url } = this.props;
        const pokemonId = url.split('/')[6];
        const imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${zeroPad(
            pokemonId
        )}.png`;

        this.setState({ name, imageUrl, pokemonId });
    }

    render() {
        return (
            <div className='col-md4 col-sm-4 mb-5'>
                <Link
                    className='card-link'
                    to={`pokemon/${this.state.pokemonId}`}
                >
                    <div className='card'>
                        <img
                            src={this.state.imageUrl}
                            className='card-img-top mx-auto mt-2'
                            alt={this.state.name + '- Image'}
                        />
                        <h5 className='card-header'>
                            {'#' + this.state.pokemonId}
                        </h5>
                        <div className='card-body mx-auto'>
                            <h5 className='card-title'>
                                {this.state.name
                                    .toLowerCase()
                                    .split(' ')
                                    .map(
                                        letter =>
                                            letter.charAt(0).toUpperCase() +
                                            letter.substring(1)
                                    )
                                    .join(' ')}
                            </h5>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}
