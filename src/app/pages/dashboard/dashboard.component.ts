import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export default class DashboardComponent implements OnInit {
  url: string | null = null;
  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.url = params.get("url");
    })
  }
}
