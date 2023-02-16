import React, { Component } from 'react';

class UploadPanel extends Component {
  render() {
    let uploads = (this.props.appData.events &&  this.props.appData.events.upload) ? 
      this.props.appData.events.upload : 
      []
    let content = uploads
      .filter(event => event.status !== 'completed')
      .map(event => {
        let eventKey = event.status + event.fileName;
        return (
          <div
            key={eventKey}
            style={{
              fontSize: '8pt',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{event.fileName} </div>
            {event.status === 'started' && <div>Upload In Progress</div>}

            {event.status === 'failed' && (
              <div style={{ color: 'red' }}>
                Upload Failed
              </div>
            )}
          </div>
        );
      });

    return (
      <div
        id="uploadStatus"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '55px' }}
      >
        <div style={{ fontSize: '9pt' }} />
        {content}
      </div>
    );
  }
}

export default UploadPanel;
