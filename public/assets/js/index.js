// Cache frequently used DOM elements
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Get all notes from the database
async function getNotes() {
  try {
    const response = await $.ajax({
      url: "/api/notes",
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

// Save a note to the database
async function saveNote() {
  try {
    const note = {
      title: $noteTitle.val(),
      text: $noteText.val(),
    };
    const response = await $.ajax({
      url: "/api/notes",
      method: "POST",
      data: note,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

// Delete a note from the database
async function deleteNote() {
  try {
    const id = $(this).parent(".list-group-item").data().id;
    await $.ajax({
      url: `api/notes/${id}`,
      method: "DELETE",
    });
    if (activeNote.id === id) {
      activeNote = {};
    }
    getAndRenderNotes();
  } catch (error) {
    console.error(error);
  }
}

// Display the active note or render empty inputs
function renderActiveNote() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
}

// Update the view when a note is saved
async function handleNoteSave() {
  try {
    const savedNote = await saveNote();
    activeNote = savedNote;
    getAndRenderNotes();
    renderActiveNote();
  } catch (error) {
    console.error(error);
  }
}

// Display a note when it is clicked
function handleNoteView() {
  activeNote = $(this).data();
  renderActiveNote();
}

// Allow the user to enter a new note
function handleNewNoteView() {
  activeNote = {};
  renderActiveNote();
}

// Show or hide the save button based on input values
function handleRenderSaveBtn() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
}

// Render the list of note titles
function renderNoteList(notes) {
  $noteList.empty();
  const noteListItems = notes.map((note) => {
    const $li = $("<li>").addClass("list-group-item").data(note);
    const $span = $("<span>").text(note.title);
    const $delBtn = $("<i>")
      .addClass("fas fa-trash-alt float-right text-danger delete-note");
    $li.append($span, $delBtn);
    return $li;
  });
  $noteList.append(noteListItems);
}

// Get and render the initial list of notes
async function getAndRenderNotes() {
  try {
    const
