// Cache selectors for faster access
const noteTitle = document.querySelector(".note-title");
const noteText = document.querySelector(".note-textarea");
const saveNoteBtn = document.querySelector(".save-note");
const newNoteBtn = document.querySelector(".new-note");
const noteList = document.querySelector(".list-container .list-group");

// Keep track of the active note
let activeNote = {};

// Function to get all notes from the database
async function getNotes() {
  const response = await fetch('/api/notes');
  return await response.json();
}

// Function to save a note to the database
async function saveNote(note) {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return await response.json();
}

// Function to delete a note from the database
async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: 'DELETE' });
}

// Function to render the active note
function renderActiveNote() {
  saveNoteBtn.style.display = 'none';

  if (activeNote.id) {
    noteTitle.readOnly = true;
    noteText.readOnly = true;
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.readOnly = false;
    noteText.readOnly = false;
    noteTitle.value = '';
    noteText.value = '';
  }
}

// Function to handle saving a note
function handleNoteSave() {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
}

// Function to handle deleting a note
function handleNoteDelete(event) {
  event.stopPropagation();

  const note = event.target.closest('.list-group-item').dataset;

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
}

// Function to handle viewing a note
function handleNoteView(event) {
  activeNote = event.target.closest('.list-group-item').dataset;
  renderActiveNote();
}

// Function to handle creating a new note
function handleNewNoteView() {
  activeNote = {};
  renderActiveNote();
}

// Function to handle rendering the save button
function handleRenderSaveBtn() {
  const isNoteEmpty = !noteTitle.value.trim() || !noteText.value.trim();
  saveNoteBtn.style.display = isNoteEmpty ? 'none' : 'block';
}

// Function to render the list of notes
function renderNoteList(notes) {
  noteList.innerHTML = '';

  const noteListItems = notes.map(note => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.dataset.id = note.id;

    const span = document.createElement('span');
    span.textContent = note.title;

    const delBtn = document.createElement('i');
    delBtn.className = 'fas fa-trash-alt float-right text-danger delete-note';

    li.append(span, delBtn);

    return li;
  });

  noteList.append(...noteListItems);
}

// Function to get and render the initial list of notes
async function getAndRenderNotes() {
  const notes = await getNotes();
  renderNoteList(notes);
}

// Add event listeners
saveNoteBtn.addEventListener('click', handleNoteSave);
noteList.addEventListener('click', handle
