require('dotenv').config()

import React, { Component } from 'react';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import {
  setCard,
} from '../actions/actions';

class SpotifyLogin extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const socket = socketIOClient(process.env.HOST);
    socket.on('card', data => {
      if (this.props.cardId !== data.cardId) {
        dispatch(setCard(data));
      }
    });
  }

  render() {
    const { children, cardId, playlistId } = this.props;
    let cardBadge;
    if ((cardId > 0) && (playlistId != null)) {
      cardBadge = <div className="badge badge-success">
        Card {cardId}
      </div>
    } else if (cardId > 0) {
      cardBadge = <div className="badge badge-info">
        Card {cardId} not assigned
      </div>
    } else {
      cardBadge = <div className="badge badge-secondary">
        No Card
      </div>
    }

    return (
      <div className="spotify-login">
        <nav className="navbar navbar-dark bg-dark justify-content-between">
          <span className="navbar-brand mb-0 h1">
            Sound Box - Assign Playlists
          </span>
          {cardBadge}
        </nav>
        <div className="container-fluid main-content">
          {children}
        </div>
      </div>
    );
  }
}

export default connect(state => state)(SpotifyLogin);
