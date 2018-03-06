import React from 'react';
import classnames from 'classnames';

export default class Records extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="nav-item">
        <a className={ classnames('nav-link', { active: this.props.active }) }
          onClick={() => { this.props.onActivate() } }
        >
          { this.props.children }
        </a>
      </li>
    );
  }
}
