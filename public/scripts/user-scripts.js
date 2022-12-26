const form = document.getElementById('form');
const username = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', (event) => {
    if (isFormValid() == true) {
        form.submit();
    } else {
        event.preventDefault();
    }
});
function isFormValid() {
    const check = document.querySelectorAll('form div');
    let result = false;
    check.forEach(item => {
        if (item.classList.contains('success')) {
            result = true;
        }
    });
    return result;
}
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')
    errorDisplay.innerText = ''
    inputControl.classList.add('success')
    inputControl.classList.remove('error')
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = message;
    inputControl.classList.add('error')
    inputControl.classList.remove('success')

}
const isValidEmail = () => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;;
    return re.test((email.value));
}

const validateRegister = () => {
    validateName();
    validateEmail();
    validatePassword();
    validatePassword2();
}
const validateLogin=()=>{
    validateEmail();
    validatePassword();
}
const validateAdminLogin=()=>{
    validateName();
    validatePassword();
}
const validateAddUser=()=>{
    validateName();
    validateEmail();
    validatePassword();
    validatePassword2();
}
const validateEditUser=()=>{
    validateName();
    validateEmail();
    validatePassword();
    validatePassword2();
}
function validateName() {
    const usernamevalue = username.value.trim()
    if (usernamevalue === '') {
        setError(username, 'Username is Required')
    } else {
        setSuccess(username)
    }
}
function validateEmail() {
    const emailvalue = email.value.trim()
    if (emailvalue === '') {
        setError(email, 'Email is Required')
    } else if (!isValidEmail(emailvalue)) {
        setError(email, 'Provide a valid Email Address')

    } else {
        setSuccess(email)
    }

}
function validatePassword() {
    const passwordvalue = password.value.trim()
    if (passwordvalue === '') {
        setError(password, 'Password is Required')
    } else if (passwordvalue.length < 4) {
        setError(password, 'Password Must be atleast 4 character')
    }
    else {
        setSuccess(password)
    }
}
function validatePassword2() {
    const passwordvalue = password.value.trim()
    const password2value = password2.value.trim()
    console.log('welcome')

    if (password2value === '') {
        setError(password2, 'Confirmation is Required')
    } else if (password2value !== passwordvalue) {
        setError(password2, "Password Doesn't Match ")
    }
    else {
        setSuccess(password2);
    }
}