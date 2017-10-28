function ClientError(reason, status){
  this.status = status || 400
  this.reasdon = reason || ''
}


function cerr(reason, status){
  return new ClientError(reason, status)
}


module.exports = {
  cerr,
  ClientError,
}
