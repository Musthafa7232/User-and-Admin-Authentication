

function savechanges(){

   if(isFormValid() == true) {
     const data=document.getElementById('savechange').dataset.url;
    const url="http://localhost:3000/admin/edit/"+data;
    
    fetch(url,{
        method:'put',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
        name:document.getElementById('name').value,
        password:document.getElementById('password').value,
        email:document.getElementById('email').value
        })
    }).then((response)=>response.json())
    .then((data)=>window.location.href=data.redirect)
    .catch((err)=>console.log(err))

}
   }

   
function deleteitem(){
  
    const data=document.getElementById('delete-item').dataset.url;
    
    const url="http://localhost:3000/admin/edit/"+data;
    
    fetch(url,{
        method:'delete',
        headers:{
            'content-type':'application/json'
        },
       
        _id:data
       
    }).then((response)=>response.json())
    .then((data)=>window.location.href=data.redirect)
    .catch((err)=>console.log(err))

}
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