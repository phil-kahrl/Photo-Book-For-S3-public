import React, { Component } from 'react';

class DevError extends Component {
  render() {
    return (
      <div style={{ padding: '20px', margin: '20px' }}>
        <h2>Error</h2>
        <p> You just broke something ! </p>
        <p> {this.props.error} </p>
      </div>
    );
  }
}

export default DevError;
