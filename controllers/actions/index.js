"use strict";

const express = require('express');
const router = express.Router();
const uiRouter = require('../../models/ui/uirouter/uirouter');
const setGameData = require('../../middlewares/slackactions').setGameData;
const request = require('request');

router.post('/actions', setGameData, (/** SlackActionRequest */ req, res) => {
  const uiMessage = uiRouter(req.slackData.parsedPayload.callback_id, req.slackData.parsedPayload);
  if (uiMessage !== null) {
    res.status(200).send('');
    let sendParameters = {
      response_type: 'ephemeral'
    };
    uiMessage.setSendParameters(sendParameters);
    request(req.slackData.parsedPayload.response_url, {
      uri: req.slackData.parsedPayload.response_url,
      method: 'POST',
      json: uiMessage.toJSON(),
      headers: {
        'Content-type': 'application/json'
      },
    });
  } else {
    // TODO: Try to perform other actions.
    res.status(500).send('');
  }
});

module.exports = router;