import arccore from 'arccore';
import React from 'react';
import ImageDisplay from '../components/ImageDisplay';
import ImageDisplayFilterSpec from '../filter-specs/AppDataFilterSpec';

const factoryResponse = arccore.filter.create({
  operationID: 'Z5Yu3ejQQHKyAKLzecyGbA',
  operationName: 'Image Display Rendering Filter',
  operationDescription: 'Renders the image display component',
  inputFilterSpec: ImageDisplayFilterSpec,
  bodyFunction: function(request_) {
    return { result: <ImageDisplay appData={request_} />, error: null };
  },
  outputFilterSpec: { ____opaque: true }
});

if (factoryResponse.error) throw new Error(factoryResponse.error);

export default factoryResponse.result;
