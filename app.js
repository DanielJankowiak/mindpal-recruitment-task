document.addEventListener("DOMContentLoaded", () => {
	const addNoteButton = document.getElementById("add-note-button");
	const editNoteButton = document.getElementById("edit-note-button");

	const modalOverlay = document.getElementById("modalOverlay");
	const cancelModalButton = document.getElementById("cancel-modal-button");
	const deleteModalButton = document.getElementById("delete-modal-button");

	const noteEditor = document.getElementById("note-editor");
	const searchInput = document.getElementById("search");

	const addNewNoteButton = document.getElementById("add-new-note");
	const emptyStateContainer = document.getElementById("empty-state-container");
	const cancelNoteButton = document.getElementById("cancel-note-button");
	const addNextNoteButton = document.getElementById("add-next-note-button");

	const noteTitleText = document.getElementById("note-title");
	const textArea = document.getElementById("text-area");

	const options = { month: "long", day: "numeric" };
	const today = new Date();
	let notes = [];
	let currentEditIndex = -1;
	let currentDeleteIndex = -1;

	addNewNoteButton.addEventListener("click", () => {
		noteEditor.style.display = "block";
		emptyStateContainer.style.display = "none";
	});

	cancelNoteButton.addEventListener("click", () => {
		if (notes.length === 0) {
			emptyStateContainer.style.display = "flex";
			noteEditor.style.display = "none";
		} else if (notes.length !== 0) {
			addNextNoteButton.style.display = "block";
			noteEditor.style.display = "none";
		}
	});

	function toggleButtonVisibility() {
		if (noteEditor.classList.contains("edit-mode")) {
			addNoteButton.style.display = "none";
		} else if (textArea.value.trim() !== "") {
			addNoteButton.style.display = "inline-block";
		} else {
			addNoteButton.style.display = "none";
		}
	}

	addNoteButton.addEventListener("click", () => {
		const title = document.getElementById("note-title").value.trim();
		const content = document.getElementById("text-area").value.trim();

		if (title && content) {
			addNote(title, content);
			document.getElementById("note-title").value = "";
			document.getElementById("text-area").value = "";
		}
	});

	addNextNoteButton.addEventListener("click", () => {
		addNextNoteButton.style.display = "none";
		noteEditor.style.display = "block";
		editNoteButton.style.display = "none";
	});

	function displayNotes(notesArray) {
		const notesContainer = document.getElementById("notes-container");
		notesContainer.innerHTML = "";

		notesArray.forEach((note, index) => {
			const noteElement = document.createElement("div");
			noteElement.classList.add("note");

			const noteHeader = document.createElement("div");
			noteHeader.classList.add("note-header");

			const noteTitle = document.createElement("div");
			noteTitle.classList.add("note-title");
			noteTitle.innerText = note.title;

			const noteContent = document.createElement("div");
			noteContent.classList.add("note-content");
			noteContent.innerText = note.content;

			const noteFooter = document.createElement("div");
			noteFooter.classList.add("note-footer");
			noteFooter.textContent = today.toLocaleDateString("en-US", options);

			const noteButtons = document.createElement("div");
			noteButtons.classList.add("note-buttons");

			const editButton = document.createElement("button");
			editButton.classList.add("edit-button");
			editButton.addEventListener("click", () => editNote(index));

			const deleteButton = document.createElement("button");
			deleteButton.classList.add("delete-button");
			deleteButton.addEventListener("click", () => deleteNote(index));

			noteButtons.appendChild(editButton);
			noteButtons.appendChild(deleteButton);

			noteHeader.appendChild(noteTitle);
			noteHeader.appendChild(noteButtons);

			noteElement.appendChild(noteHeader);
			noteElement.appendChild(noteContent);
			noteElement.appendChild(noteFooter);
			notesContainer.appendChild(noteElement);
		});
	}

	function addNote(title, content) {
		notes.push({ title, content });
		displayNotes(notes);
	}

	function editNote(index) {
		currentEditIndex = index;

		addNoteButton.style.display = "none";
		editNoteButton.style.display = "inline-block";

		if ((addNextNoteButton.style.display = "inline-block")) {
			addNextNoteButton.style.display = "none";
			noteEditor.style.display = "block";
			noteEditor.classList.add("edit-mode");
		}

		noteTitleText.value = notes[index].title;
		textArea.value = notes[index].content;
	}

	editNoteButton.addEventListener("click", () => {
		noteEditor.classList.remove("edit-mode");
		if (currentEditIndex !== -1) {
			const newTitle = noteTitleText.value;
			const newContent = textArea.value;

			if (newTitle !== "" && newContent !== "") {
				notes[currentEditIndex].title = newTitle;
				notes[currentEditIndex].content = newContent;

				noteTitleText.value = "";
				textArea.value = "";
				currentEditIndex = -1;
			}

			displayNotes(notes);
		}
	});

	function deleteNote(index) {
		currentDeleteIndex = index;
		modalOverlay.classList.add("show");
		cancelModalButton.addEventListener("click", () => {
			modalOverlay.classList.remove("show");
		});
	}

	deleteModalButton.addEventListener("click", () => {
		modalOverlay.classList.remove("show");
		notes.splice(currentDeleteIndex, 1);
		displayNotes(notes);
		if (notes.length === 0) {
			emptyStateContainer.style.display = "flex";
			noteEditor.style.display = "none";
			addNextNoteButton.style.display = "none";
		}
	});

	modalOverlay.addEventListener("click", (event) => {
		if (event.target === modalOverlay) {
			modalOverlay.classList.remove("show");
		}
	});

	function searchNotes() {
		const searchQuery = searchInput.value.toLowerCase();
		const filteredNotes = notes.filter(
			(note) =>
				note.title.toLowerCase().includes(searchQuery) ||
				note.content.toLowerCase().includes(searchQuery)
		);
		displayNotes(filteredNotes);
	}

	textArea.addEventListener("input", toggleButtonVisibility);
	searchInput.addEventListener("input", searchNotes);
});
