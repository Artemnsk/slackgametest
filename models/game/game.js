const fs = require('fs');
const { createStore, applyMiddleware } = require('redux');
const { createLogger } = require('redux-logger');
const stateFilePath = __dirname + '/../../db/state.json';
const actionsFilePath = __dirname + '/../../db/actions.json';
const loggerMiddleware = createLogger();

// TODO: our big reducer with game logic.
const aReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return Object.assign(state, {
                number: state.number + action.number
            });
            break;
    }
    return state;
};
// That is our game store. Shared across all other functions.
var gameStore;

module.exports = function() {
    // Load initial state from DB.
    fs.readFile(stateFilePath, (err, data) => {
        // TODO: err?
        let initialState = JSON.parse(data.toString());
        gameStore = createStore(aReducer, initialState, applyMiddleware(loggerMiddleware));
        // Finally start the game.
        gameLoop();
    });
};

function gameLoop() {
    // Make a "backup" of current state into DB.
    let currentState = gameStore.getState();
    fs.writeFile(stateFilePath, JSON.stringify(currentState), function (err) {
        if (err) {
            // TODO: error.
        } else {
            // Load actions queue from DB.
            fs.readFile(actionsFilePath, (err, data) => {
                if (err) {
                    // TODO: error.
                } else {
                    // Parse actions.
                    let actionsQueue = JSON.parse(data.toString() || "[]");
                    if (actionsQueue.length > 0) {
                        /** @type Action */
                        var action = actionsQueue.shift();
                        var i = 0;
                        // Repeat until we find game-valid action or reach the end of list.
                        while (action.startAt > Date.now() && i <= actionsQueue.length) {
                            actionsQueue.push(action);
                            action = actionsQueue.shift();
                            i++;
                        }
                        if (i > actionsQueue.length) {
                            // No game-valid actions.
                            setTimeout(gameLoop, 2000);
                        } else {
                            gameStore.dispatch(action);
                            fs.writeFile(actionsFilePath, JSON.stringify(actionsQueue), function (err) {
                                if (err) {
                                    // TODO: error.
                                } else {
                                    // Continue game.
                                    gameLoop();
                                }
                            });
                        }
                    } else {
                        // Simply wait for a while - maybe actions appear later.
                        setTimeout(gameLoop, 2000);
                    }
                }
            });
        }
    });
}