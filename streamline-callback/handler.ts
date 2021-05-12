import winston from 'winston'
let axios = require("axios");
require('./api');

const SEND_MESSAGE_URL = process.env.SEND_MESSAGE_URL ? process.env.SEND_MESSAGE_URL : "http://10.43.80.51:8080/function/send-message";

const logger = winston.createLogger({
    level: process?.env?.logger_level || 'info',
    format: winston.format.json(),
    transports: [ new winston.transports.Console() ]
});

const streamlineCallback = async (message: Message) : Promise<Return> => {
    const processForm = message.metaData.jwtData.formName + '-' + message.metaData.jwtData.processInstanceId;
    logger.info(`Sending process ${processForm}`);
    let response;
    try{
        response = await axios.post(SEND_MESSAGE_URL,
            {
                "processForm": processForm
            });
        response.data = processForm;
        return {
            status: "OK",
            data: response.data
        };
    } catch (e) {
        logger.error(`Problem calling send message function ${e.message}`);
        return {
            status: "FAILED",
            error: e.message
        }
    }
};

module.exports = async  (event: Event, context: any) : Promise<any> => {
    const msg = event?.body;
    logger.info(`Incoming request: ${JSON.stringify(msg)}`);
    if(msg?.metaData?.jwtData == undefined) {
        logger.error("Missing jwtData in request body");
        return context
            .status(400)
            .succeed({
                "error": "Missing data from jwt"
            });
    }
    const result = await streamlineCallback(msg);
    const status = result.error ? 500 : 200;
    return context
        .status(status)
        .headers({"Content-Type": "application/json"})
};