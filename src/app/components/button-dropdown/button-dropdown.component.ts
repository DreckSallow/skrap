import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-dropdown',
  templateUrl: './button-dropdown.component.html',
  styleUrls: ['./button-dropdown.component.css']
})
export class ButtonDropdownComponent {
  @Input() items: string[] = [];
  @Output() select = new EventEmitter<number>();
  @Input() selectedIndex!: number;
  showDropdown = false;
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  get selected() {
    return this.items[this.selectedIndex];
  }
  clickItem() {
    this.select.emit(this.selectedIndex);
  }
  selectItem(index: number) {
    this.selectedIndex = index;
    this.showDropdown = false;
    this.clickItem();
  }
}
