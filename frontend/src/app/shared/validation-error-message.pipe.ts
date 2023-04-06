import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validationErrorMessage',
  pure: false,
})
export class ValidationErrorMessagePipe implements PipeTransform {

  transform(abstractControl: AbstractControl<string | null, string | null> | null, controlName: string): string {
    if (!abstractControl?.invalid || abstractControl.pristine) {
      return controlName;
    }

    if (abstractControl.hasError('required')) {
      return `${controlName} is required`;
    }

    if (abstractControl.hasError('email')) {
      return 'Please provide a valid email';
    }

    if (abstractControl.hasError('minlength')) {
      const { requiredLength } = abstractControl.getError('minlength');
      return `${controlName} must be ${requiredLength} characters long`;
    }

    return 'This field is invalid';
  }

}
