import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements AfterViewInit {
  urlForm = this.fb.group({
    url: ["", [Validators.required, Validators.pattern('https?://.+')]]
  });
  @ViewChild("inputUrl") inputUrl!: ElementRef<HTMLInputElement>;
  constructor(private fb: FormBuilder, private route: Router) { };

  ngAfterViewInit() {
    this.inputUrl.nativeElement.focus();
  }

  onSubmit() {
    if (!this.urlForm.valid) return;
    console.log(this.urlForm.value);
    console.log({ valid: this.urlForm.status });
    this.route.navigate(["/dashboard"], { queryParams: { url: this.urlForm.get("url")?.value } })
  }
}
