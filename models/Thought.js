const { Schema, model } = require('mongoose');

//Schema to create Thought Model
const thoughtSchema = new Schema(
  {thoughtText: {type: String, required: true, minlength: 1, maxlength: 280},
    createdAt: {type: Date, default: Date.now},
    username: {type: String, required: true},
    reactions: [{type: Schema.Types.ObjectId, ref: 'Reaction'}]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);
//Virtual to get the number of reactions
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);


model.exports = Thought;