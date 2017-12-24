"use strict";

const inquirer = require('inquirer');
const helpers = require('../helpers');
const Channel = require('../../models/channel/channel').Channel;

const CHANNEL_OVER_GAME_OK = 'Over Game';
const CHANNEL_OVER_GAME_BACK = 'Back';

const ERROR_BACK = 'Back';

module.exports = ChannelOverGameRoute;

/**
 * @typedef {Function} ChannelOverGameRoute
 * @param {{team: Team, channel: Channel}} args
 * @param {InstallationRouter} router
 */
function ChannelOverGameRoute(args, router) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: `Over game in Channel ${args.channel.name}[${args.channel.$key}]?`,
      choices: [CHANNEL_OVER_GAME_OK, CHANNEL_OVER_GAME_BACK]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case CHANNEL_OVER_GAME_OK:
        helpers.clearConsole();
        var loadingScreen = helpers.loadingScreen();
        args.channel.overGame()
          .then(() => {
            clearInterval(loadingScreen);
            helpers.clearConsole();
            router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
          }, (err) => {
            clearInterval(loadingScreen);
            _errorCallback(err.message, args, router);
          });
        break;
      case CHANNEL_OVER_GAME_BACK:
        helpers.clearConsole();
        router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
        break;
      default:
        process.exit(1);
        break;
    }
  });
}

/**
 *
 * @param {string} message
 * @param {{team: Team, channel: Channel}} args
 * @param {InstallationRouter} router
 */
function _errorCallback(message, args, router) {
  helpers.clearConsole();
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: "Error occurred: " + message,
      choices: [ERROR_BACK]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case ERROR_BACK:
        helpers.clearConsole();
        router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
        break;
      default:
        process.exit(1);
        break;
    }
  });
}