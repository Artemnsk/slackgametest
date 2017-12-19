"use strict";

const inquirer = require('inquirer');
const helpers = require('../helpers');
const setChannel = require('../../models/channel/channels').setChannel;

const Slack = require('slack-node');

const CHANNEL_CREATE = 'Create channel';
const CHANNEL_CANCEL = 'Cancel';

const ERROR_TRY_AGAIN = 'Try again';
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
      type: 'list',
      name: 'option',
      message: helpers.separator,
      choices: [CHANNEL_CREATE, CHANNEL_CANCEL]
    }
  ]).then((/** {name: string, timeStep: string, option: string} */ answers) => {
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
                let /** @type ChannelFirebaseValue */ channelFirebaseValues = {
                  active: true,
                  name: response.group.name,
                  timeStep: parseInt(answers.timeStep, 10)
                };
                setChannel(channelFirebaseValues, args.team.$key, response.group.id)
                  .then(() => {
                    clearInterval(loadingScreen);
                    helpers.clearConsole();
                    router.channelsRoute(args, router);
                  }, (error) => {
                    clearInterval(loadingScreen);
                    _errorCallback('Actually Slack Channel being created... BUT!\n\n' + error.message, args, router);
                  });
                //
                // // If creator is not app admin we want to invite app admin and kick creator.
                // if (response.group.creator !== args.team.admin) {
                //   clearInterval(loadingScreen);
                //   process.stdout.write('\nCreator is not app admin! About to invite app admin to newly created channel.\n');
                //   loadingScreen = helpers.loadingScreen();
                //   // Invite app admin into channel.
                //   let /** @type {{channel: string, user: string}} */ apiCallArgs = {
                //     channel: response.group.id,
                //     user: args.team.admin
                //   };
                //   slack.api("groups.invite", apiCallArgs, (err, /** SlackGroupsInviteResponse */ response3) => {
                //     if (err) {
                //       clearInterval(loadingScreen);
                //       _errorCallback(err.message, args, router);
                //     } else if (response.ok === true) {
                //       clearInterval(loadingScreen);
                //       process.stdout.write('\nAbout to kick initial channel creator from newly created channel.\n');
                //       loadingScreen = helpers.loadingScreen();
                //       // Kick original creator.
                //       let /** @type {{channel: string, user: string}} */ apiCallArgs = {
                //         channel: response.group.id,
                //         user: response.group.creator
                //       };
                //       process.stdout.write('>>>> ' + response.group.creator + ' <<<<');
                //       /**
                //        * @typedef {Object} SlackGroupsKickResponse
                //        * @property {boolean} ok
                //        */
                //       slack.api("groups.kick", apiCallArgs, (err, /** SlackGroupsKickResponse */ response4) => {
                //         if (err) {
                //           clearInterval(loadingScreen);
                //           _errorCallback(err.message, args, router);
                //         } else if (response.ok === true) {
                //           process.stdout.write(JSON.stringify(response));
                //           clearInterval(loadingScreen);
                //           process.stdout.write('\nAbout to create channel in Firebase now.\n');
                //           loadingScreen = helpers.loadingScreen();
                //           // Finally we can create this channel in Firebase.
                //           let /** @type ChannelFirebaseValue */ channelFirebaseValues = {
                //             active: true,
                //             name: response.group.name,
                //             timeStep: parseInt(answers.timeStep, 10)
                //           };
                //           setChannel(channelFirebaseValues, args.team.$key, response.group.id)
                //             .then(() => {
                //               clearInterval(loadingScreen);
                //               // helpers.clearConsole();
                //               // router.channelsRoute(args, router);
                //             }, (error) => {
                //               clearInterval(loadingScreen);
                //               _errorCallback('Actually Slack Channel being created... BUT!\n\n' + error.message, args, router);
                //             });
                //         } else {
                //           clearInterval(loadingScreen);
                //           _errorCallback('Something went wrong during kick non-admin from channel.', args, router);
                //         }
                //       });
                //     } else {
                //       clearInterval(loadingScreen);
                //       _errorCallback('Something went wrong during admin invitation into channel.', args, router);
                //     }
                //   });
                // } else {
                //   clearInterval(loadingScreen);
                //   process.stdout.write('\nCreator is app admin! Creating channel in Firebase now.\n');
                //   loadingScreen = helpers.loadingScreen();
                //   let /** @type ChannelFirebaseValue */ channelFirebaseValues = {
                //     active: true,
                //     name: response.group.name,
                //     timeStep: parseInt(answers.timeStep, 10)
                //   };
                //   setChannel(channelFirebaseValues, args.team.$key, response.group.id)
                //     .then(() => {
                //       clearInterval(loadingScreen);
                //       //helpers.clearConsole();
                //       //router.channelsRoute(args, router);
                //     }, (error) => {
                //       clearInterval(loadingScreen);
                //       _errorCallback('Actually Slack Channel being created... BUT!\n\n' + error.message, args, router);
                //     });
                // }
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
  // helpers.clearConsole();
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