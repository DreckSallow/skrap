import { FormControl } from "@angular/forms";

export type QueryGroupType = "group" | "list";

export class QueryGroup {
  name: string;
  open: boolean;
  type: QueryGroupType;
  count: number;
  private _parentSelector: FormControl<string> | null;
  private _queries: Array<QueryInfo>;
  constructor(name: string, open: boolean, type: QueryGroupType) {
    this.name = name;
    this.open = open;
    this.type = type;
    this.count = 0;
    this._queries = [];
    if (this.type == "list") this._parentSelector = new FormControl("") as FormControl<string>;
    else this._parentSelector = null;
  }
  get parentSel() {
    return this._parentSelector
  }
  get parentSelector() {
    return this._parentSelector?.value ?? null;
  }
  set parentSelector(val: string | null) {
    this._parentSelector = typeof val === "string" ? new FormControl(val) as FormControl<string> : null;
  }
  get queries() {
    return this._queries
  }
  toggleType() {
    const queryType = this.type;
    if (queryType === "group") {
      this.type = "list";
      this.parentSelector = "";
    }
    else {
      this.type = "group";
      this._parentSelector = null
    }
  }

  getQuery(i: number) {
    return this._queries.at(i) ?? null;
  }
  addQuery(query: QueryInfo) {
    this._queries.push(query);
  }
  removeQuery(i: number) {
    return this._queries.splice(i, 1).at(0) ?? null;
  }
  removeAllQueries() {
    this._queries = [];
  }
  toggleOpen() {
    this.open = !this.open;
  }
}


export class QueryInfo {
  name: FormControl<string>;
  selector: FormControl<string>;
  result: string | null
  constructor(name: string) {
    this.name = new FormControl(name) as FormControl<string>;
    this.selector = new FormControl("") as FormControl<string>;
    this.result = null;
  }
}