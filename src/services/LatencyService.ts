import * as ping from "ping";

const getLatency = async () => {
    return await ping.promise.probe('google.com').then(({time}) => time)
}

export {getLatency}