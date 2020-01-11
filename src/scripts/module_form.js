(function(){
  document.addEventListener("DOMContentLoaded", function(event) {
    let fields = document.querySelectorAll('.input-text');
    let arrFields = [];

    fields.forEach((item, index, fields) => {
      arrFields.push(item);
      
      // let input = arrFields['index'];
      item.onfocus = function() {
        if (this.classList.contains('input-text')) {
          // удаляем индикатор ошибки, т.к. пользователь хочет ввести данные заново
          item.closest('.form__field').classList.add('input-filled');
          // error.innerHTML = 'Пожалуйста, введите правильный email.'
        }
      };
      item.onblur = function() {
        console.log(item.value);
        if ((item.value == "") && this.closest('.form__field').classList.contains('input-filled')) { // не email
          this.closest('.form__field').classList.remove('input-filled');
          // error.innerHTML = "";
        }
      };
    });

  });



})()