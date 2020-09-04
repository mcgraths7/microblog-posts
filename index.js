const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  req.status(200).send('Hello from Kubernetes!');
});

app.post('/posts', async (req, res) => {
  const { id, title, content } = req.body;
  const newPost = {
    id,
    title,
    content,
  };
  posts[id] = newPost;

  await axios
    .post('http://localhost:3005/events', {
      type: 'PostCreated',
      data: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
      },
    })
    .catch((err) => {
      throw new Error(
        'There was a problem emitting the PostCreated event:',
        err.message,
      );
    });
  console.log('Event emitted: PostCreated');

  res.status(201).send('Ok');
});

app.post('/events', (req, res) => {
  const { type } = req.body;
  if (type === 'PostCreated') {
    console.log('Event acknowledged: PostCreated');
  }
  res.status(200).send('Ok');
});

app.listen(3001, () => {
  console.log('Posts server v4 is listening on port 3001...');
});
