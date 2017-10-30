function ClientError(reason, status){
  this.status = status || 400
  this.reason = reason || ''
}


function cerr(reason, status){
  return new ClientError(reason, status)
}



const dateToStr = d => `${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${d.getUTCDate()}`

module.exports = {
  cerr,
  ClientError,
  dateToStr,
}
