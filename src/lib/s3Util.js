var AWS = require('aws-sdk');

const S3_VERSION = '2006-03-01';

/**
S3 Module

**/

//Initialize credentials globally
const credentials = new AWS.Credentials({
  accessKeyId: window.localStorage.getItem('accessKey'),
  secretAccessKey: window.localStorage.getItem('secretKey'),
  sessionToken: null
});
AWS.config.update({
  credentials: credentials
});

/**
Builds a sorted and filtered list of image objects from an S3 bucket listing (data.Contents)
**/
const processImageList_ = (inputList, serverRoot) => {
  //filter out folder name in the bucket
  inputList.filter(function(el) {
    if (el.Size === 0) return false;
    return true;
  });
  const result = inputList.map( (element, index) => {
    const img = {};
    img.name = element.Key.substring(
      element.Key.lastIndexOf('/') + 1,
      element.Key.length
    );
    img.url = serverRoot + '/' + element.Key;
    img.lastModified = element.LastModified.getTime()
    img.etag = element.ETag
    return img;
  });
  return result;
};

/**
List contents of a bucket with anonymous access,
returns a promise which resolves to a list of image objects.

Recursively calls itself until 'isTruncated' is false and returns a single result in resolve()
**/
const listBucket = function(
  region,
  bucketName,
  prefix,
  serverRoot,
  imageList,
  NextContinuationToken
) {
  return new Promise((resolve, reject) => {
    imageList = imageList ? imageList : [];
    const s3 = new AWS.S3({ apiVersion: S3_VERSION, region: region });

    const params = {
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: NextContinuationToken,
      StartAfter: prefix
    };

    const request = s3.listObjectsV2(params);
    request.removeListener(
      'validate',
      AWS.EventListeners.Core.VALIDATE_CREDENTIALS
    );
    request.removeListener('sign', AWS.EventListeners.Core.SIGN);
    request.send((err, data) => {
      if (err) reject(err);
      else {
        imageList = imageList.concat(processImageList_(data.Contents, serverRoot))
          .sort((a, b) => {
            return b.lastModified - a.lastModified;
        }).map( (image, index) => {
          image.index = index
          return image
        })
        if (data.IsTruncated) {
          listBucket(
            region,
            bucketName,
            prefix,
            serverRoot,
            imageList,
            data.NextContinuationToken
          )
            .then(list => {
              resolve(list);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve(imageList);
        }
      }
    });
  });
};

const copyObject = (region, bucketName, fromKey, toKey) => {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({ apiVersion: S3_VERSION, region: region });
    var params = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${fromKey}`,
      Key: `${toKey}`,
      ACL: 'public-read'
    };
    s3.copyObject(params, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const deleteObject = (region, bucketName, key) => {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3({ apiVersion: S3_VERSION, region: region });
    const params = {
      Bucket: bucketName,
      Key: key
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//Upload a file to S3 and return a Promise

const uploadToS3 = (region, bucketName, prefix, file, name) => {
  const s3 = new AWS.S3({ apiVersion: S3_VERSION, region: region });
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucketName,
        Key: `${prefix}${name}`,
        Body: file,
        ACL: 'public-read'
      },
      { partSize: 20 * 1024 * 1024, queueSize: 1 },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
};

const getObject = (region, bucketName, prefix, name) => {
  const s3 = new AWS.S3({ apiVersion: S3_VERSION, region: region });
  return new Promise((resolve, reject) => {
    const request = s3.getObject({
      Bucket: bucketName,
      Key: `${prefix}${name}`
    });
    request.removeListener(
      'validate',
      AWS.EventListeners.Core.VALIDATE_CREDENTIALS
    );
    request.removeListener('sign', AWS.EventListeners.Core.SIGN);
    request.send( (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
    })
  })
};

module.exports = {
  listBucket,
  uploadToS3,
  deleteObject,
  copyObject,
  getObject
};
