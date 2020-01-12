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
        if ((item.value == "") && this.closest('.form__field').classList.contains('input-filled')) {
          this.closest('.form__field').classList.remove('input-filled');
        }
      };
    });

    const btnRegister = document.getElementById('btn-register');
    const popupRegister = document.getElementById('popup-register');
    const close = document.getElementById('close-register');
    btnRegister.addEventListener('click', () =>{
      popupRegister.classList.add('popup__active')
    });
    close.addEventListener('click', () =>{
      popupRegister.classList.remove('popup__active');
    });

    const formRegister = document.querySelector('#form-register');
    const sendFormResister = document.querySelector('#send-form-register');
    sendFormResister.addEventListener('click', e => {
      e.preventDefault();
      if (validateForm(formRegister)){
        const data ={
          objective: formRegister.elements.objective.value,
          campus: formRegister.elements.campus.value,
          date: formRegister.elements.date.value,
          name: formRegister.elements.name.value,
          lastname: formRegister.elements.lastname.value,
          email: formRegister.elements.email.value,
          // subscribe: formRegister.elements.subscribe.value,
        }
        // console.log(data);
        const xhr = new XMLHttpRequest;
        xhr.responseType = 'json';
        xhr.open('POST', 'http://localhost:3000');
        xhr.send(JSON.stringify(data));
        console.log(data);
        xhr.addEventListener('load', ()=>{
          if(xhr.response.status){
            console.log('Ok');
          }
        })
      }
    })
    function validateForm(form){
      let valid = true;

      if(!validateField(form.elements.objective)){
        valid = false;
      }
      if(!validateField(form.elements.campus)){
        valid = false;
      }
      if(!validateField(form.elements.date)){
        valid = false;
      }
      if(!validateField(form.elements.name)){
        valid = false;
      }
      if(!validateField(form.elements.lastname)){
        valid = false;
      }
      if(!validateField(form.elements.email)){
        valid = false;
      }
      // if(!validateField(form.elements.subscribe)){
      //   valid = false;
      // }
      return valid;
    }

    function validateField(field){
        // field.nextElementSibling.textContent = field.validationMessage;
        // return field.checkValidity();
        let iconNoValid= field.parentElement.querySelector('.form__icon__exclamation');
        let iconValid= field.parentElement.querySelector('.form__icon__correct');
        if(!field.checkValidity()){
          field.nextElementSibling.textContent = field.validationMessage;
          iconNoValid.classList.add('form__icon__active');
          iconValid.classList.remove('form__icon__active');
          
          return false;
        } else{
          field.nextElementSibling.textContent = "";
          iconValid.classList.add('form__icon__active');
          iconNoValid.classList.remove('form__icon__active');

          return true;
        }
    }

  });
})()