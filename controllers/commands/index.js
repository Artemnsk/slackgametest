"use strict";

const express = require('express');
const router = express.Router();
const tokenVerification = require('../../middlewares/tokenverification');
const request = require('request');

const mainMenuFactory = require('../../models/ui/uimessage/factory/mainmenufactory');

// const userRegexp = /<@[0-9A-Z]+(\|.+)?>/i;
// const commandRegexp = /^('|")([^'^"]*)(?:\1)\s(.*)$/i;

router.use('/commands', tokenVerification);

router.post('/commands', function (req, res) {
  var text = req.body.text;
  if (text === 'menu' || !text) {
    res.status(200).send('');
    const mainMenuUIMessage = mainMenuFactory(20, 30, 123);
    let sendParameters = {
      response_type: 'ephemeral'
    };
    mainMenuUIMessage.setSendParameters(sendParameters);
    request(req.body.response_url, {
      uri: req.body.response_url,
      method: 'POST',
      json: mainMenuUIMessage.toJSON(),
      headers: {
        'Content-type': 'application/json'
      },
    });
  } else {
    res.status(500).send('Error');
  }
});

module.exports = router;