import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Extractor } from 'src/deps/extractor/pkg';
const extractor = import("src/deps/extractor/pkg");

interface Query {
  name: string;
  selector: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', "./query_form.css"]
})
export default class DashboardComponent implements OnInit {
  url: string | null = null;
  queries: Array<Query> = [];
  queryForm = this.fb.group({
    queryName: ["", [Validators.required]],
    queryText: ["", Validators.required]
  });
  showDrawer = false;
  queryResult = "";
  extractor: null | Extractor = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    extractor.then(({ Extractor }) => {
      console.log("LOADED!");
      fetch(`http://localhost:8000/skrap?url=${this.url}`).then(async (r) => {
        this.extractor = Extractor.new(await r.text());
      }).catch((e) => {
        console.log("ERROR FETCHING: ", e);
      })
    }).catch(() => {
      console.log("Error loading wasm.");
    });
    this.route.queryParamMap.subscribe((params) => {
      this.url = params.get("url");
    })
  }

  closeDrawer() {
    this.showDrawer = false;
    this.queryForm.setValue({ queryName: "", queryText: "" });
    this.queryResult = "";
  }

  displayDrawer() {
    this.showDrawer = true;
  }

  queryHtml(value: string) {
    if (!this.extractor) return;
    const result = this.extractor.query(value);
    if (result) {
      this.queryResult = result
    } else {
      this.queryResult = "Not Data."
    }
  }

  createQuery() {
    if (!this.queryForm.valid) return;
    this.queries.push({
      name: this.queryForm.value.queryName as string,
      selector: this.queryForm.value.queryText as string
    });
    this.closeDrawer();
  }
}
