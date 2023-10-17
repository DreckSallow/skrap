import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent {
  @Input() title: string | null = null;
  @Input() show = false;
  @Output() showChange = new EventEmitter<boolean>();

  closeDrawer() {
    this.show = false;
    this.showChange.emit(this.show);
  }
}
