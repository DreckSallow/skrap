import { Component, Input } from '@angular/core';


type IconName = "x" | "+" | "dots-horizontal";

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent {
  @Input({ required: true }) name!: IconName
  @Input() width = "24px"
  @Input() height = "24px"
  @Input() fill = "black"
  @Input() stroke = "none"
}
