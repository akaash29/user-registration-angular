import { AbstractControl, ValidationErrors } from '@angular/forms';

export function numericValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  // Allow empty values so 'Validators.required' can handle mandatory checking separately
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Check if the value is strictly Not a Number (isNaN)
  const isNotANumber = isNaN(Number(value));
  
  return isNotANumber ? { 'notNumeric': true } : null;
}