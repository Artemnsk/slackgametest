"use strict";

const stdout = process.stdout;
const inquirer = require('inquirer');
const Channel = require('../../models/channel/channel').Channel;
const CHANNEL_PHASES = require('../../models/channel/channel').CHANNEL_PHASES;
const helpers = require('../helpers');

const CHANNEL_START_GAME = 'Start Game';
const CHANNEL_OVER_GAME = 'Over Game';
const CHANNEL_BACK = 'Back';

const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_BACK = 'Back';

module.exports = channelRoute;

/**
 * @typedef {Function} ChannelRoute
 * @param {{team: Team, channelKey: string}} args
 * @param {InstallationRouter} router
 */
function channelRoute(args, router) {
  var loadingScreen = helpers.loadingScreen();
  Channel.getChannel(args.team.$key, args.channelKey)
    .then((channel) => {
      clearInterval(loadingScreen);
      helpers.clearConsole();
      stdout.write('CHANNEL INFO\n');
      stdout.write(`$key: ${channel.$key}\n`);
      stdout.write(`name: ${channel.name}\n`);
      stdout.write(`phase: "${channel.phase}"\n`);
      stdout.write(`timeStep: ${channel.timeStep}\n`);
      stdout.write(`breakTime: ${channel.breakTime}\n`);
      stdout.write(`nextGame: ${channel.nextGame ? channel.nextGame : 'NOT SET'} ${channel.nextGame? `[${new Date(channel.nextGame)}]` : ''}\n`);
      stdout.write(`currentGame: [${channel.currentGame ? channel.currentGame : 'NOT SET'}]\n`);
      stdout.write(`active: ${(channel.active === true ? 'true' : 'false')}\n`);
      // TODO: show details of current game if exists.
      inquirer.prompt([
        {
          type: 'list',
          name: 'option',
          message: helpers.separator,
          // TODO:
          choices: [{
            name: CHANNEL_START_GAME,
            disabled: channel.phase !== CHANNEL_PHASES.BREAK ? `Disabled: phase is not "${CHANNEL_PHASES.BREAK}"` : false
          }, {
            name: CHANNEL_OVER_GAME,
            disabled: channel.phase !== CHANNEL_PHASES.IN_GAME ? `Disabled: phase is not "${CHANNEL_PHASES.IN_GAME}"` : false
          }, CHANNEL_BACK]
        }
      ]).then((/** {option: string} */ answers) => {
        helpers.clearConsole();
        switch(answers.option) {
          case CHANNEL_OVER_GAME:
            router.channelOverGameRoute({ team: args.team, channel }, router);
            break;
          case CHANNEL_START_GAME:
            router.channelStartGameRoute({ team: args.team, channel }, router);
            break;
          case CHANNEL_BACK:
            router.channelsRoute({ team: args.team }, router);
            break;
          default:
            process.exit(1);
            break;
        }
      });
    }, (error) => {
      clearInterval(loadingScreen);
      _errorCallback(error.message, args, router);
    });
}

/**
 *
 * @param {string} message
 * @param {{team: Team, channelKey: string}} args
 * @param {InstallationRouter} router
 */
function _errorCallback(message, args, router) {
  helpers.clearConsole();
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: "Error occurred: " + message,
      choices: [ERROR_TRY_AGAIN, ERROR_BACK]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case ERROR_TRY_AGAIN:
        router.channelRoute(args, router);
        break;
      case ERROR_BACK:
        router.channelsRoute({ team: args.team }, router);
        break;
    }
  });
}