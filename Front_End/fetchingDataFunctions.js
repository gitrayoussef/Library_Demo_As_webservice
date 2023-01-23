// ------------------------------ Fetching books data ------------------------------ 
async function fetchAllData() {
  let res = await fetch("/books");
  let resJson = await res.json();
  return resJson;
}
async function fetchBookData(id) {
  let res = await fetch(`/books/${id}`);
  let resJson = await res.json();
  return resJson;
}

async function fetchNewData(newBook) {
  let res = await fetch("/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sessionId": localStorage.sessionId
    },
    body: JSON.stringify(newBook),
  });
  let resJson = await res.json();
  return resJson;
}

async function fetchUpdateData(updateBook) {
  let res = await fetch(`/books/${updateBook._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "sessionId": localStorage.sessionId
    },
    body: JSON.stringify(updateBook),
  });
  let resJson = await res.json();
  return resJson;
}

async function deleteBookData(deleteBook) {

  let res = await fetch(`/books/${deleteBook}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "sessionId": localStorage.sessionId
    },
    body: null,
  });
  let resJson = await res.json();
  return resJson;
}
// ------------------------------  Fetching users data ------------------------------ 
async function fetchNewUserData(newUser) {
  let res = await fetch("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sessionId": localStorage.sessionId
    },
    body: JSON.stringify(newUser),
  });
  let resJson = await res.json();
  return resJson;
}
async function login(user) {
  let res = await fetch(`/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sessionId": localStorage.sessionId
    },
    body: JSON.stringify(user),
  });
  let resJson = await res.json();
  return resJson;
}

// async function fetchUsersData() {
//   let res = await fetch("/users");
//   let resJson = await res.json();
//   return resJson;
// }
// async function fetchUserData(userId) {
//   let res = await fetch(`/users/${userId}`);
//   let resJson = await res.json();
//   return resJson;
// }


// async function fetchUpdateUserData(updateUser) {
//   let res = await fetch(`/users/${updateUser._id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updateUser),
//   });
//   let resJson = await res.json();
//   return resJson;
// }

// async function deleteUserData(deleteUser) {
//   let res = await fetch(`/books/${deleteUser._id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(deleteUser),
//   });
//   let resJson = await res.json();
//   return resJson;
// }
