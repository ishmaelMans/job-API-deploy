const mongoose = require('mongoose')
const bscript = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Provide Name'],
        maxlength: 50,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Please Provide Email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password'],
        maxlength: 6
    } 
})

UserSchema.pre('save', async function(){
    const salt = await bscript.genSalt(10)
    this.password = await bscript.hash(this.password, salt)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, name: this.name},'JWT_SECRET',{expiresIn: '30d'})
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bscript.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)