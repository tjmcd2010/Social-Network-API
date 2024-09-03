const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {username: {type: String, required: true, unique: true, trim: true},
    email: {type: String, required: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    thoughts: [{type: Schema.Types.ObjectId, ref: 'Thought'}],
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
  }, // set to true to use virtual below    
  {toJSON: {getters: true, virtuals: true}, id: false
});


//Creates a virtual called `friendCount` that retrieves 
//the length of the user's `friends` array field on query.

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
  });

  
  const User = model('user', userSchema);


  module.exports = User;