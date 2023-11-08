import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Extractor } from 'src/deps/extractor/pkg';
import { environment } from "src/environments/environment";
//TODO: Find another way to use wasm files.
//While not remove the below line, this is used to load wasm firstly. :v
import("src/deps/extractor/pkg");

interface Info {
  status: "loading" | "error" | "success";
  message: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent implements OnInit {
  info: Info = {
    message: "",
    status: "loading"
  }
  urlForm = new FormGroup({
    url: new FormControl("", Validators.required)
  });
  extractor: null | Extractor = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const url = params.get("url");
      this.urlForm.setValue({ url });
      if (!url) {
        return this.setInfo("error", "Enter a valid url before to continue.")
      }
      this.createExtractor(url);
    })
  }
  private setInfo(status: Info["status"], message: Info["message"]) {
    this.info.message = message;
    this.info.status = status;
  }

  createExtractor(url: string) {
    this.setInfo("loading", "Loading data...");
    fetch(`${environment.apiUrl}?url=${url}`).then(async (r) => {
      this.extractor = Extractor.new(await r.text());
      this.setInfo("success", "");
    }).catch((_e) => {
      this.setInfo("error", "An error ocurred. Try reload or enter a valid url :).")
    })
  }

  changeUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { url: this.urlForm.value.url },
    });
  }
}
