let books = [];
// ------------------------------ Books Function ------------------------------ 
// DISPLAY ALL FETCHED DATA
if (window.location.pathname.includes("index.html")) {

  // DISPLAY ALL DATA FUNCTION
  async function displayAllData(fbooks) {
    let filter
    let res = await fetchAllData();
    books = res.data
    if (fbooks) { filter = fbooks } else {
      filter = books
    }
    let html = filter
      .map(
      (book) => `<tr>
          <td><a href="https://www.google.com/search?tbm=bks&q=${book.title
        }"><img
                      src="${book.thumbnailUrl}"></a></td>
          <td id="bookTitle">
          ${book.title}
          </td>
          <td id="bookAuthors">
          ${book.authors}
          </td>
          <td id="bookShortDescription">
          ${(book.shortDescription) ? book.shortDescription : "----------"}
          </td >
          <td id="bookCategories">
              ${(book.categories) ? book.categories : "----------"}
          </td>
  
          <td><a href="update.html?${book._id
        }" class="btn btn-danger d-inline me-2" id="sumbit_updated_data">Edit</a><a data-id="${book._id
        }" href="index.html" class="btn btn-danger d-inline" id="delete_data">Delete</a></td>
        </tr > `
    )
      .join("\n");
    document.getElementById("table_body").innerHTML = html;
  }
  displayAllData();
  // DELETE ALL DATA FUNCTION
  async function deleteSelectedBook(bookId) {
    let deleteBook = await fetchBookData(bookId);
    if (!deleteBook.data) {
      alert(deleteBook.error)
    } else {
      let id = deleteBook.data._id
      await deleteBookData(id);
    }
  }
  document
    .getElementById("table_body")
    .addEventListener("click", async function (e) {
      e.stopPropagation();
      let id = e.target.dataset.id;
      if (e.target.id == "delete_data") {
        e.preventDefault();
        await deleteSelectedBook(id);
        alert("Selected Book was deleted successfully!!");
        window.location.href = "http://localhost:8080/index.html";
      }
    });
  document.getElementById("filter").addEventListener('keyup', function (e) {
    e.key = this.value;
    let searchTerm = this.value.toLowerCase();
    let booksfilter = books.filter(el => el.title.toLowerCase().includes(searchTerm));
    displayAllData(booksfilter)
  })
}

// ADD NEW BOOK DATA
if (window.location.pathname.includes("new.html")) {
  async function displayNewBookData() {
    let book = {};
    book.thumbnailUrl = document.getElementById("thumbnailUrl").value;
    book.title = document.getElementById("title").value;
    book.authors = document.getElementById("authors").value;
    book.categories = document.getElementById("categories").value;
    book.shortDescription = document.getElementById("shortDescription").value;
    let bookData = await fetchNewData(book)
    if (!bookData.data) {
      alert(bookData.error)
    } else {
      alert(`${book.title} was added successfully`);
    }
  }
  document
    .getElementById("sumbit_new_data")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      await displayNewBookData();
    });
}

// UPDATE BOOK DATA
if (window.location.pathname.includes("update.html")) {
  async function displayUpdatedBookData(id) {
    let foundBook = await fetchBookData(id);
    if (foundBook) {
      document.getElementById("updateThumbnailUrl").value =
        foundBook.data.thumbnailUrl;
      document.getElementById("updateTitle").value = foundBook.data.title;
      document.getElementById("updateAuthors").value = foundBook.data.authors;
      document.getElementById("updateCategories").value = foundBook.data.categories;
      document.getElementById("updateShortDescription").value =
        foundBook.data.shortDescription;
      document
        .getElementById("update_btn")
        .addEventListener("click", async function (e) {
          e.preventDefault();
          let updatedBook = {};
          updatedBook.thumbnailUrl =
            document.getElementById("updateThumbnailUrl").value;
          updatedBook.title = document.getElementById("updateTitle").value;
          updatedBook.authors = document.getElementById("updateAuthors").value;
          updatedBook.categories =
            document.getElementById("updateCategories").value;
          updatedBook.shortDescription = document.getElementById(
            "updateShortDescription"
          ).value;
          updatedBook._id = foundBook.data._id
          let book = await fetchUpdateData(updatedBook);
          console.log(book);
          if (!book.data) {
            alert(book.error);
          } else {
            alert("Book is added successfully");
          }
        });
    } else {
      alert("Book cannot be found");
    }
  }
  displayUpdatedBookData(window.location.search.replace("?", ""));
}

// ------------------------------ Users Function ------------------------------ 
// ADD NEW USER DATA
if (window.location.pathname.includes("signup.html")) {
  async function addNewUser() {
    let user = {}
    user.username = document.getElementById("username").value.toLowerCase();
    user.password = document.getElementById("password").value;
    let userData = await fetchNewUserData(user);
    if (!userData.data) {
      alert(userData.error);
    } else {
      alert("Welcome, you signed in successfully");
    }
  }
  document
    .getElementById("signup")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      await addNewUser();
    });
}
// LOGIN USER
if (window.location.pathname.includes("login.html")) {
  async function loginForm() {
    let user = {}
    user.username = document.getElementById("username").value.toLowerCase();
    user.password = document.getElementById("password").value;
    let userData = await login(user);
    if (!userData.data) {
      alert(userData.error);
    } else {
      localStorage.sessionId = userData.data.sessionId;
      alert('Welcome, you logged in successfully')
      window.location.pathname = 'index.html';
    }
  }
  document.getElementById("login").addEventListener('click', function (e) {
    e.preventDefault();
    loginForm();
  })
}