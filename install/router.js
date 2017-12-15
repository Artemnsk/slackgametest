"use strict";

const teamsRoute = require('./screens/teams');
const teamRoute = require('./screens/team');
const teamEditRoute = require('./screens/teamedit');
const channelsRoute = require('./screens/channels');

/**
 * @typedef {Object} InstallationRouter
 * @property {TeamsRoute} teamsRoute
 * @property {TeamRoute} teamRoute
 * @property {TeamEditRoute} teamEditRoute
 * @property {ChannelsRoute} channelsRoute
 * @type {InstallationRouter}
 */
module.exports = {
  teamsRoute,
  teamRoute,
  teamEditRoute,
  channelsRoute
};