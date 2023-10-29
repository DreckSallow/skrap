import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Extractor } from 'src/deps/extractor/pkg';
import { QueryGroup, QueryInfo } from 'src/utils';
const extractor = import("src/deps/extractor/pkg");

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent implements OnInit {
  url: string | null = null;
  queriesList: QueryGroup[] = [];
  extractor: null | Extractor = null;

  constructor(
    private route: ActivatedRoute,
  ) { }

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

  queryData(selector: string, parentSelector?: string | null) {
    const val = parentSelector ? parentSelector.concat(" ", selector) : selector;
    return this.extractor?.query(val);
  }

  queryDataMut([i, entryI]: [number, number], selector: string) {
    const groupQuery = this.queriesList.at(i);
    const queryInfo = groupQuery?.getQuery(entryI);
    if (queryInfo == undefined && queryInfo == undefined) return;
    let result: string | undefined;
    if (this.queriesList[i].type == "list") {
      result = this.queryData(selector, groupQuery?.parentSelector) ?? "No data";
    } else {
      result = this.queryData(selector);
    }
    this.queriesList[i].getQuery(entryI)!.result = result ?? null;
  }

  queryCount(el: EventTarget | null, i: number) {
    const val = (el as HTMLInputElement)?.value;
    const result = this.extractor?.query_all_count(val);
    this.queriesList[i].parentSelector = val;
    const selectors = this.queriesList[i].queries.map(({ selector }) => selector.value);
    selectors.forEach((selector, entryI) => {
      if (!selector) return;
      this.queryDataMut([i, entryI], selector);
    })
    this.queriesList[i].count = result ?? 0;
  }

  queryHtml(ev: Event, index: number, entryI: number) {
    if (!this.extractor || !ev.currentTarget) return;
    const value = (ev.currentTarget as HTMLInputElement).value;
    this.queryDataMut([index, entryI], value);
  }

  toggleQueryInfo(el: EventTarget | null) {
    let queryIndex = (el as HTMLElement | null)?.getAttribute("query-box-index");
    if (!queryIndex) return;
    this.queriesList[Number(queryIndex)].open = !this.queriesList[Number(queryIndex)].open
  }

  toggleType(i: number) {
    this.queriesList[i].toggleType();
    const selectors = this.queriesList[i].queries.map(({ selector }) => selector.value);
    selectors.forEach((selector, entryI) => {
      this.queryDataMut([i, entryI], selector ?? "");
    })
  }

  queyMenu(action: "remove" | "clean", qi: number) {
    if (action == "remove") this.queriesList.splice(qi, 1);
    else if (action == "clean") this.queriesList[qi].removeAllQueries();
  }

  newEntryQuery(index: number) {
    this.queriesList[index].addQuery(new QueryInfo(""))
  }

  addQuery() {
    const queryGroup = new QueryGroup("Nuevo", true, "group");
    queryGroup.addQuery(new QueryInfo(""));
    this.queriesList.push(queryGroup);
  }

  removeEntry(i: number, entryI: number) {
    this.queriesList[i].removeQuery(entryI);
  }
}
