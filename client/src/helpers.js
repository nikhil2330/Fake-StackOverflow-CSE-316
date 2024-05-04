export function getTimeStamp(askDate) {
  //gets and formats time
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(askDate);
  const sec = Math.floor((new Date() - date) / 1000);
  const min = Math.floor(sec / 60);
  const hours = Math.floor(min / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(new Date().getFullYear() - date.getFullYear());

  if (years > 0) {
    return (
      month[date.getMonth()] +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      date.getHours() +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      "."
    );
  } else if (days > 0) {
    return (
      month[date.getMonth()] +
      " " +
      date.getDate() +
      " at " +
      date.getHours() +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      "."
    );
  } else if (hours > 0) {
    return hours + " hours ago.";
  } else if (min > 0) {
    return min + " minutes ago.";
  } else if ((sec) => 0) {
    return sec + " seconds ago.";
  }
}

export function questionErrors() {
  // function for errors in post question page
  let flag = 0;
  const titleT = document.getElementById("title_input").value.trim();
  const textT = document.getElementById("quest_input").value.trim();
  const tagsT = document.getElementById("tags_input").value.trim();
  const summaryT = document.getElementById("summary_input").value.trim();

  if (titleT.length > 100 || titleT.length < 1) {
    document.getElementById("title_error").textContent =
      "Title cannot be empty and cannot be greater than 50 characters!";
    flag = 1;
  }
  if (textT.length < 1) {
    document.getElementById("text_error").textContent = "Text cannot be empty!";
    flag = 1;
  }
  let a = 0;
  let newtagarray = tagsT
    .trim()
    .split(" ")
    .filter((tag) => tag !== "");
  newtagarray = newtagarray.filter(
    (item, i) => newtagarray.indexOf(item) === i
  );
  if (newtagarray.length === 0) a = -1;
  for (let i = 0; i < newtagarray.length; i++) {
    if (newtagarray[i].length > 20) {
      a = 1;
    }
  }

  if (a === -1) {
    a = 0;
    document.getElementById("tags_error").textContent = "Tags cannot be empty!";
    flag = 1;
  }
  if (newtagarray.length > 5 || a === 1) {
    a = 0;
    document.getElementById("tags_error").textContent =
      "There can't be more than 5 tags and each tag cannot be greater than 20 characters!";
    flag = 1;
  }
  if (summaryT.length > 100 || summaryT.length < 1) {
    document.getElementById("summary_error").textContent =
      "Summary cannot be empty and cannot be greater than 50 characters!";
    flag = 1;
  }
  return flag;
}

export function answerErrors() {
  let flag = 0;
  const textT = document.getElementById("answer_input").value.trim();
  if (textT.length < 1) {
    document.getElementById("ans_text_error").textContent =
      "Text cannot be empty!";
    flag = 1;
  }
  return flag;
}

export const signupErrors = (formData) => {
  const { username, email, password, password2 } = formData;
  const errors = {};
  const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email) {
    errors.email = "The email field cannot be empty.";
  } else if (!email.match(mailFormat)) {
    errors.email = "Email is invalid.";
  }
  if (!password) {
    errors.password = "The password field cannot be empty.";
  } else {
    if (username && password.includes(username)) {
      errors.password = "Password should not contain the username.";
    }
    if (email && email.split("@")[0] && password.includes(email.split("@")[0])) {
      errors.password = "Password should not contain the email prefix.";
    }
  }
  if(!username){
    errors.username = "The username field cannot be empty.";
  }

  if (!password2) {
      errors.password2 = "The confirm password field cannot be empty.";
  } else if (password !== password2) {
      errors.password2 = "Passwords do not match.";
  }

  return errors;
};

export const loginErrors = (formData) => {
  const {email, password} = formData;
  const errors = {};

  if (!email) {
    errors.email = "The email field cannot be empty.";
  }
  if (!password) {
    errors.password = "The password field cannot be empty.";
  } 
  return errors;
};
