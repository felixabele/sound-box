import React, { Component } from 'react';

class CurrentItem extends Component {
  render() {
    if (typeof(this.props.item) === 'undefined') { return null; }
    if (typeof(this.props.item.images) === 'undefined') { return null; }
    const { name, images, uri } = this.props.item
    const imageUrl = images[0] ? images[0].url : ''

    return (
      <div className='item card border-success'>
        <img src={imageUrl} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">
            {name}
          </h5>
        </div>
      </div>
    );
  }
}

export default CurrentItem;
