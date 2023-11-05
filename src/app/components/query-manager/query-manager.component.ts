import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Extractor } from 'src/deps/extractor/pkg/extractor';
import { QueryGroup, QueryGroupType, QueryInfo } from 'src/utils';

interface QueriesGroupJson {
  [k: string]: {
    selector: string;
    data: string | null;
  }
}

interface QueryGroupJson {
  [k: string]: {
    type: QueryGroupType;
    parentSelector: string | null;
    info: QueriesGroupJson | Array<QueriesGroupJson>;
  }
}

@Component({
  selector: 'app-query-manager',
  templateUrl: './query-manager.component.html',
  styleUrls: ['./query-manager.component.css']
})
export class QueryManagerComponent {
  @Input({ required: true }) extractor!: Extractor | null;
  queriesList: QueryGroup[] = [];
  queryForm = {
    show: false,
    form: new FormGroup({
      name: new FormControl("", Validators.required),
      type: new FormControl("group")
    })
  };

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

  toggleType(_ev: Event, i: number) {
    // ev.stopPropagation();
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

  createQuery() {
    if (!this.queryForm.form.valid) return;
    const { name, type } = this.queryForm.form.value;
    if (name == undefined && type == undefined) return;
    const queryGroup = new QueryGroup(name as string, true, type as QueryGroupType);
    this.queriesList.push(queryGroup);
    this.cleanQueryForm();
  }

  removeEntry(i: number, entryI: number) {
    this.queriesList[i].removeQuery(entryI);
  }

  closeModal(event: Event) {
    const target = event.target;
    const currentTarget = event.currentTarget;
    if (target == currentTarget) {
      this.cleanQueryForm();
    }
  }

  cleanQueryForm() {
    this.queryForm.show = false;
    this.queryForm.form.setValue({ name: "", type: "group" });
  }

  downloadInfo() {
    const data: QueryGroupJson = {};
    this.queriesList.forEach((group) => {
      let info: any;
      if (group.type === "group") {
        info = group.queries.reduce((acc, query) => {
          acc[query.name.value] = {
            selector: query.selector.value,
            data: query.result
          }
          return acc;
        }, {} as QueriesGroupJson);
      } else {
        info = [];
        const groupSelectors = group.queries.reduce((acc, q) => {
          acc[q.name.value] = q.selector.value;
          return acc;
        }, {} as { [k: string]: string });

        const results: any[] = this.extractor?.query_all(group.parentSelector ?? "", groupSelectors);
        console.log("RESULTS: ", results);
        for (let i = 0; i < group.count; i++) {
          // info.push({
          //   selector:
          // })
          const obj = group.queries.reduce((acc, query) => {
            acc[query.name.value] = {
              selector: query.selector.value,
              data: results[i][query.name.value]
            }
            return acc;
          }, {} as QueriesGroupJson);
          info.push(obj);
        }
      }
      data[group.name] = {
        type: group.type,
        parentSelector: group.parentSelector,
        info
      }
    });

    // Download data
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = "skrap-data.json";
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }
}
