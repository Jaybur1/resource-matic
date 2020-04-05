const handleError = (data) => {
  $('.login-form')
  .toast({
    class:'error',
    title: 'Error',
    message: data.err,
    showProgress: 'bottom',
    showIcon: 'fire',
  });
}
const loginSuccess;

const signUp = data => {

}

const logIn = data =>  {
  return $.ajax({
    method: "POST",
    url: "/users/login?_method=PUT",
    data,
    success: (data,textStatus) => {
      if(data.id) {
        window.location.href = '/home'
      }else {
       handleError(data)
      }
    }
  });
}

$(document).ready(()=>{
$('.login-form').on('submit',(e)=> {
  e.preventDefault();
  const user_input = {email: $('.login-email').val(), password:$('.login-password').val()}
  logIn(user_input)
})

});