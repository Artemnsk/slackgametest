"use strict";

const teamsRoute = require('./screens/teams');
const teamRoute = require('./screens/team');
const teamEditRoute = require('./screens/teamedit');

/**
 * @typedef {Object} InstallationRouter
 * @property {TeamsRoute} teamsRoute
 * @property {TeamRoute} teamRoute
 * @property {TeamEditRoute} teamEditRoute
 * @type {InstallationRouter}
 */
module.exports = {
  teamsRoute,
  teamRoute,
  teamEditRoute
};