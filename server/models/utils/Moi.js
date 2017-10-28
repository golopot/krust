var Moi = {}
Moi.string = function(){ return new MoiType(String)  }
Moi.number = function(){ return new MoiType(Number)  }
Moi.date = function(){ return new MoiType(Date)  }
Moi.boolean = function(){ return new MoiType(Boolean)  }
Moi.translate = function(obj){

  if( typeof obj == 'string' )
    return


  for( var key in obj ){

    if( obj[key] instanceof MoiType )
      obj[key] = Object.assign({}, obj[key])
    else{
      Moi.translate( obj[key] )
    }

  }

  return obj

}


var MoiType = function(type){ this.type = type }
MoiType.prototype.minlength = function(n){ this.minlength = n; return this }
MoiType.prototype.maxlength = function(n){ this.maxlength = n; return this }
MoiType.prototype.required = function(){ this.required = true; return this }



module.exports = Moi
