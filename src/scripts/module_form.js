(function(){
  document.addEventListener("DOMContentLoaded", function(event) {
    let fields = document.querySelectorAll('.input-text');

    fields.forEach((item, index, fields) => {
      item.onfocus = function() {
        if (this.classList.contains('input-text')) {
          item.closest('.form__field').classList.add('input-filled');
        }
      };
      item.onblur = function() {
        console.log(item.value);
        if ((item.value == "") && this.closest('.form__field').classList.contains('input-filled')) {
          this.closest('.form__field').classList.remove('input-filled');
        }
      };
    });

    let btnRegister = document.getElementById('btn-register');
    let popupRegister = document.getElementById('popup-register');
    let close = document.getElementById('close-register');
    btnRegister.addEventListener('click', () =>{
      popupRegister.classList.add('popup__active')
    });
    
    close.addEventListener('click', () =>{
      popupRegister.classList.remove('popup__active');
    });

  });
})()