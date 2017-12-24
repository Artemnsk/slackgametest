"use strict";

const inquirer = require('inquirer');
const helpers = require('../helpers');
const Channel = require('../../models/channel/channel').Channel;
const CHANNEL_PHASES = require('../../models/channel/channel').CHANNEL_PHASES;

const Slack = require('slack-node');

const CHANNEL_CREATE = 'Create channel';
const CHANNEL_CANCEL = 'Cancel';
const ERROR_BACK = 'Back';

module.exports = channelCreateRoute;

/**
 * @typedef {Function} ChannelCreateRoute
 * @param {{team: Team}} args
 * @param {InstallationRouter} router
 */
function channelCreateRoute(args, router) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Channel name:',
      validate: function(value) {
        let channelNameRegExp = /^[a-z\-_]{1,21}$/;
        if (channelNameRegExp.test(value)) {
          return true;
        }
        return 'Private channel names can only contain lowercase letters, numbers, hyphens, and underscores, and must be 21 characters or less.';
      }
    }, {
      type: 'input',
      name: 'timeStep',
      message: 'timeStep (ms):',
      validate: function(value) {
        let timeStepNameRegExp = /^[1-9]+[0-9]*$/;
        if (timeStepNameRegExp.test(value)) {
          return true;
        }
        return 'Time step must be positive number.';
      }
    }, {
      type: 'input',
      name: 'breakTime',
      message: 'breakTime (ms):',
      validate: function(value) {
        let timeStepNameRegExp = /^[1-9]+[0-9]*$/;
        if (timeStepNameRegExp.test(value)) {
          return true;
        }
        return 'Break time must be positive number.';
      }
    }, {
      type: 'list',
      name: 'option',
      message: helpers.separator,
      choices: [CHANNEL_CREATE, CHANNEL_CANCEL]
    }
  ]).then((/** {name: string, timeStep: string, option: string, breakTime: string} */ answers) => {
    helpers.clearConsole();
    switch(answers.option) {
      case CHANNEL_CREATE:
        let /** @type {{name: string, validate?: boolean}} */ apiCallArgs = {
          name: answers.name,
          validate: true
        };
        const slack = new Slack(args.team.token);
        /**
         * @typedef {Object} SlackGroupsCreateResponse
         * @property {boolean} ok
         * @property {Object} group
         * @property {string} group.name
         * @property {string} group.id
         * @property {string} group.creator
         * // TODO: other fields if needed.
         */
        process.stdout.write('About to create new private channel (group).\n');
        var loadingScreen = helpers.loadingScreen();
        slack.api("groups.create", apiCallArgs, (err, /** SlackGroupsCreateResponse */ response) => {
          if (err) {
            clearInterval(loadingScreen);
            _errorCallback(err.message, args, router);
          } else if(response.ok === true) {
            clearInterval(loadingScreen);
            process.stdout.write('\nAbout to invite bot to newly created channel.\n');
            loadingScreen = helpers.loadingScreen();
            // Invite app bot into channel.
            let /** @type {{channel: string, user: string}} */ apiCallArgs = {
              channel: response.group.id,
              user: args.team.botId
            };
            /**
             * @typedef {Object} SlackGroupsInviteResponse
             * @property {boolean} ok
             * @property {Object} group
             */
            slack.api("groups.invite", apiCallArgs, (err, /** SlackGroupsInviteResponse */ response2) => {
              if (err) {
                clearInterval(loadingScreen);
                _errorCallback(err.message, args, router);
              } else if (response.ok === true) {
                clearInterval(loadingScreen);
                process.stdout.write('\nCreating channel in Firebase now.\n');
                loadingScreen = helpers.loadingScreen();
                let currentDate = new Date();
                let /** @type ChannelFirebaseValue */ channelFirebaseValues = {
                  active: true,
                  name: response.group.name,
                  timeStep: parseInt(answers.timeStep, 10),
                  phase: CHANNEL_PHASES.BREAK,
                  breakTime: parseInt(answers.breakTime, 10),
                  // Set next game time to now + break time like break has just begun.
                  nextGame: currentDate.getTime() + parseInt(answers.breakTime, 10)
                };
                Channel.setChannel(channelFirebaseValues, args.team.$key, response.group.id)
                  .then(() => {
                    clearInterval(loadingScreen);
                    helpers.clearConsole();
                    router.channelsRoute(args, router);
                  }, (error) => {
                    clearInterval(loadingScreen);
                    _errorCallback('Actually Slack Channel being created... BUT!\n\n' + error.message, args, router);
                  });
              } else {
                clearInterval(loadingScreen);
                _errorCallback('Something went wrong during invitation of bot user into channel.', args, router);
              }
            });
          } else {
            clearInterval(loadingScreen);
            _errorCallback('Something went wrong. Probably this channel name already being taken by some archived channel.', args, router);
          }
        });
        break;
      case CHANNEL_CANCEL:
        router.channelsRoute(args, router);
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
 * @param {{team: Team}} args
 * @param {InstallationRouter} router
 */
function _errorCallback(message, args, router) {
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
        router.channelsRoute(args, router);
        break;
      default:
        process.exit(1);
        break;
    }
  });
}