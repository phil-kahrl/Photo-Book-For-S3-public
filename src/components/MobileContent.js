import React, { Component } from 'react';
import ImageDisplayRenderingFilter from '../filters/ImageDisplayRenderingFilter';
import ImageSelectList from './ImageSelectList';
import DevError from './DevError';

class MobileContent extends Component {
  render() {
    const imageDisplayRenderResponse = ImageDisplayRenderingFilter.request(
      this.props.appData
    );
    const renderedImageDisplay = imageDisplayRenderResponse.error ? (
      <DevError error={imageDisplayRenderResponse.error} />
    ) : (
      imageDisplayRenderResponse.result
    );

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px'
          }}
        >
          <ImageSelectList {...this.props} />
        </div>
        {renderedImageDisplay}
        <div style={{ display: 'flex', flexDirection: 'row' }} />
      </div>
    );
  }
}

export default MobileContent;
