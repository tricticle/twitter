// api/reply.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const replySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.UUID },
  text: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.UUID, required: true },
  tweet_id: { type: mongoose.Schema.Types.UUID },
  reply_id: { type: mongoose.Schema.Types.UUID },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { text, user_id, tweet_id, reply_id } = req.body;
      const reply = new Reply({
        _id: new mongoose.Types.UUID(),
        text,
        user_id,
        tweet_id,
        reply_id,
      });
      await reply.save();
      res.status(201).json({ message: 'Reply added successfully' });
    } else if (req.method === 'GET') {
      const replies = await Reply.find().lean(); // Use .lean() to convert to plain JavaScript objects
      const stringifiedReplies = replies.map(reply => ({
        ...reply,
        user_id: reply.user_id.toString(),
        tweet_id: reply.tweet_id ? reply.tweet_id.toString() : null,
        reply_id: reply.reply_id ? reply.reply_id.toString() : null,
      }));
      res.json(stringifiedReplies);
    } else {
      res.status(400).json({ error: 'Invalid request method' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
