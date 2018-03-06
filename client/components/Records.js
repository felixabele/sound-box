import React from 'react';
import Spotify from 'spotify-web-api-js';
import { connect } from 'react-redux';
import Tab from './Tab';
import Item from './Item';
import Pagination from './Pagination';

const ALBUMS = 'albums';
const PLAYLISTS = 'playlists';

class Records extends React.Component {
  constructor(props) {
    super(props);

    this.spotifyApi = new Spotify();
    this._toggleTab = this._toggleTab.bind(this);
    this._onPaginate = this._onPaginate.bind(this);
    this.state = {
      activeTab: 'playlists',
      items: [],
      paginationOffset: 0,
      paginationTotal: 0,
    };
  }

  _handleError(e) {
    console.error(e);
  }

  _loadAlbums(offset = 0) {
    this.spotifyApi.getMySavedAlbums({ offset: offset }).then((albumsData) => {
      this.setState({
        items: albumsData.items.map((item) => item.album),
        activeTab: ALBUMS,
        paginationOffset: albumsData.offset,
        paginationTotal: albumsData.total,
      });
    }, this._handleError);
  }

  _loadPlaylists(offset = 0) {
    this.spotifyApi.getUserPlaylists(this.props.user.id, { offset: offset }).then((playlistData) => {
      this.setState({
        items: playlistData.items,
        activeTab: PLAYLISTS,
        paginationOffset: playlistData.offset,
        paginationTotal: playlistData.total,
      });
    }, this._handleError);
  }

  _toggleTab(tab) {
    if (this.state.activeTab !== tab) {

      this.setState({
        paginationOffset: 0,
        paginationTotal: 0,
      });

      if (tab === ALBUMS) {
        this._loadAlbums();
      }
      else if (tab === PLAYLISTS) {
        this._loadPlaylists();
      }
    }
  }

  _onPaginate(offset) {
    if (this.state.activeTab === ALBUMS) {
      this._loadAlbums(offset);
    }
    else if (this.state.activeTab === PLAYLISTS) {
      this._loadPlaylists(offset);
    }
  }

  componentDidMount() {
    const { accessToken, refreshToken, user } = this.props;
    if (accessToken !== null) {
      this.spotifyApi.setAccessToken(accessToken);
      this._loadPlaylists();
    }
  }

  render() {
    const { cardId, playlistId } = this.props;
    const itemComponents = this.state.items.map((item) =>
      <Item
        item={item}
        key={item.id}
        selected={playlistId == item.uri}
        cardId={cardId}
      />
    );

    return (
      <div className="account">
        <ul className="nav nav-tabs">
          <Tab
            active={ this.state.activeTab === PLAYLISTS }
            onActivate={ () => { this._toggleTab(PLAYLISTS) } }
          >
            Playlists
          </Tab>
          <Tab
            active={ this.state.activeTab === ALBUMS }
            onActivate={ () => { this._toggleTab(ALBUMS) } }
          >
            Albums
          </Tab>
        </ul>

        <div className="tab-content row">
          { itemComponents }
        </div>

        <Pagination
          limit="20"
          offset={ this.state.paginationOffset }
          total={ this.state.paginationTotal }
          onPaginate={ this._onPaginate }
        />
      </div>
    );
  }
}
export default connect(state => state)(Records);
