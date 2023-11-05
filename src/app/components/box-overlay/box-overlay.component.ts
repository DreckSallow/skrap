import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'box-overlay',
  templateUrl: './box-overlay.component.html',
  styleUrls: ['./box-overlay.component.css']
})
export class BoxOverlayComponent {
  @ViewChild("triggerEl") triggerEl!: ElementRef;
  @Input() hiddenOnClick: boolean = true;
  @Input() hiddenOnTag: string = "";
  show = false;

  hiddenClick(target: EventTarget | null) {
    const tag = target ? (target as HTMLElement).tagName : "";
    if (this.hiddenOnClick && this.hiddenOnTag == tag) {
      this.hidden();
    }
  }

  hidden() {
    this.show = false;
  }
  toggleShow(ev: MouseEvent) {
    ev.stopPropagation(); // To avoid listen in body
    this.show = !this.show;
  }
}
