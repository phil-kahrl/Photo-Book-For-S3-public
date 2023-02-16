import React, { Component } from 'react';

class LoadingError extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          height: '200px',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'red',
          fontSize: '18pt'
        }}
      >
        <div>An error occurred while loading content </div>
      </div>
    );
  }
}

export default LoadingError;
