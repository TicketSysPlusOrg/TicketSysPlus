import React from "react";
import axios from "axios";
import "./App.css";
import PlayerList from "./Player/PlayerList";
import PlayerSingle from "./Player/PlayerSingle";
import PlayerForm from "./Player/PlayerForm";

class App extends React.Component {
    //construct
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            currentPlayer: {},
        };

        //bind this. enables using in class
        this.updateCurrentPlayer = this.updateCurrentPlayer.bind(this);
    }

    //when component is mounted, make a call to fetch data from apis
    componentDidMount() {
    //api (server) location
        const url = "http://localhost:4001/players";

        //axios gets the url, sets state with player list, catches errors
        axios
            .get(url)
            .then((res) => {
                this.setState({
                    players: res.data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //pass an item as arg, set state to current player
    updateCurrentPlayer(item) {
        this.setState({
            currentPlayer: item,
        });
    }

    render() {
        return (
            <div className="container">
                {/* navbar */}
                <div className="row">
                    <nav>
                        <div className="nav-wrapper purple darken-2">
                            <a href="/frontend/public" className="brand-logo center">
                Soccer Management Co
                            </a>
                        </div>
                    </nav>
                </div>
                {/* whole playerlist */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col s3">
                            <PlayerList
                                players={this.state.players}
                                updateCurrentPlayer={this.updateCurrentPlayer}
                            />
                        </div>
                        {/* single player */}
                        <div className="col s9">
                            <PlayerSingle player={this.state.currentPlayer} />
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <PlayerForm />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
