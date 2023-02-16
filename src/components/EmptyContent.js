import React, { Component } from 'react';
import AddIcon from 'material-ui/svg-icons/content/add';
import LoadingIndicator from './LoadingIndicator';

class EmptyContent extends Component {
  render() {
    let startedEvents = this.props.appData.events.upload.filter(
      event => event.status === 'started'
    );
    const lastUpload =
      startedEvents.length > 0 ? startedEvents[startedEvents.length - 1] : null;
    let content = [];
    if (this.props.appData.isAdmin) {
      if (lastUpload) {
        let contentKey = `uploadInProgress${lastUpload.name}`;
        content.push(
          <div key={contentKey}>
            <h4>Your image {lastUpload.fileName} is being uploaded</h4>
            <LoadingIndicator />
          </div>
        );
      } else {
        content.push(
          <p key="emptyContent" style={{ fontSize: '18pt', textAlign: 'left' }}>
            You can add new photos to the site by using the 'Add'{' '}
            <AddIcon /> button in the App Bar at the top of the page.
          </p>
        );
      }
    }

    return (
        <div
          id="emptyContent"
          style={{ padding: '20px', margin: '20px', textAlign: 'center' }}
        >
          <h2>There are no photos to display </h2>
          {content}
        </div>
    );
  }
}

export default EmptyContent;
