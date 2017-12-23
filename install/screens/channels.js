"use strict";

const inquirer = require('inquirer');
const Channel = require('../../models/channel/channel').Channel;
const helpers = require('../helpers');

const LIST_BACK = 'Back';
const NEW_CHANNEL = 'Create new channel';

const ERROR_TRY_AGAIN = 'Try again';
const ERROR_BACK = 'Back';

module.exports = channelsRoute;

/**
 * @typedef {Function} ChannelsRoute
 * @param {{team: Team}} args
 * @param {InstallationRouter} router
 */
function channelsRoute(args, router) {
  var loadingScreen = helpers.loadingScreen();
  Channel.getChannels(args.team.$key, true)
    .then((channels) => {
      clearInterval(loadingScreen);
      helpers.clearConsole();
      var channelOptions = [];
      if (channels.length === 0) {
        channelOptions.push({
          name: 'This team has no active channels with game run.',
          disabled: 'Create new game channel using option below'
        });
      } else {
        channels.map((channel) => {
          channelOptions.push(channel.name + ' [' + channel.$key + '] ' + (channel.active ? 'ACTIVE' : 'NON-ACTIVE'));
        });
      }
      channelOptions.push(new inquirer.Separator());
      channelOptions.push(NEW_CHANNEL);
      channelOptions.push(LIST_BACK);
      inquirer.prompt([
        {
          type: 'list',
          name: 'channel',
          message: args.team.name + ' team channels:',
          choices: channelOptions
        }
      ]).then((/** {channel: string} */ answers) => {
        helpers.clearConsole();
        switch(answers.channel) {
          case NEW_CHANNEL:
            router.channelCreateRoute(args, router);
            break;
          case LIST_BACK:
            router.teamRoute({ teamKey: args.team.$key }, router);
            break;
          default:
            // We suppose some channel being chosen.
            let channelAnswerRegExp = /^.*\[(.*)\].*$/;
            if (!channelAnswerRegExp.test(answers.channel)) {
              _errorCallback('Invalid option chosen.', args, router);
            } else {
              let channelKey = answers.channel.replace(channelAnswerRegExp, '$1');
              // Load channel screen.
              router.channelRoute({ team: args.team, channelKey }, router);
            }
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
 * @param {{team: Team}} args
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
        router.channelsRoute(args, router);
        break;
      case ERROR_BACK:
        router.teamRoute({ teamKey: args.team.$key }, router);
        break;
    }
  });
}