import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Extractor } from 'src/deps/extractor/pkg';
const extractor = import("src/deps/extractor/pkg");

interface QueryEntry {
  name: string;
  open: boolean,
  isList: boolean,
  content: Array<{
    name: FormControl<string | null>,
    selector: FormControl<string | null>,
    result: string | null
  }>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent implements OnInit {
  url: string | null = null;
  queriesList: QueryEntry[] = [];
  extractor: null | Extractor = null;
  typesOfQuery = ["group", "array"];

  constructor(
    private route: ActivatedRoute,
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
  queryHtml(ev: Event, index: number, entryI: number) {
    if (!this.extractor || !ev.currentTarget) return;
    const result = this.extractor.query((ev.currentTarget as HTMLInputElement).value);
    this.queriesList[index].content[entryI].result = result ?? null;
  }

  toggleQueryInfo(el: EventTarget | null) {
    let queryIndex = (el as HTMLElement | null)?.getAttribute("query-box-index");
    if (!queryIndex) return;
    this.queriesList[Number(queryIndex)].open = !this.queriesList[Number(queryIndex)].open
  }

  queyMenu(action: "remove" | "clean", qi: number) {
    if (action == "remove") {
      this.queriesList.splice(qi, 1);
    } else if (action == "clean") {
      this.queriesList[qi].content = [];
    }
  }

  newEntryQuery(index: number) {
    this.queriesList[index].content.push({
      name: new FormControl(""),
      selector: new FormControl(""),
      result: null
    })
  }

  addQuery() {
    this.queriesList.push({
      name: "Nuevo",
      open: true,
      isList: false,
      content: [{
        name: new FormControl(""),
        selector: new FormControl(""),
        result: null
      }],
    })
  }

  removeEntry(i: number, entryI: number) {
    this.queriesList[i].content.splice(entryI, 1);
  }
}
