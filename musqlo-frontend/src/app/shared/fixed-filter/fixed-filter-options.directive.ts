import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appFixedFilterOptions]'
})
export class FixedFilterOptionsDirective {

  constructor(public templateRef: TemplateRef<unknown>) { }

}
