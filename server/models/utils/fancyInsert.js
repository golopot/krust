function fancyInsert(doc){
  doc.id = 0
  var err = doc.validateSync()
  if(err) return Promise.reject(err)

  var tryCount = 0
  var self = this

  function getHighestId(){
    return self.collection.find({},{id: 1}).sort({id: -1}).limit(1).toArray()
      .then( docs => docs.length === 0 ? 1 : docs[0].id )
      .catch( (err) => Promise.reject(err) )
  }

  function optimisticallyInsert(){
    return getHighestId()
      .then( id => {
        doc.id = id + 1
        return self.collection.insert(doc).then( () => doc.id )
      })
      .catch( e => {
        if(e.code == 11000){
          return tryCount++ > 10 ?
            Promise.reject('failed attempts count exceeded maximum 10.') :
            optimisticallyInsert(doc)
        }
        else{
          return Promise.reject(e)
        }
      })
  }


  return optimisticallyInsert()

}

module.exports = fancyInsert
