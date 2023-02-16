import arccore from 'arccore';
import React from 'react';
import ImageList from '../components/ImageList';
import ImageListFilterSpec from '../filter-specs/AppDataFilterSpec';

const factoryResponse = arccore.filter.create({
  operationID: 'n6yvuO8fQyyNynWpZqmpog',
  operationName: 'Image List Rendering Filter',
  operationDescription: 'Renders the Image List',
  inputFilterSpec: ImageListFilterSpec,
  bodyFunction: function(request_) {
    return { result: <ImageList appData={request_} />, error: null };
  },
  outputFilterSpec: { ____opaque: true }
});

if (factoryResponse.error) throw new Error(factoryResponse.error);

export default factoryResponse.result;
