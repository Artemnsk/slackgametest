"use strict";

const teamsRoute = require('./screens/teams');
const teamRoute = require('./screens/team');
const teamEditRoute = require('./screens/teamedit');
const channelsRoute = require('./screens/channels');
const channelCreateRoute = require('./screens/channelcreate');
const channelRoute = require('./screens/channel');

/**
 * @typedef {Object} InstallationRouter
 * @property {TeamsRoute} teamsRoute
 * @property {TeamRoute} teamRoute
 * @property {TeamEditRoute} teamEditRoute
 * @property {ChannelsRoute} channelsRoute
 * @property {ChannelCreateRoute} channelCreateRoute
 * @property {ChannelRoute} channelRoute
 * @type {InstallationRouter}
 */
module.exports = {
  teamsRoute,
  teamRoute,
  teamEditRoute,
  channelsRoute,
  channelCreateRoute,
  channelRoute
};