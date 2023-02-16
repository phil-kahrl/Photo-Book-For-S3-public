import React, { Component } from 'react';
import ImageListRenderingFilter from '../filters/ImageListRenderingFilter';
import ImageDisplayRenderingFilter from '../filters/ImageDisplayRenderingFilter';
import DevError from './DevError';

class DesktopContent extends Component {
  render() {
    const imageListRenderResponse = ImageListRenderingFilter.request(
      this.props.appData
    );
    const renderedImageList = imageListRenderResponse.error ? (
      <DevError error={imageListRenderResponse.error} />
    ) : (
      imageListRenderResponse.result
    );
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
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {renderedImageList}
          {renderedImageDisplay}
        </div>
      </div>
    );
  }
}

export default DesktopContent;
