import React, { Component } from 'react';
import times from 'lodash/times';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0
    };

    this.gotoPage = this.gotoPage.bind(this);
  }

  gotoPage(e, page) {
    e.preventDefault();
    this.props.onPaginate(page * this.props.limit);
    this.setState({
      currentPage: page
    });
  }

  render() {
    const { limit, offset, total } = this.props;
    const pages = Math.ceil(total / limit);
    const pageComponent = [];

    if (pages === 1) { return null; }

    times(pages, (page) => {
      const classNames = ['page-item'];

      if (this.state.currentPage === page){
        classNames.push('active');
      }

      pageComponent.push(
        <li className={ classNames } key={ page }>
          <a className="page-link" href="#" onClick={ (e) => this.gotoPage(e, page) }>
            { page + 1 }
          </a>
        </li>
      );
    });

    return (
      <nav>
        <ul className="pagination justify-content-center">
          { pageComponent }
        </ul>
      </nav>
    );
  }
}

export default Pagination;
