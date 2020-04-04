const handleError = () => {

}

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login?_method=PUT",
    data
  });
}

$(document).ready(()=>{
$('.login-form').on('submit',(e)=> {
  e.preventDefault();
  const user_input = {email: $('.login-email').val(), password:$('.login-password').val()}
  logIn(user_input).then((data) => console.log(data))
})

});