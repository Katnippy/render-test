import express from 'express';
import cors from 'cors';

let notes = [
  {
    "content": "HTML is easy",
    "important": false,
    "id": 1
  },
  {
    "content": "Browser can execute only JavaScript",
    "important": false,
    "id": 2
  },
  {
    "content": "GET and POST are the most important methods of HTTP protocol",
    "important": false,
    "id": 3
  },
  {
    "content": "I love penguins",
    "important": true,
    "id": 4
  },
  {
    "content": "My favourite penguins are Emperors and Africans",
    "important": true,
    "id": 5
  },
  {
    "content": "Pingu & Pinga were here",
    "important": false,
    "id": 6
  },
  {
    "content": "Bidoof is my favourite Pokemon",
    "important": true,
    "id": 7
  }
];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (request, response) => {
  response.send('<h1>Hello, world!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
});

function generateID() {
  const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;

  return maxID + 1;
}

app.post('/api/notes', (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: 'Content missing'
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateID()
  };
  notes = notes.concat(note);
  response.json(note);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});