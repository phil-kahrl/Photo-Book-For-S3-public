const arccore = require('arccore');
const adsFilter = require('../filter-specs/AppDataFilterSpec');

const factoryResponse = arccore.filter.create({
  operationID: 'Iv9DEoPrQAusFYDAxpaTWQ',
  operationName: 'AppDataStore Filter',
  operationDescription: 'Constructs the ads',
  inputFilterSpec: adsFilter,

  bodyFunction: function(request_) {
    return { result: request_, error: null };
  },
  outputFilterSpec: adsFilter
});

if (factoryResponse.error) throw new Error(factoryResponse.error);

export default factoryResponse.result;
