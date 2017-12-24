"use strict";

const inquirer = require('inquirer');
const helpers = require('../helpers');
const Channel = require('../../models/channel/channel').Channel;

const CHANNEL_START_GAME_OK = 'Start Game';
const CHANNEL_START_GAME_BACK = 'Back';

const ERROR_BACK = 'Back';

module.exports = ChannelStartGameRoute;

/**
 * @typedef {Function} ChannelStartGameRoute
 * @param {{team: Team, channel: Channel}} args
 * @param {InstallationRouter} router
 */
function ChannelStartGameRoute(args, router) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: `Start game in Channel ${args.channel.name}[${args.channel.$key}]?`,
      choices: [CHANNEL_START_GAME_OK, CHANNEL_START_GAME_BACK]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case CHANNEL_START_GAME_OK:
        helpers.clearConsole();
        var loadingScreen = helpers.loadingScreen();
        args.channel.startGame()
          .then(() => {
            clearInterval(loadingScreen);
            helpers.clearConsole();
            router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
          }, (err) => {
            clearInterval(loadingScreen);
            _errorCallback(err.message, args, router);
          });
        break;
      case CHANNEL_START_GAME_BACK:
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