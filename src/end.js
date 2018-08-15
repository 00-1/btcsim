// end the request
function end(res, text) {
  console.log(text);
  res.status(200).send(text);
}

export default end;
