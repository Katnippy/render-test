import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
// Replaces password in URL with asterisks.
// ? Make function?
const firstIndex = url.indexOf(':', url.indexOf(':') + 1);
const secondIndex = url.indexOf('@');
const password = url.slice(firstIndex + 1, secondIndex);
const censoredUrl = url.replace(password, '********');
console.log(`Connecting to ${censoredUrl}...`);

mongoose.connect(url)
  .then((result) => console.log('Connected to the database.'))
  .catch((error) => console.log(`Error connecting to the database: ${error.message}`));

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
});
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
const Note = mongoose.model('Note', noteSchema);

export default Note;
