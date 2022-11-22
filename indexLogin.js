let linkChangePage = document.getElementById("changePage");
let loginContainer = document.querySelector(".login-container");
let variable = false;

const changePage = (title,text) => {
    return `<h2>${title.toUpperCase()}</h2>
    <form class="form-login">
        <label for="username">Username</label>
        <input type="text" name="username" placeholder="User">
        <label for="email">Email</label>
        <input type="email" name="email" placeholder="Email">
        <a id="changePage">${text}</a>
    </form>
    <a href="./index.html"><input type="submit" class="button-submit" value="${title}"></a>
    `
};

const resetVariables = () => {
    linkChangePage = document.getElementById("changePage");
    loginContainer = document.querySelector(".login-container");
    linkChangePage.addEventListener("click", renderChangePage);
};

const renderChangePage = () => {
    if(variable === false){
        loginContainer.innerHTML = changePage("Sign Up","Are registered? Login");
        variable = true;
        resetVariables();
    } else if(variable === true){
        loginContainer.innerHTML = changePage("Login","Are not registered?");
        variable = false;
        resetVariables();
    }
};

linkChangePage.addEventListener("click", renderChangePage);