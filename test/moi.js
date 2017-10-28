var M = require('../server/models/utils/Moi')

var a = M.translate({
    name: M.string().required()
})

var b = M.translate({
    name: [M.string().required()]
})

var c = M.translate({
    name: [{
        qq: String,
        bb: Number
    }]
})

console.log(c)
