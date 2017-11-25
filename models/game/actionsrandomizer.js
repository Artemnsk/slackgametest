const fs = require('fs');
const actionsFilePath = __dirname + '/../../db/actions.json';

// Randomly adds action.
module.exports = function(frequency) {
    setInterval(() => {
        fs.readFile(actionsFilePath, (err, data) => {
            if (err) {
                // TODO: error.
            } else {
                let actionsQueue = JSON.parse(data.toString() || "[]");
                actionsQueue.push({
                    type: 'ADD',
                    number: Math.round(Math.random()*100),
                    startAt: Date.now() + 20000
                });
                fs.writeFile(actionsFilePath, JSON.stringify(actionsQueue));
            }
        });
    }, frequency);
};