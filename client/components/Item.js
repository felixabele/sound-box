import React, { Component } from 'react';
import 'whatwg-fetch';

class Item extends Component {
  render() {
    const { name, images, uri } = this.props.item
    const { selected, cardId } = this.props
    const imageUrl = images[0] ? images[0].url : ''
    const itemClass = ['item', 'card'];
    let buttonEl = '';

    function assignList(e) {
      e.preventDefault();

      fetch('/assign_list', {
      	method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playlistId: uri
        })
      });
    }

    if (selected) {
      itemClass.push('border-success')
      buttonEl = <button type="button" className="btn btn-success btn-block" disabled="true">
                  Selected
                </button>;
    } else if (cardId > 0) {
      buttonEl = <button onClick={assignList} type="button" className="btn btn-outline-primary btn-block">
                  Assign list
                </button>;
    }

    return (
      <div className="col-lg-3 col-sm-4 col-xs-6">
        <div className={itemClass.join(' ')}>
          <img src={imageUrl} className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title">
              {name}
            </h5>
            {buttonEl}
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
