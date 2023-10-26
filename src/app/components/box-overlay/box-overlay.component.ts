import { Component, ElementRef, Input, ViewChild } from '@angular/core';

type BoxOverlayMode = "hover" | "click";

@Component({
  selector: 'box-overlay',
  templateUrl: './box-overlay.component.html',
  styleUrls: ['./box-overlay.component.css']
})
export class BoxOverlayComponent {
  @ViewChild("triggerEl") triggerEl!: ElementRef;
  @Input() mode: BoxOverlayMode = "click";
  show = false;

  hidden() {
    this.show = false;
  }
  toggleShow(ev: MouseEvent) {
    ev.stopPropagation(); // To avoid listen in body
    this.show = !this.show;
  }
}
