#!/bin/bash

##  Builds and deploys the current version of the photo web app.
##  Runs npm build
##  Deploys to S-3
##  Release number will match tag on main.js
##  Uploads to AWS S3 using the default credentials at ~/.aws/credentials
##  Pushes the release number as a tag to the git repo.

export REACT_APP_AWS_REGION=____REACT_APP_AWS_REGION____
export REACT_APP_S3_BUCKET=____REACT_APP_S3_BUCKET____
export REACT_APP_SERVER_ROOT=____REACT_APP_SERVER_ROOT____
export REACT_APP_BUILD_ID=____REACT_APP_BUILD_ID____
export REACT_APP_S3_PREFIX=images/
export REACT_APP_FOOTER_CONTENT_HTML="Brought to you by Cathexis LLC"

npm run build

node copy-build-to-s3.js

chmod u+rx tagVersion.sh
source tagVersion.sh
rm tagVersion.sh