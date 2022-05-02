import React from 'react';

const PlayerSingle = (props) => {
  return (
    <div className="row">
      <div className="col s12 m6">
        <div className="card blue-grey darken-1">
          <div className="card-image">
            <img src="soccer.jpeg" alt="foot with cleat kicking soccer ball" />
          </div>
          <div className="card-content white-text">
            <span className="card-title">
              {props.player.firstName} {props.player.lastName}
            </span>
            <div className="row">
              <div className="col s6">
                <ul>
                  <li> Phone: {props.player.phone} </li>
                  <li> Email: {props.player.email} </li>
                  <li> Strength: {props.player.strength} </li>
                  <li> Speed: {props.player.speed} </li>
                </ul>
              </div>
              <div className="col s6">
                <ul>
                  <li> Endurance: {props.player.endurance} </li>
                  <li> Ability: {props.player.ability} </li>
                  <li> Techniques: {props.player.techniques} </li>
                  <li> Tactical: {props.player.tactical} </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-action">
            <a href="https://www.google.com">Team: {props.player.team}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerSingle;
