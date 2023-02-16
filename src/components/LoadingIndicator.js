import React, { Component } from 'react';
import './LoadingIndicator.css';

const outerStyle = {
  display: 'flex',
  flex: '0 1 auto',
  flexDirection: 'column',
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: '100%',
  height: '200px',
  maxWidth: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
};

const innerStyle = {
  backgroundImage: "url('/weblum-864.png')",
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '100%',
  height: '200px',
  animation: 'spin 3s 0s infinite',
  animationTimingFunction: 'linear',
  animationFillMode: 'both',
  display: 'inline-block'
};

class LoadingIndicator extends Component {
  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={outerStyle}>
            <div style={innerStyle} />
            <div>Loading</div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;
