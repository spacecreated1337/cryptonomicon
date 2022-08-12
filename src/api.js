const API_KEY =
    "7de177d1d39ed1b4aa861124cc3fdc575d58dbc0cbdec63434bc75dcaf1caf27";

const tickersHandlers = new Map(); // {}

const socket = new WebSocket(
    `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

const notExistingCoins = [];

socket.addEventListener("message", e => {
    const {
        TYPE: type,
        FROMSYMBOL: currency,
        PRICE: newPrice,
        MESSAGE: message,
    } = JSON.parse(
        e.data
    );
    if (message === 'INVALID_SUB') {
        const coin = JSON.parse(
            e.data
        ).PARAMETER.split('~')[2];
        if (notExistingCoins.length == 0) {
            notExistingCoins.push(coin);
        } else {
            notExistingCoins.forEach(coinName => {
                if (coinName != coin) {
                    notExistingCoins.push(coin);
                }
                return;
            })
        }
        localStorage.setItem('notExistingCoins', JSON.stringify(notExistingCoins));
    }
    if (type !== AGGREGATE_INDEX || newPrice === undefined) {
        return;
    }
    const handlers = tickersHandlers.get(currency) || [];
    handlers.forEach(fn => fn(newPrice));
});

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
        return;
    }

    socket.addEventListener(
        "open",
        () => {
            socket.send(stringifiedMessage);
        }, {
            once: true
        }
    );
}

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        action: "SubAdd",
        subs: [`5~CCCAGG~${ticker}~USD`]
    });
}

function unsubscribeFromTickerOnWs(ticker) {
    sendToWebSocket({
        action: "SubRemove",
        subs: [`5~CCCAGG~${ticker}~USD`]
    });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
    unsubscribeFromTickerOnWs(ticker);
};