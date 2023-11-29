import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Note from './models/note.js';

// let notes = [
//   {
//     "content": "HTML is easy",
//     "important": false,
//     "id": 1
//   },
//   {
//     "content": "Browser can execute only JavaScript",
//     "important": false,
//     "id": 2
//   },
//   {
//     "content": "GET and POST are the most important methods of HTTP protocol",
//     "important": false,
//     "id": 3
//   },
//   {
//     "content": "I love penguins",
//     "important": true,
//     "id": 4
//   },
//   {
//     "content": "My favourite penguins are Emperors and Africans",
//     "important": true,
//     "id": 5
//   },
//   {
//     "content": "Pingu & Pinga were here",
//     "important": false,
//     "id": 6
//   },
//   {
//     "content": "Bidoof is my favourite Pokemon",
//     "important": true,
//     "id": 7
//   }
// ];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// POST
app.post('/api/notes', (request, response, next) => {
  const body = request.body;
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note.save()
    .then((savedNote) => response.json(savedNote))
    .catch((error) => next(error));
});

// GET
app.get('/', (request, response) => {
  response.send('<h1>Hello, world!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// PUT
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;
  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => response.json(updatedNote))
    .catch((error) => next(error));
});

// DELETE
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

// Unknown endpoint handler
function unknownEndpoint(request, response) {
  return response.status(404).send({ error: 'Unknown endpoint' });
}

app.use(unknownEndpoint);

// Error handler
function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  } else {
    next(error);
  }
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});