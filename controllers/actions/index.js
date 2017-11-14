"use strict";

const express = require('express');
const router = express.Router();
const uiRouter = require('../../models/ui/uirouter/uirouter');
const request = require('request');

router.post('/actions', function(req, res) {
    const payload = req.body.payload;
    if (payload) {
        const data = JSON.parse(payload);
        const uiMessage = uiRouter(data.callback_id, data);
        if (uiMessage !== null) {
            res.status(200).send('');
            let sendParameters = {
                response_type: 'ephemeral'
            };
            uiMessage.setSendParameters(sendParameters);
            request(data.response_url, {
                uri: data.response_url,
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
    } else {
        res.status(500).send('');
    }
});

module.exports = router;