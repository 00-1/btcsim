// end the request
function end(res, code, text) {
  console.log(text);
  res.status(code).send(text);
}

export default end;
