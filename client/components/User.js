import React, { Component } from 'react';

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {
  render() {
    const { display_name, images, id, email, external_urls, href, country, product } = this.props.user
    const imageUrl = images[0] ? images[0].url : "";

    return (
      <div className="user">
        <h2>{`Logged in as ${display_name}`}</h2>
        <div className="user-content">
          <img src={imageUrl} className="rounded-circle img-thumbnail" />
          <ul>
            <li><span>Name</span><span>{display_name}</span></li>
            <li><span>Email</span><span>{email}</span></li>
            <li><span>Spotify URI</span><span><a href={external_urls.spotify}>{external_urls.spotify}</a></span></li>
            <li><span>Land</span><span>{country}</span></li>
            <li><span>Produkt</span><span>{product}</span></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default User;
