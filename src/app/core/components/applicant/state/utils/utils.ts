export function isFormValueEqual(formValue: object, newFormValue: object) {
  const formValueKeys = Object.keys(formValue);
  const newFormValueKeys = Object.keys(newFormValue);

  if (formValueKeys.length !== newFormValueKeys.length) {
    return false;
  }

  for (let key of formValueKeys) {
    if (formValue[key] !== newFormValue[key]) {
      return false;
    }
  }

  return true;
}
