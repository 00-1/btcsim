// end a request with status code and text
export default (res, code, text) => res.status(code).send(text);
