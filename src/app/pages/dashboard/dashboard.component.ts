import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Query {
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent implements OnInit {
  url: string | null = null;
  queries: Array<Query> = [];
  queryForm = this.fb.group({
    queryName: ["", [Validators.required]],
    queryText: ["", Validators.required]
  });
  showDrawer = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.url = params.get("url");
    })
  }

  closeDrawer() {
    this.showDrawer = false;
    this.queryForm.setValue({ queryName: "", queryText: "" });
  }

  toggleDrawer() {
    this.showDrawer = true;
  }
  createQuery() {
    console.log(this.queryForm.value);
  }
}
