function ClientError(reason, status) {
  this.status = status || 400
  this.reason = reason || ''
}


function cerr(reason, status) {
  return new ClientError(reason, status)
}

function patchError(err) {
  const ne = new Error()
  err.stack += '\n' + (ne.stack.split('\n')[2] || '').replace(/^ {4}at/, '    from')
  return err
}


const dateToStr = d => `${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${d.getUTCDate()}`

module.exports = {
  cerr,
  ClientError,
  patchError,
  dateToStr,
}
