import React, { Component } from 'react';
import FlatButton from '@material-ui/core/Button';

class ImageHeader extends Component {
  render() {
    const isSmartPhone = this.props.appData.isSmartPhone
    const headerStyle = isSmartPhone
      ? { width: '390px' }
      : {
          padding: '0px',
          width: '750px',
          display: 'flex',
          justifyContent: 'space-evenly'
        };
    const titleStyle = isSmartPhone
      ? {
          display: 'inline-block',
          fontSize: '12px',
          width: '200px',
          textAlign: 'center'
        }
      : {
          display: 'inline-block',
          fontSize: '24px',
          padding: '5px',
          verticalAlign: 'middle',
          width: '450px',
          textAlign: 'center'
        };

    return (
      <div id="imageHeader" style={headerStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly'
          }}
        >
          <div>
              <FlatButton
                onClick={this.props.appData.handlePreviousImage}
                //color="primary"
                title="Previous Picture"
                style={{ color: '#3f51b5' }}
              >
                {' << '}
              </FlatButton>

              <div style={titleStyle}>
                {this.props.appData.currentImage.name}
              </div>

              <FlatButton
                onClick={this.props.appData.handleNextImage}
                //color="primary"
                title="Next Picture"
                style={{ color: '#3f51b5' }}
              >
                {' >> '}
              </FlatButton>
            </div>
          </div>
      </div>
    );
  }
}

export default ImageHeader;
