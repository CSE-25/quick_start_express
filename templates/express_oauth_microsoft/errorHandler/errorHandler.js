import { appendFileSync } from 'fs';

// custom error handling function
const errorHandlerFunc = (err, res, filePath, statusCode, message) => {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${err.message}`;
    console.error(errMessage);
    appendFileSync(`./logs/${filePath}`, `${errMessage}\n`);

    return res.status(statusCode).send({
        "message": message,
        "error": err.message
    });
}

// custome error handling wrapper for every middleware incase something goes wrong
const errorHandlerWrapper = (middleware, filePath) => {
    return (req, res, next) => {
        try {
            middleware(req, res, next)
        } catch (err) {
            errorHandlerFunc(err, res, filePath, 500, 'Something went wrong. Please try again later.')
        }
    }
}

export { errorHandlerWrapper, errorHandlerFunc }