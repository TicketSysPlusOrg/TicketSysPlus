import React from "react";

const PlayerList = (props) => {
    return (
        <div>
            <ul className="collection with-header">
                <li className="collection-header">
                    <h4>Players</h4>
                </li>
                {props.players.map((thisPlayer) => (
                    <a
                        href="#!"
                        className="collection-item"
                        key={thisPlayer._id}
                        onClick={props.updateCurrentPlayer.bind(this, thisPlayer)}
                    >
                        {thisPlayer.firstName} {thisPlayer.lastName}
                    </a>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
