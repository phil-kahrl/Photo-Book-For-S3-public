import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {checkAdmin, buildCredentialsHash} from './lib/credentials-utils';

import {
  listBucket,
  deleteObject,
  copyObject,
  uploadToS3,
  getObject
} from './lib/s3Util';
import adsConstructor from './filters/AppDataStoreConstructor';
import isSmartPhone from './lib/mediaQuery';
import DevError from './components/DevError';

const awsRegion = process.env.REACT_APP_AWS_REGION;
const s3Bucket = process.env.REACT_APP_S3_BUCKET;
const s3Prefix = process.env.REACT_APP_S3_PREFIX;
const serverRoot = process.env.REACT_APP_SERVER_ROOT;
const footerContent = process.env.REACT_APP_FOOTER_CONTENT_HTML;

let buildId = process.env.REACT_APP_BUILD_ID;

let appData = {}; //container for the app data store.

//returns a Promise that resolves to the settings for the web app.
const getSettings = () => {
  return new Promise((resolve, reject) => {
    fetch(serverRoot + '/admin/settings.json', {cache: 'reload'})
      .then(response => {
        response
          .json()
          .then(content => {
            resolve(content);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const handlePreviousImage = event => {
  if(appData.currentImage.index === 0) {
    return
  } else {
    handleImageLinkClick(appData.imageList[appData.currentImage.index - 1])
  }
};

const handleNextImage = event => {
    if(appData.currentImage.index === (appData.imageList.length - 1) ) {
      return
    } else {
      handleImageLinkClick(appData.imageList[appData.currentImage.index + 1])
    }
};

const getCommentForImage_ = () => {
  return new Promise( (resolve, reject) => {
    if (appData.currentImage) {
      getObject(awsRegion, s3Bucket, 'comments/', appData.currentImage.etag).then( (data) => {
        const comment = {text: data.Body.toString(), lastModified: data.LastModified.getTime() }
        appData.currentImage.comment = comment
        render()
        resolve(comment)
      }).catch( (err) => {
        render()
      })
    } else {
      resolve()
    }
  })
}

const getRotationForImage_ = () => {
  return new Promise( (resolve, reject) => {
    if (appData.currentImage) {
      getObject(awsRegion, s3Bucket, 'styles/', appData.currentImage.etag).then( (data) => {
        let retrieved = JSON.parse(data.Body.toString())
        appData.currentImage.rotate = retrieved.rotate
        render()
        resolve(retrieved)
      }).catch( (err) => {
        render()
      })
    } else {
      resolve()
    }
  })
}

const handleImageLinkClick = value => {
  if(value && value.url) {
    appData.visited.push(value.url)
    appData.currentImage = value;
    render()
    getCommentForImage_(value.etag)
    getRotationForImage_(value.etag)
  }
};

const render = () => {
  appData.isSmartPhone = isSmartPhone(render);
  ReactDOM.render(<App appData={appData} />, document.getElementById('root'));
};

const renderError = error => {
  ReactDOM.render(<DevError error={error} />, document.getElementById('root'));
};

const loadImageList = () => {
  //TODO should this be calling handleImageLinkClick at all?
  listBucket(awsRegion, s3Bucket, s3Prefix, serverRoot)
    .then(imageList => {
      appData.imageList = imageList;
      appData.state = imageList.length > 0 ? 'INITIALIZED' : 'EMPTY';
      const current = appData.currentImage
        ? appData.currentImage
        : imageList[0];
      if (current) {
        handleImageLinkClick(current);
      }
      render();
    })
    .catch(err => {
      console.log('Error while listing bucket');
      console.log(err);
      appData.state = 'ERROR';
      render();
    });
};

const deleteImage = () => {
  const key = s3Prefix + appData.currentImage.name;
  if(appData.currentImage.index === 0) handleNextImage()
  else                                 handlePreviousImage()
  deleteObject(awsRegion, s3Bucket, key)
    .then(() => {
      if(appData.imageList.length === 1) delete appData.currentImage
      loadImageList();

    })
    .catch(err => {
      console.log('Error deleting object');
      console.log(err);
      render();
    });
};

const addComment = (text) => {
    uploadToS3(awsRegion, s3Bucket, 'comments/', text, appData.currentImage.etag).then( (data) => {
      handleImageLinkClick(appData.currentImage)
    }).catch( (err) => {
      console.log(err)
    })
}

const uploadImage = (file, name) => {
  //s3 does not like spaces at the end of image keys.
  name = name.trim()
  appData.events.upload = appData.events.upload.filter(event => {
    return event.status !== 'failed';
  });
  appData.events.upload.push({ status: 'started', fileName: name });
  render();
  uploadToS3(awsRegion, s3Bucket, s3Prefix, file, name)
    .then(() => {
      loadImageList();
      if(appData.currentImage) appData.currentImage.index++
      appData.events.upload.forEach(event => {
        if (event.fileName === name) event.status = 'completed';
      });
      render();
    })
    .catch(err => {
      appData.events.upload.forEach(event => {
        if (event.fileName === name) event.status = 'failed';
      });
      render();
      console.log(err);
    });
  return name;
};

const renameImage = newName => {
  //s3 does not like spaces at the end of image keys.
  newName = newName.trim()
  copyObject(
    awsRegion,
    s3Bucket,
    `${s3Prefix}${appData.currentImage.name}`,
    `${s3Prefix}${newName}`
  )
    .then(() => {
      deleteObject(
        awsRegion,
        s3Bucket,
        `${s3Prefix}${appData.currentImage.name}`
      )
        .then(() => {
          appData.currentImage.name = newName;
          appData.currentImage.url =
            appData.serverRoot + '/' + s3Prefix + newName;
          appData.currentImage.index = 0;
          loadImageList();
        })
        .catch(err => {
          console.log(err);
          render();
        });
    })
    .catch(err => {
      console.log(err);
      render();
    });
};

/** 
returns a Promise for an s3.getObject call for the image name
**/
const getImage = imageName => {
  return getObject(awsRegion, s3Bucket, s3Prefix, imageName);
};

/**

Input Spec:
   appTitle: <String>
   pageTitle: <String>
**/
const updateSettings = request_ => {
  return new Promise( (resolve, reject) => {
    uploadToS3(
      awsRegion,
      s3Bucket,
      '',
      JSON.stringify(request_),
      'admin/settings.json'
    ).then(() => {
      document.title = request_.pageTitle;
      appData.appTitle = request_.appTitle;
      appData.pageTitle = request_.pageTitle;
      render();
      resolve()
    }).catch(err => {
      reject(err)
      render();
      console.log(err);
    });
  })
};

const rotateImage = () => {
  let currentRotation = appData.currentImage.rotate ? appData.currentImage.rotate : 0
  const newRotation = currentRotation - 90
  appData.currentImage.rotate = newRotation
  let payload = JSON.stringify({rotate: newRotation})
  uploadToS3(awsRegion, s3Bucket, 'styles/', payload, appData.currentImage.etag).then( (data) => {
    handleImageLinkClick(appData.currentImage)
  }).catch( (err) => {
    console.log(err)
  })
  render()
}

getSettings().then(settings => {
  let adsRequest = {
    buildId,
    imageList: [],
    visited: [],
    footerHtml: footerContent,
    publicUrl: serverRoot,
    footerContent,
    clickHandler: handleImageLinkClick,
    handleNextImage,
    handlePreviousImage,
    loadImageList,
    deleteImage,
    renameImage,
    uploadImage,
    getImage,
    events: { upload: [] },
    serverRoot,
    updateSettings,
    appTitle: settings.appTitle,
    pageTitle: settings.pageTitle,
    addComment,
    rotateImage
  };
  document.title = settings.pageTitle;
  let factoryResponse = adsConstructor.request(adsRequest);
  if (factoryResponse.error) {
    console.log(factoryResponse.error);
    renderError(factoryResponse.error);
  } else {
    appData = factoryResponse.result;
    render();
    loadImageList();
  }
}).catch(err => {
  console.log(err);
  appData.state = 'ERROR';
  render();
});

checkAdmin().then(result => {
  appData.isAdmin = true;
  appData.secretUrl = appData.serverRoot + '/#' + buildCredentialsHash(result)
  render();
}).catch(err => {
  console.log(err);
  appData.isAdmin = false;
  render();
});

window.onhashchange = () => {
  checkAdmin().then(result => {
    appData.isAdmin = true;
    appData.secretUrl = appData.serverRoot + '/#' + buildCredentialsHash(result)
    render();
  }).catch(err => {
    console.log(err);
    appData.isAdmin = false;
    render();
  });
}
