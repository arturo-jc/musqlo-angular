import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  return res.json({ msg: 'hello world' });
})

app.listen(3000, () => console.log('Listening...'));
