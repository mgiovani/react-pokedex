import React, { Component } from 'react';
import axios from 'axios';

function zeroPad(num) {
    var zero = 3 - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
}

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
};

export default class PokemonDetails extends Component {
    state = {
        pokemonId: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: '',
            defense: '',
            speed: '',
            specialAttack: '',
            specialDefense: ''
        },
        height: '',
        weight: '',
        eggGroups: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evolutions: '',
        hatchSteps: '',
        themeColor: '#EF5350'
    };

    async componentDidMount() {
        const { pokemonId } = this.props.match.params;

        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
        const imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${zeroPad(
            pokemonId
        )}.png`;
        const response = await axios.get(pokemonUrl);
        const pokemon = response.data;
        const name = pokemon.name
            .toLowerCase()
            .split('-')
            .map(letter => letter.charAt(0).toUpperCase() + letter.substring(1))
            .join(' ');
        let { hp, attack, defense, speed, specialAttack, specialDefense } = '';
        pokemon.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break;
            }
        });
        const types = pokemon.types.map(type => type.type.name);
        const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;
        // The API gives the height of the Pokemon in decimetres
        const height = Math.round(pokemon.height * 0.1 * 100) / 100;
        // The API gives the weight of the Pokemon in hectograms
        const weight = Math.round(pokemon.weight * 0.1 * 100) / 100;
        const abilities = pokemon.abilities.map(ability => {
            return ability.ability.name
                .toLowerCase()
                .split('-')
                .map(
                    letter =>
                        letter.charAt(0).toUpperCase() + letter.substring(1)
                )
                .join(' ');
        });
        const evolutions = pokemon.stats
            .filter(stat => {
                if (stat.effort > 0) {
                    return true;
                }
                return false;
            })
            .map(stat => {
                return `${stat.effort} ${stat.stat.name}`
                    .toLowerCase()
                    .split('-')
                    .map(
                        letter =>
                            letter.charAt(0).toUpperCase() + letter.substring(1)
                    )
                    .join(' ');
            })
            .join(', ');

        const res = await axios.get(pokemonSpeciesUrl);
        const species = res.data;
        let description = '';
        species.flavor_text_entries.some(flavor => {
            if (
                flavor.language.name === 'en' &&
                flavor.version.name === 'omega-ruby'
            ) {
                description = flavor.flavor_text;
                return;
            }
        });

        const femaleRate = species.gender_rate;
        const genderRatioFemale = 12.5 * femaleRate;
        const genderRatioMale = 12.5 * (8 - femaleRate);

        const catchRate = Math.round((100 / 255) * species.capture_rate);
        const eggGroups = species.egg_groups
            .map(group => {
                return group.name
                    .toLowerCase()
                    .split('-')
                    .map(
                        letter =>
                            letter.charAt(0).toUpperCase() + letter.substring(1)
                    )
                    .join(' ');
            })
            .join(', ');
        const hatchSteps = 255 * (species.hatch_counter + 1);

        this.setState({
            description,
            genderRatioFemale,
            genderRatioMale,
            catchRate,
            eggGroups,
            hatchSteps,
            themeColor
        });
        this.setState({
            imageUrl,
            pokemonId,
            name,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evolutions
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.pokemonId ? (
                    <div className='card md-12 mt-5'>
                        <div className='row no-gutters'>
                            <div className='col-md-6 d-flex flex-wrap align-items-center'>
                                <img
                                    src={this.state.imageUrl}
                                    className='img-fluid'
                                />
                            </div>
                            <div className='col-md-6'>
                                <div className='card-body'>
                                    <h5 className='card-title'>
                                        #{this.state.pokemonId}
                                        {' - '}
                                        {this.state.name}
                                        <div className='float-right'>
                                            {this.state.types.map(type => (
                                                <span
                                                    key={type}
                                                    className='badge badge-pill mr-1'
                                                    style={{
                                                        backgroundColor: `#${TYPE_COLORS[type]}`,
                                                        color: 'white'
                                                    }}
                                                >
                                                    {type
                                                        .toLowerCase()
                                                        .split(' ')
                                                        .map(
                                                            s =>
                                                                s
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                s.substring(1)
                                                        )
                                                        .join(' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </h5>
                                    <hr />
                                    <p className='card-text'>
                                        {this.state.description}
                                    </p>
                                    <ul class='list-group'>
                                        <li class='list-group-item'>
                                            <strong>Height:</strong>
                                            <span class='float-right'>
                                                {this.state.height} m
                                            </span>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Weight</strong>
                                            <span class='float-right'>
                                                {this.state.weight} kg
                                            </span>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Abilities</strong>
                                            <ul>
                                                {this.state.abilities.map(
                                                    ability => {
                                                        return (
                                                            <li>{ability}</li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Stats</strong>
                                            <ul>
                                                <li>
                                                    HP
                                                    <span class='badge badge-danger float-right'>
                                                        {this.state.stats.hp}
                                                    </span>
                                                </li>
                                                <li>
                                                    Speed
                                                    <span class='badge badge-danger float-right'>
                                                        {this.state.stats.speed}
                                                    </span>
                                                </li>
                                                <li>
                                                    Special Attack
                                                    <span class='badge badge-danger float-right'>
                                                        {
                                                            this.state.stats
                                                                .specialAttack
                                                        }
                                                    </span>
                                                </li>
                                                <li>
                                                    Special Defense
                                                    <span class='badge badge-danger float-right'>
                                                        {
                                                            this.state.stats
                                                                .specialDefense
                                                        }
                                                    </span>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Catch Rate</strong>
                                            <span class='float-right'>
                                                {this.state.catchRate}%
                                            </span>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Egg Groups</strong>
                                            <span class='float-right'>
                                                {this.state.eggGroups}
                                            </span>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Hatch Steps</strong>
                                            <span class='float-right'>
                                                {this.state.hatchSteps}
                                            </span>
                                        </li>
                                        <li class='list-group-item'>
                                            <strong>Gender Ratio</strong>
                                            {this.state.genderRatioFemale <
                                            0 ? (
                                                <span class='float-right'>
                                                    Unknown
                                                </span>
                                            ) : (
                                                <div class='progress float-right w-100'>
                                                    <div
                                                        class='progress-bar'
                                                        role='progressbar'
                                                        style={{
                                                            width: `${this.state.genderRatioFemale}%`,
                                                            backgroundColor:
                                                                '#c2185b'
                                                        }}
                                                        aria-valuenow='15'
                                                        aria-valuemin='0'
                                                        aria-valuemax='100'
                                                    >
                                                        <small>
                                                            {
                                                                this.state
                                                                    .genderRatioFemale
                                                            }
                                                            %
                                                        </small>
                                                    </div>
                                                    <div
                                                        class='progress-bar'
                                                        role='progressbar'
                                                        style={{
                                                            width: `${this.state.genderRatioMale}%`,
                                                            backgroundColor:
                                                                '#1976d2'
                                                        }}
                                                        aria-valuenow='30'
                                                        aria-valuemin='0'
                                                        aria-valuemax='100'
                                                    >
                                                        <small>
                                                            {
                                                                this.state
                                                                    .genderRatioMale
                                                            }
                                                            %
                                                        </small>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class='card-footer text-muted text-center'>
                            Data From{' '}
                            <a
                                href='https://pokeapi.co/'
                                target='_blank'
                                className='card-link'
                            >
                                PokeAPI.co
                            </a>
                        </div>
                    </div>
                ) : (
                    <div>Loading Pokemon...</div>
                )}
            </React.Fragment>
        );
    }
}
