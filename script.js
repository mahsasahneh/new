 function clearForm() {
  $("#bookTitle").val("");
  $("#author").val("");
  $("#genre").val("");
  $("#year").val("");
  $("#quantity").val("");
}

function clearSearchForm() {
  $("#searchTitle").val("");
  $("#searchAuthor").val("");
  $("#searchGenre").val("");
  $("#searchYear").val("");
  $("#searchQuantity").val("");
}

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

function displayBooks(booksArray) {
  let table = $("#bookTable tbody");
  table.empty();

  booksArray.forEach((book) => {
    table.append(`
      <tr id="${book.id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td>${book.quantity}</td>
        <td>
          <button class="mb-1 btn btn-sm btn-warning" editBtn data-id="${book.id}">
            Edit
          </button>
          <button class="mb-1 btn btn-sm btn-danger" deleteBtn data-id="${book.id}">
            Delete
          </button>
        </td>
      </tr>
    `);
  });
}

function getBooks() {
  // Fetch all books when document is ready
  $(document).ready(function () {
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => displayBooks(books));
  });
}

function searchBook() {
  let searchTitle = $("#searchTitle").val().toLowerCase();
  let searchAuthor = $("#searchAuthor").val().toLowerCase();
  let searchGenre = $("#searchGenre").val().toLowerCase();
  let searchYear = $("#searchYear").val();
  let searchQuantity = $("#searchQuantity").val();

  fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(books => {
      let filteredBooks = books.filter((book) => {
        let titleMatch = searchTitle ? book.title.toLowerCase().includes(searchTitle) : true;
        let authorMatch = searchAuthor ? book.author.toLowerCase().includes(searchAuthor) : true;
        let genreMatch = searchGenre ? book.genre.toLowerCase().includes(searchGenre) : true;
        let yearMatch = searchYear ? book.year.toString().includes(searchYear) : true;
        let quantityMatch = searchQuantity ? book.quantity.toString().includes(searchQuantity) : true;

        return (
          titleMatch && authorMatch && genreMatch && yearMatch && quantityMatch
        );
      });

      if (filteredBooks.length > 0) {
        displayBooks(filteredBooks);
        console.log(filteredBooks);
      } else {
        $("#bookTable tbody").empty();
        alert("No books found matching the search criteria.");
      }
    });
}

// events
$("#searchForm").submit(function (e) {
  e.preventDefault();
  searchBook();
  clearSearchForm();
});

$("#editForm").submit(function (e) {
  e.preventDefault();

  let bookId = $("#editBookId").val();

  let updatedBook = {
    title: $("#editbookTitle").val(),
    author: $("#editauthor").val(),
    genre: $("#editgenre").val(),
    year: $("#edityear").val(),
    quantity: $("#editquantity").val(),
  };

  // Update the book
  fetch(`http://localhost:3000/books/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBook),
  })
    .then(response => response.json())
    .then(() => {
      // Refresh the books in the table
      fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => displayBooks(books));

      $("#editModal").modal("hide");
    });
});

$("#bookForm").submit(function (e) {
  e.preventDefault();

  let book = {
    id: generateId(),
    title: $("#bookTitle").val(),
    author: $("#author").val(),
    genre: $("#genre").val(),
    year: $("#year").val(),
    quantity: $("#quantity").val(),
  };

  // Post the new book
  fetch('http://localhost:3000/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  })
    .then(response => response.json())
    .then(newBook => {
      // Add the new book to the table
      getBooks();
      clearForm();
    });
});

$(document).on("click", "[deleteBtn]", function () {
  let bookId = $(this).data("id");

  // Delete the book
  fetch(`http://localhost:3000/books/${bookId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(() => {
      // Refresh the books in the table
      fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => displayBooks(books));
    });
});

$(document).on("click", "[editBtn]", function () {
  let bookId = $(this).data("id");

  // Get the book to edit
  fetch(`http://localhost:3000/books/${bookId}`)
    .then(response => response.json())
    .then(book => {
      $("#editbookTitle").val(book.title);
      $("#editauthor").val(book.author);
      $("#editgenre").val(book.genre);
      $("#edityear").val(book.year);
      $("#editquantity").val(book.quantity);
      $("#editBookId").val(book.id);

      $("#editModal").modal("show");
    });
});

$(document).on("click", "#clsBtn", function () {
  $("#editModal").modal("hide");
});



//run it
getBooks();