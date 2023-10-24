import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
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
  queriesList = this.fb.group({
    queries: this.fb.array([
      this.fb.group({
        queryName: [""],
        queryText: [""],
        queryResult: "",
        type: "simple"
      })
    ])
  }, {
    validators: [Validators.required]
  });
  extractor: null | Extractor = null;
  typeOfQueryForm = "simple";

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    extractor.then(({ Extractor }) => {
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

  get queries() {
    return this.queriesList.get("queries") as FormArray
  }

  queryHtml(ev: Event, index: number) {

    if (!this.extractor || !ev.currentTarget) return;
    const result = this.extractor.query((ev.currentTarget as HTMLInputElement).value);
    const copyVal = this.queries.at(index).value;
    this.queries.at(index).setValue({ ...copyVal, queryResult: result ?? "No data" });

    console.log({
      result,
      index
    })
  }

  addQuery() {
    this.queries.push(this.fb.group({
      queryName: [""],
      queryText: [""],
      type: "simple"
    }))
  }
}
