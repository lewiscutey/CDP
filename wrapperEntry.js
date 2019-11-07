const chromeLauncher = require('chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');

const prepareAPI = (config = {}) => {
  const {
    host = 'localhost', port = 9222, autoSelectChrome = true, headless = true
  } = config;
  const wrapperEntry = chromeLauncher.launch({
    host,
    port,
    autoSelectChrome,
    additionalFlags: [
      '--disable-gpu',
      headless ? '--headless' : ''
    ]
  }).then(chromeInstance => {
    const remoteInterface = chromeRemoteInterface(config).then(chromeAPI => chromeAPI).catch(err => {
      throw err;
    });
    return Promise.all([chromeInstance, remoteInterface])
  }).catch(err => {
    throw err
  });

  return wrapperEntry
};

module.exports = {
  prepareAPI
};