"use strict";

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded());
router.use('/', require('./authorize'));
router.use('/', require('./commands'));
router.use('/', require('./actions'));

module.exports = router;