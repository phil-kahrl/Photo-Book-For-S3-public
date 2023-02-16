# Photo-Book-For-S3

This repository contains the code for a Single Page Web Application (SPWA) for sharing photos and text content.  A built and hosted version of this application can be purchased at: [https://weblum.photos/](https://weblum.photos/).  Developers can build their own version of the application by following the instructions contained in this README.md

## Project Status

This repo is currently being offered for free under an MIT license.  This application was originally written
on top of the "create-react" toolchain and the beta version of the material-ui React library.  I am no longer actively maintaining this repo, instead I am working on a new version of the application using a new JavaScript developer toolchain.

## Instructions

To run locally:

Set the environment variables described below

`npm install`
`npm start`

To build deploy a new template to s3

`./build-and-deploy.sh`

### Environment variables for build

#### REACT_APP_WEBSITE_HEAD_TITLE

The title of the website that will appear in the tab.

#### REACT_APP_AWS_REGION

The AWS region of your S3 bucket 'us-east-1', 'us-west-2' etc.

#### REACT_APP_S3_BUCKET

The name of your S-3 bucket.

#### REACT_APP_S3_PREFIX

The name of the folder from step #2 above.

#### REACT_APP_SERVER_ROOT

The root url of the static website hosted by S-3

#### REACT_APP_APP_TITLE

The title of the application to display in the title bar.

#### REACT_APP_FOOTER_CONTENT_HTML

HTML to put in the footer of the page.

## Dependencies and Acknowledgements

Build scripts and web pack from 'create-react-app':  https://github.com/facebook/create-react-app

UI elements implemented using react material-UI: http://www.material-ui.com/#/

Helping with data integrity and regression prevention: The encapsule.io Filter library:  https://encapsule.io/docs/ARCcore/filter






