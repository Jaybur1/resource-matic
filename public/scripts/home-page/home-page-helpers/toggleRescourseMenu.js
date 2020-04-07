const toggleResourceMenu = (current) => {
  const list = document.querySelectorAll('.resource-links')
  list.forEach(elem =>{
    $(elem).removeClass('active');
    $(current).addClass('active');
  })
}

export default toggleResourceMenu;