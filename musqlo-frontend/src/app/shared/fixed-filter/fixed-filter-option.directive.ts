import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appFixedFilterOption]'
})
export class FixedFilterOptionDirective {

  constructor(public templateRef: TemplateRef<unknown>) { }

}
