// logger.js
function logDebug(message) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message);
    }
}

module.exports = { logDebug };
