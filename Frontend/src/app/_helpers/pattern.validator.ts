import { AbstractControl, ValidationErrors } from '@angular/forms';

export function PatternValidator(regex: RegExp, error: ValidationErrors) {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value)
      return null;

    const valid = regex.test(control.value);
    return valid ? null : error;
  };
}