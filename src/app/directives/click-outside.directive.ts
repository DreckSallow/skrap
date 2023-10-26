import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class OutlickDirective {
  @Output() outClick = new EventEmitter();
  constructor(
    private el: ElementRef

  ) { }

  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.outClick.emit();
    }
  }

}
