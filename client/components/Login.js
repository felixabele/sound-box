import React, { Component } from 'react';
import loginSVG from '../log_in.svg';

/**
 * Our login page
 * Has a login button that hit's the login url
 */
export default class Login extends Component {
  render() {
    return (
      <div className="login row justify-content-md-center">
        <div className="col col-lg-2">
          <h2>Please login with your Spotify account</h2>
          <a href="/login" dangerouslySetInnerHTML={{__html: loginSVG}}></a>
        </div>
      </div>
    );
  }
}
