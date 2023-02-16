const AWS = require('aws-sdk');
const Buffer = require('buffer').Buffer;
const S3_VERSION = '2006-03-01';
const paramKey = 'cxt=';

// returns credentials from the hash route if they exist, or null otherwise
// credentials are set from index.js
const getCredentialsFromHashRoute_ = () => {
  let hash = window.location.hash;

  if (!hash || hash.indexOf(paramKey) < 0) return;

  const token = hash.substring(
    hash.indexOf(paramKey) + paramKey.length,
    hash.length
  );
  if (!token) return;

  const json = Buffer.from(token, 'base64').toString();
  const creds = JSON.parse(json);

  const accessKey = creds.ak;
  const secretKey = creds.sk;

  if (!(accessKey && secretKey)) return;

  //Removing for now since it is confusing to the user to change the URL
  //clear the tokens after reading.
  //hash = hash.replace(paramKey + token, '');
  //window.location.hash = hash;

  return {
    accessKey: accessKey,
    secretKey: secretKey
  };
};

/*
Trys to access the s3 bucket for the app with the passed credentials

Returns a Promise which is resolved if the request succeeds or rejected otherwise
*/
const pingS3_ = creds_ => {
  return new Promise((resolve, reject) => {
    const credentials = new AWS.Credentials({
      accessKeyId: creds_.accessKey,
      secretAccessKey: creds_.secretKey,
      sessionToken: null
    });
    AWS.config.update({
      credentials: credentials
    });
    const s3 = new AWS.S3({
      apiVersion: S3_VERSION,
      region: process.env.REACT_APP_AWS_REGION
    });
    const bucketName = process.env.REACT_APP_S3_BUCKET;

    s3.listObjects(
      { Bucket: bucketName, Prefix: 'images/', MaxKeys: 1 },
      (err, data) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      }
    );
  });
};

/**

inputSpec:
   accessKey: <String>
   secretKey: <String>
**/

const buildCredentialsHash = (request_) => {
  const creds = {ak: request_.accessKey, sk: request_.secretKey}
  return paramKey + Buffer.from(JSON.stringify(creds)).toString('base64')

}

const getCredentialsFromLocalStorage_ = () => {
  const accessKey = window.localStorage.getItem('accessKey');
  const secretKey = window.localStorage.getItem('secretKey');
  if (accessKey && secretKey)
    return { accessKey: accessKey, secretKey: secretKey };
  else return;
};
/**
Function that checks to see if the user is able to edit the site either with the keys stored locally or passed in the hash route.
If the keys in the hash route are present and valid then they will be written to local storage.
**/
const checkAdmin = () => {
  return new Promise((resolve, reject) => {
    const hashRouteCredentials = getCredentialsFromHashRoute_();
    const localCredentials = getCredentialsFromLocalStorage_();

    if (hashRouteCredentials) {
      pingS3_(hashRouteCredentials)
        .then(() => {
          /**
          //TODO open an issue for whether to write to storage.ß

          window.localStorage.setItem(
            'accessKey',
            hashRouteCredentials.accessKey
          );
          window.localStorage.setItem(
            'secretKey',
            hashRouteCredentials.secretKey
          );
                    **/
          resolve(hashRouteCredentials);


        })
        .catch(err => {
          if (localCredentials) {
            pingS3_(localCredentials)
              .then(() => {
                resolve(localCredentials);
              })
              .catch(err => {
                reject();
              });
          } else {
            return reject();
          }
        });
    } else if (localCredentials) {
      pingS3_(localCredentials)
        .then(() => {
          resolve(localCredentials);
        })
        .catch(err => {
          reject(err);
        });
    } else {
      reject('No credentials found');
    }
  });
};

module.exports = {
  checkAdmin,
  buildCredentialsHash
}
