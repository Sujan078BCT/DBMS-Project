function validate(form) {
  console.log('validate');
  mobileField = document.getElementById('mobile');
  // check if mobile is valid with regex
  if (!mobileField.value.match(/^977[0-9]{10}$/)) {
    mobileField.setCustomValidity(
      'Mobile number must be 13 digits in the format 977XXXXXXXXXX'
    );
    mobileField.reportValidity();
    mobileField.style.borderColor = 'red';
    mobileField.focus();
    return false;
  }
  mobileField.setCustomValidity('');
  mobileField.style.borderColor = 'green';
  return true;
}
