import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-dropdown',
  templateUrl: './button-dropdown.component.html',
  styleUrls: ['./button-dropdown.component.css']
})
export class ButtonDropdownComponent implements OnInit {
  @Input() items: string[] = [];
  @Output() select = new EventEmitter<string>();
  selectedItem = this.items[0] || "";
  showDropdown = false;

  ngOnInit(): void {
    this.selectedItem = this.items[0] ?? "";
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  clickItem() {
    this.select.emit(this.selectedItem);
  }
  selectItem(item: string) {
    this.selectedItem = item;
    this.showDropdown = false;
    this.clickItem();
  }
}
