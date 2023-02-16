import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import CommentIcon from '@material-ui/icons/Comment';
import RotateIcon from '@material-ui/icons/Rotate90DegreesCcw';
import UploadPanel from './UploadPanel';

class Banner extends Component {
  constructor(props) {
    super(props);
    const renameImageName = props.currentImage ? props.currentImage.name : ''
    this.state = {
      openAddImage: false,
      openDeleteImage: false,
      openRenameImage: false,
      openSettings: false,
      uploadImageName: '',
      uploadImageExists: false,
      overwriteExistingImage: false,
      fileInputValue: '',
      renameImageName,
      uploadButtonActive: true,
      openCommentDialog: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const appTitle = ('undefined' === (typeof prevState.appTitle) || prevState.appTitle === null )  ? nextProps.appData.appTitle : prevState.appTitle
    const pageTitle = ('undefined' === (typeof prevState.pageTitle) || prevState.pageTitle === null )  ? nextProps.appData.pageTitle : prevState.pageTitle
    const newState = {
      pageTitle: pageTitle,
      appTitle: appTitle
    }
    return newState
  }

  /**
     Functions for uploading new images
  **/

  //onClose handler for the dialog
  handleCloseAddImage = () => {
    this.setState({
      openAddImage: false
    });
  };

  handleOpenAddImage = event => {
    this.setState({uploadButtonActive: true})
    let origName = event.target.value;
    let name = '';
    if (origName) {
      name = origName.substring(
        origName.lastIndexOf('\\') + 1,
        origName.length
      );
    }
    this.setState({
      uploadImageName: name,
      openAddImage: true,
      fileInputValue: origName
    });
  };

  handleUploadImage = event => {
    event.preventDefault();
    this.setState({uploadButtonActive: false})
    const file = this.uploadInput.files[0];
    if (file) {
      this.props.appData
        .getImage(this.state.uploadImageName)
        .then(data => {
          this.setState({ uploadImageExists: true, uploadButtonActive: true });
          if (this.state.overwriteExistingImage) {
            this.props.appData.uploadImage(file, this.state.uploadImageName);
            this.setState({
              openAddImage: false,
              overwriteExistingImage: false,
              uploadImageExists: false
            });
          }
        })
        .catch(() => {
          this.props.appData.uploadImage(file, this.state.uploadImageName);
          this.setState({ openAddImage: false });
        });
    }
  };

  //onchange handler for the image name text input.
  updateNewImageName = event => {
    event.preventDefault();
    this.setState({uploadButtonActive: true})
    this.setState({ uploadImageName: event.target.value });
  };

  handleOverwriteImageChange = event => {
    this.setState({ overwriteExistingImage: true });
  };
  /** END OF NEW IMAGE FUNCTIONS 

  **/

  /**
    FUNCTIONS FOR RENAMING IMAGES
  **/

  handleOpenRenameImage = () => {
    this.setState({
      openRenameImage: true,
      renameImageName: this.props.appData.currentImage.name
    });
  };

  handleRenameImage = () => {
    this.props.appData.renameImage(this.state.renameImageName);
    this.handleCloseRenameImage();
  };

  handleCloseRenameImage = () => {
    this.setState({ openRenameImage: false, openAddImage: false });
  };

  updateRenameImageName = event => {
    this.setState({ renameImageName: event.target.value, openAddImage: false });
  };

  /**
   END OF RENAME FUNCTIONS
  **/

  /**
    FUNCTIONS FOR DELETING IMAGES
  **/
  handleOpenDeleteImage = () => {
    this.setState({ openDeleteImage: true });
  };

  handleCloseDeleteImage = () => {
    this.setState({ openDeleteImage: false });
  };

  deleteImage = () => {
    this.props.appData.deleteImage();
    this.setState({ openDeleteImage: false });
  };

  /**
    END OF DELETE IMAGE FUNCTIONS.
  **/

  /**
    Settings editing functions
  **/

  handleOpenSettings = () => {
    this.setState({ openSettings: true });
  };

  handleCloseSettings = () => {
    this.setState({
      openSettings: false,
    });
  };

  handleSaveSettings = event => {
    event.preventDefault();
    this.props.appData.updateSettings({
      appTitle: this.state.appTitle,
      pageTitle: this.state.pageTitle
    }).then( () => {
      this.setState({appTitle: null, pageTitle: null})
      this.handleCloseSettings()
    }).catch( (err) => {
      console.log('error updating settings')
      console.log(err)
      this.handleCloseSettings()
    })
  };

  updatePageTitle = event => {
    this.setState({ pageTitle: event.target.value });
  };

  updateAppTitle = event => {
    this.setState({ appTitle: event.target.value });
  };

  /**
    Comment dialog
  **/

  openCommentDialog = () => {
    const comment = (this.props.appData.currentImage.comment && this.props.appData.currentImage.comment.text) ?
    this.props.appData.currentImage.comment.text : ''
    this.setState({
      openCommentDialog: true, 
      comment: comment
    })
  }

  handleCloseCommentDialog = () => {
    this.setState({openCommentDialog: false})
  }

  writeComment = () => {
    this.props.appData.addComment(this.state.comment)
    this.setState({openCommentDialog: false})
  }

  handleCommentChange = (event) => {
    this.setState({comment: event.target.value})
  }

  /**
    Rotate image dialog
  **/

  handleRotateImageClick = () => {
    console.log('rotate image')
    this.props.appData.rotateImage()
  }

  /**
    End of settings functions.    
  **/

  render() {
    const titleStyle = {fontSize: '14pt'}
    const dialogBodyStyle = {padding: '10px'}

    return (
        <div>
          <Dialog
            open={this.state.openAddImage}
            onClose={this.handleCloseAddImage}
          >
            <div style={dialogBodyStyle}>
              <div style={titleStyle} id="upload-dialog-title">Upload Image</div>
              <div id="photoUpload">
                <form
                  onSubmit={this.handleUploadImage}
                  id="uploadImage"
                  name="uploadImage"
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                      ref={ref => {
                        this.uploadInput = ref;
                      }}
                      type="file"
                      onChange={this.handleOpenAddImage}
                    />
                  </div>
                  {this.uploadInput && (
                    <div>
                      <label style={{ fontSize: '9pt', paddingRight: '5px' }}>
                        {' '}
                        Name for New Image{' '}
                      </label>
                      <input
                        type="text"
                        value={this.state.uploadImageName}
                        onChange={this.updateNewImageName}
                        style={{ width: '280px' }}
                      />
                      {this.state.uploadImageExists && (
                        <div style={{ display: 'flex' }}>
                          <input
                            type="checkbox"
                            value={this.state.overwriteExistingImage}
                            onChange={this.handleOverwriteImageChange}
                          />
                          <label style={{ fontSize: '9pt', paddingLeft: '5px' }}>
                            Overwrite existing image with same name
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </form>

                <div style={{ display: 'flex' }}>
                  {this.uploadInput && (
                    <button onClick={this.handleUploadImage} disabled={!this.state.uploadButtonActive} >Upload</button>
                  )}
                  <button onClick={this.handleCloseAddImage}>Cancel</button>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            open={this.state.openDeleteImage}
            onClose={this.handleCloseDeleteImage}
          >
            <div style={dialogBodyStyle}>
              <div style={titleStyle} id="delete-dialog-title">Delete Image</div>
              <div>
                <div id="photoDelete">
                  <p>
                    Are you sure you want to delete image:{' '}
                    {this.props.appData.currentImage
                      ? this.props.appData.currentImage.name
                      : ''}{' '}
                    ?
                  </p>
                  <Button onClick={this.deleteImage}>Yes</Button>
                  <Button onClick={this.handleCloseDeleteImage}>Close</Button>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            open={this.state.openRenameImage}
            onClose={this.handleCloseRenameImage}
          >
          <div style={dialogBodyStyle}>
            <div style={titleStyle} id="rename-dialog-title">Rename Image</div>
              <div>
                <div id="photoRename">
                  <input
                    type="text"
                    value={this.state.renameImageName}
                    onChange={this.updateRenameImageName}
                    style={{ width: '280px' }}
                  />
                  <div>
                    <Button onClick={this.handleRenameImage}>Rename</Button>
                    <Button onClick={this.handleCloseRenameImage}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openSettings}
            onClose={this.handleCloseSettings}
          >
            <div style={dialogBodyStyle}>
              <div style={titleStyle} id="settings-dialog-title">Settings</div>
              <div>
                <div
                  id="Settings"
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}
                  >
                    <label>Page title</label>
                    <input
                      type="text"
                      value={this.state.pageTitle}
                      onChange={this.updatePageTitle}
                      style={{ width: '280px' }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}
                  >
                    <label>App title</label>
                    <input
                      type="text"
                      value={this.state.appTitle}
                      onChange={this.updateAppTitle}
                      style={{ width: '280px' }}
                    />
                  </div>

                  <div style={{ display: 'flex' }}>
                    <Button onClick={this.handleSaveSettings}>Update</Button>
                    <Button onClick={this.handleCloseSettings}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog
            open={this.state.openCommentDialog}
            onClose={this.handleCloseCommentDialog}
          >
            <div style={dialogBodyStyle}>
              <div style={titleStyle} id="comments-dialog-title">
                <div>Edit Caption</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column'}}>
        
                <textarea autoFocus={true} onChange={this.handleCommentChange} value={this.state.comment ? this.state.comment : ''} >
                  {this.state.comment}
                </textarea>

                <div style={{display: 'flex'}}>
                  <Button onClick={this.writeComment}>
                    Save Caption
                  </Button>
                  <Button onClick={this.handleCloseCommentDialog}>Cancel</Button>
                </div>
              </div>
            </div>


          </Dialog>

          <AppBar
            position="static"
            color="default"
            style={{
              backgroundColor: '#dae4f1',
              color: 'black'
            }}
          >
            <Toolbar
              style={{
                fontSize: '24pt',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>{this.props.appData.appTitle}</div>
                <div
                  style={{
                    fontSize: '12pt',
                    paddingLeft: '20px',
                    fontFace: 'courier'
                  }}
                >
                </div>
              </div>
              {this.props.appData.isAdmin && (
                <div id='adminLinks'
                  style={{
                    width: '100%',
                    paddng: '5px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div id="uploadAction"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer'
                      }}
                      onClick={this.handleOpenAddImage}
                    >
                      <AddIcon />
                      <label style={{ fontSize: '8pt' }}>Add</label>
                    </div>
                  
                    <div id="deleteAction"
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={this.handleOpenDeleteImage}
                    >
                      <DeleteIcon />
                      <label style={{ fontSize: '8pt' }}>Delete</label>
                    </div>

                    <div
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={this.handleOpenRenameImage}
                    >
                      <EditIcon />
                      <label style={{ fontSize: '8pt' }}>Rename</label>
                    </div>

                    <div id="commentsAction" 
                      onClick={this.openCommentDialog}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CommentIcon />
                      <label style={{ fontSize: '8pt' }}>
                        Caption
                      </label>
                    </div>
                    <div id="settingsAction"
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={this.handleOpenSettings}
                    >
                      <SettingsIcon />
                      <label style={{ fontSize: '8pt' }}>Settings</label>
                    </div>
                    <a id="aboutAction"
                      href='/#about'
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        color: '#000'
                      }}
                    >
                      <InfoIcon />
                      <label style={{ fontSize: '8pt' }}>About</label>
                    </a>

                    <UploadPanel {...this.props} />
                  </div>
              )}
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

Banner.propTypes = {
  title: PropTypes.string
};

export default Banner;
