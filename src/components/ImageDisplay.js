import React, { Component } from 'react';
import Img from 'react-image';
import LoadingIndicator from './LoadingIndicator';
import ImageHeader from './ImageHeader';

class ImageDisplay extends Component {
  render() {
    const transform = this.props.appData.currentImage ? `rotate(${this.props.appData.currentImage.rotate}deg)` : ''
    const isSmartPhone = this.props.appData.isSmartPhone
    const imageStyle = isSmartPhone
      ? { maxWidth: '400px' , transform: transform, zIndex: -1 }
      : { maxWidth: '800px', maxHeight: '800px' , transform: transform, zIndex: -1};
    return (
      <div
        id="imageDisplay"
        style={{
          margin: '5px',
          padding: '5px',
          width: '100%',
          flexBasis: '70%',
        }}
      >
        {this.props.appData.currentImage && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <ImageHeader {...this.props} />
            <Img
              style={imageStyle}
              src={this.props.appData.currentImage.url}
              alt={this.props.appData.currentImage.name}
              loader={
                <div style={{ flexGrow: 2, flexBasis: '70%' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexFlow: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <LoadingIndicator />
                  </div>
                </div>
              }
            />

            { (this.props.appData.currentImage.comment && this.props.appData.currentImage.comment.text) &&
              <div id="imageComment" style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div>
                    {this.props.appData.currentImage.comment.text}
                  </div>
                  </div>
              </div>
            }

          </div>
        )}
        {!this.props.appData.currentImage && (
          <div>
            <h2>There is no image to display</h2>
          </div>
        )}
      </div>
    );
  }
}

export default ImageDisplay;
