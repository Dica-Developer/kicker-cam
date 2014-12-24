'use strict';

var config = require('../config/environment'),
  path = require('path');

module.exports = {
  getQrCodeImagePath: function (cb) {
    var imagePath = '';

    if (config.env === 'test') {
      imagePath = path.join(config.root, '/server/components/qr/test-assets/qr-code-test.png');
      return cb(null, imagePath);
    } else {
      exec('mplayer http://192.168.178.50:8080/ -endpos 00:00:01 -vo png', function (error) {
        if (error !== null) {
          return cb(error);
        }
        imagePath = path.join(config.root, '/00000001.png');
        cb(null, imagePath);
      });
    }
  }
};

