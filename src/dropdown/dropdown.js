import './dropdown.css';

document.querySelectorAll('.dropdown > button').forEach(dropdownButton => dropdownButton.addEventListener('click', event => event.target.parentElement.classList.toggle('open')))
