const mongoose = require('mongoose');
const schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new schema(
  {
    user: {
      type: schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(autoIncrement, {
    inc_filed: 'ticket',
    id: 'ticketNums',
    start_seq: 1
})

module.exports = mongoose.model('Note', noteSchema);
