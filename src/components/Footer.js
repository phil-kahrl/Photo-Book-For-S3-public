import React, { Component } from 'react';

class Footer extends Component {
  getHtml() {
    return { __html: this.props.appData.footerHtml };
  }

  render() {
    return (
      <div
        id="footer"
        style={{
          textAlign: 'center',
          padding: '20px'
        }}
      >
        Weblum by{' '}
        <a
          href="https://www.cathexis.io"
          rel="noopener noreferrer"
          target="_blank"
        >
          Cathexis
        </a>
      </div>
    );
  }
}

export default Footer;
