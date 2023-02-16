/** 

This is the main filter spec which serves as the data model for the application.
An object conforming to this spec will be passed down through all components through props.
Mutation objects constructed with this filter spec will occurr in a single place and should not be
done at the component level. 


**/

module.exports = {
  ____label: 'AppDataStore filter spec',
  ____description: 'Filter spec for props for app data',
  ____types: 'jsObject',
  buildId: {
    ____label: 'Build id',
    ____description:
      'The sha from git for the commit from which the template was built',
    ____accept: 'jsString',
    ____defaultValue: ''
  },
  state: {
    ____label: 'The current state of the app',
    ____accept: 'jsString',
    ____inValueSet: [
      'UNINITIALIZED',
      'EMPTY',
      'INITIALIZED',
      'WAITING',
      'ERROR'
    ],
    ____defaultValue: 'UNINITIALIZED'
  },
  events: {
    ____label: 'queue for async events waiting to complete',
    ____types: 'jsObject',
    upload: {
      ____label: 'events related to upload images',
      ____types: 'jsArray',
      uploadEvent: {
        ____types: 'jsObject',
        fileName: {
          ____accept: 'jsString'
        },
        status: {
          ____accept: 'jsString',
          ____inValueSet: ['started', 'completed', 'failed']
        }
      }
    }
  },
  isSmartPhone: {
    ____accept: 'jsBoolean',
    ____defaultValue: false
  },
  isAdmin: {
    ____accept: 'jsBoolean',
    ____defaultValue: false
  },
  appTitle: {
    ____accept: 'jsString',
  },
  pageTitle: {
    ____accept: 'jsString',
  },
  serverRoot: {
    ____accept: 'jsString'
  },
  publicUrl: {
    ____label: 'The public url to share for read-only access',
    ____accept: 'jsString'
  },
  secretUrl: {
    ____label: 'The secret Url to share with editors of the app',
    ____accept: ['jsString', 'jsUndefined']
  },
  imageList: {
    ____types: 'jsArray',
    ____defaultValue: [],
    element: {
      ____types: 'jsObject',
      url: {
        ____accept: 'jsString'
      },
      name: {
        ____accept: 'jsString'
      },
      lastModified: {
        ____label: 'Last modified time stamp for the image, epoch in milliseconds',
        ____accept: 'jsNumber'
      },
      etag: {
        ____accept: 'jsString'
      },
      index: {
        ____label: 'index of the image in the list',
        ____accept: 'jsNumber'
      }
    }
  },
  visited: {
    ____accept: 'jsArray',
    ____defaultValue: []
  },
  clickHandler: {
    ____accept: 'jsFunction'
  },
  currentImage: {
    ____types: ['jsObject', 'jsUndefined'],
    url: {
      ____types: ['jsString', 'jsUndefined']
    },
    name: {
      ____types: ['jsString', 'jsUndefined']
    },
    etag: {
      ____accept: 'jsString'
    },
    index: {
      ____accept: 'jsNumber'
    },
    comment: {
      ____types: ['jsObject','jsUndefined'],
      text: {
        ____accept: 'jsString'
      },
      lastModified: {
        ____label: 'last modified time as an epoch in millis',
        ____accept: 'jsNumber',
      }
    },
    rotate: {
      ____accept: 'jsNumber',
      ____defaultValue: 0

    }
  },
  footerHtml: {
    ____accept: ['jsString', 'jsUndefined']
  },
  handleNextImage: {
    ____accept: 'jsFunction'
  },
  handlePreviousImage: {
    ____accept: 'jsFunction'
  },
  loadImageList: {
    ____accept: 'jsFunction'
  },
  deleteImage: {
    ____accept: 'jsFunction'
  },
  renameImage: {
    ____accept: 'jsFunction'
  },
  getImage: {
    ____accept: 'jsFunction'
  },
  uploadImage: {
    ____accept: 'jsFunction'
  },
  updateSettings: {
    ____accept: 'jsFunction'
  },
  addComment: {
    ____accept: 'jsFunction'
  },
  rotateImage: {
    ____accept: 'jsFunction'
  }
};
