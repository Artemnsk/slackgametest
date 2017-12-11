const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const createLogger = require('redux-logger').createLogger;
const loggerMiddleware = createLogger();
const ACTION_TYPES = require('../action/action').ACTION_TYPES;
const getRecentAction = require('../action/actions').getRecentAction;
const removeAction = require('../action/actions').removeAction;
const getState = require('../state/states').getState;
const setState = require('../state/states').setState;

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
      return Object.assign(state, {
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
module.exports = function () {
  // Load initial state from DB.
  return getState()
    .then((initialState) => {
      gameStore = createStore(aReducer, initialState, applyMiddleware(loggerMiddleware));
      // Finally start the game.
      gameLoop();
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
        gameStore.dispatch(action.getFirebaseValue());
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