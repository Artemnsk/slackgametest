const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const createLogger = require('redux-logger').createLogger;
const loggerMiddleware = createLogger();
const ACTION_TYPES = require('../models/action/action').ACTION_TYPES;
const getRecentAction = require('../models/action/actions').getRecentAction;
const removeAction = require('../models/action/actions').removeGameActionRequest;
const getState = require('../models/state/states').getState;
const setState = require('../models/state/states').setState;
const Team = require('../models/team/team').Team;
const Channel = require('../models/channel/channel').Channel;

// TODO: Our big reducer with game logic.
/**
 *
 * @param {State} state
 * @param {Action} action
 * @return State
 */
const aReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ACTION_TYPE_ADD:
      return Object.assign({}, state, {
        number: state.number + action.number
      });
      break;
  }
  return state;
};

// That is our game store. Shared across all other functions.
var gameStore;

/**
 * Main function which starts the game.
 * @return {Promise<void>}
 */
module.exports = () => {
  // Load all active teams.
  return Team.getTeams(true)
    .then((teams) => {
      // TODO: spawn separate child process for each team?
      teams.map((team) => {
        // Load all active channels for this team.
        Channel.getChannels(team.$key, true)
          .then((channels) => {
            var a = 1;
            // TODO: load game loop for each of these channels.
            // TODO: maybe game loop get all these objects as parameters. And outside this package we are tracking for changes in team/channel.
          });
      });
      // return getState()
      //   .then((initialState) => {
      //     gameStore = createStore(aReducer, initialState, applyMiddleware(loggerMiddleware));
      //     // Finally start the game.
      //     gameLoop();
      //   });
    });
};

function gameLoop() {
  // Load recent action from DB.
  return getRecentAction()
    .then((action) => {
      if (action === null) {
        // If no action provided let's wait for some time and repeat loop.
        setTimeout(gameLoop, 2000);
      } else {
        let actionSimpleObject = action.getFirebaseValue();
        gameStore.dispatch(actionSimpleObject);
        // Remove this action now.
        removeAction(action.$key)
          .then(() => {
            // TODO: maybe dispatch some 'game circle' special action which calculates(=validate) all state?
            // Make a "backup" of current state into DB.
            let currentState = gameStore.getState();
            setState(currentState)
              .then(gameLoop);
          });
      }
    }, (error) => {
      // TODO: handle Firebase errors?
    });
}