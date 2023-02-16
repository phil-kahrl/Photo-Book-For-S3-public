import React, { Component } from 'react';
import CopyIcon from '@material-ui/icons/ContentCopy';
import Button from '@material-ui/core/Button';

export default class About extends Component {

    copyPublicLink = () => {
        const element = document.getElementById('publicLink');
        element.focus()
        element.select()
        document.execCommand('copy')
    }

    handleClose = () => {
        window.close()
    }

    render() {
        return(
            <div>
                <h3 style={{textAlign: 'center', padding: '10px', margin: '10px'}}>About This App</h3>
                <div style={{padding: '20px', margin: '20px'}}>
                    <div id="publicLinkSection"
                        style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        padding: '10px',
                        margin: '10px'
                      }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ paddingRight: '5px' }}>
                            Public Link
                        </strong>
                        <div>
                            Send this link to anyone who you want to view photos
                        </div>
                        <input onClick={this.copyPublicLink} readOnly={true} id="publicLink" value={this.props.appData.publicUrl} />
                        <a href={this.props.appData.publicUrl} target="_blank">
                            {this.props.appData.publicUrl}
                        </a>
                        <div style={{cursor: 'pointer'}} onClick={this.copyPublicLink} ><CopyIcon /> Copy Public Link </div>
                        </div>
                    </div>
                    <div id="buildIdSection" style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '10px',
                        padding: '10px'

                    }}>
                        <strong>Build Id: {'  '} </strong>
                        <div> {this.props.appData.buildId}</div>
                    </div>
                </div>
                <div style={{padding: '10px', margin: '10px'}}>
                    <Button onClick={this.handleClose}>Close</Button>
                </div>
            </div>
        )
    }

}