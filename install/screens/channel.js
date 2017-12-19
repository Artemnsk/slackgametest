"use strict";

const stdout = process.stdout;
const inquirer = require('inquirer');
const getChannel = require('../../models/channel/channels').getChannel;
const helpers = require('../helpers');

const CHANNEL_EDIT = 'Edit';
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
  getChannel(args.team.$key, args.channelKey)
    .then((channel) => {
      clearInterval(loadingScreen);
      helpers.clearConsole();
      stdout.write('CHANNEL INFO\n');
      stdout.write('$key: ' + channel.$key + '\n');
      stdout.write('name: ' + channel.name + '\n');
      stdout.write('timeStep: ' + channel.timeStep + '\n');
      stdout.write('breakTime: ' + channel.breakTime + '\n');
      stdout.write(`nextGame: ${channel.nextGame} [${new Date(channel.nextGame)}]\n`);
      stdout.write('active: ' + (channel.active === true ? 'true' : 'false') + '\n');
      inquirer.prompt([
        {
          type: 'list',
          name: 'option',
          message: helpers.separator,
          // TODO:
          choices: [/*CHANNEL_EDIT,*/ CHANNEL_BACK]
        }
      ]).then((/** {option: string} */ answers) => {
        helpers.clearConsole();
        switch(answers.option) {
          case CHANNEL_EDIT:
            // TODO:
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