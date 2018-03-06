import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import { connect } from 'react-redux';
import User from './User';
import Records from './Records';
import CurrentItem from './CurrentItem';
import {
  getMyInfo,
  setTokens,
} from '../actions/actions';

class Account extends Component {
  componentDidMount() {
    const {dispatch, params} = this.props;
    const {accessToken, refreshToken} = params;
    dispatch(setTokens({accessToken, refreshToken}));
    dispatch(getMyInfo());
  }

  render() {
    const { accessToken, refreshToken, user, cardId, playlistId, cardData } = this.props;

    if (user.loading) {
      return (
        <h2>Loading</h2>
      );
    }
    return (
      <div className="account">
        <div className="row">
          <div className="col-md-6">
            <User user={user} />
          </div>
          <div className="col-md-3 ml-auto">
            <CurrentItem item={cardData} />
          </div>
        </div>
        <hr />
        <Records />
      </div>
    );
  }
}

export default connect(state => state)(Account);
