import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Extractor } from 'src/deps/extractor/pkg';
const extractor = import("src/deps/extractor/pkg");

interface Query {
  name: string;
  selector: string;
}


const getHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Shop</title>
</head>
<body>
    <nav>NAVBAR <span>TITLE</span></nav>
    <header>
        <h1>Welcome to Our Shop</h1>
    </header>

    <div class="product">
        <img src="product1.jpg" alt="Product 1">
        <h2>Product 1</h2>
        <p>Price: $19.99</p>
        <button>Add to Cart</button>
    </div>

    <div class="product">
        <img src="product2.jpg" alt="Product 2">
        <h2>Product 2</h2>
        <p>Price: $24.99</p>
        <button>Add to Cart</button>
    </div>

    <div class="product">
        <img src="product3.jpg" alt="Product 3">
        <h2>Product 3</h2>
        <p>Price: $29.99</p>
        <button>Add to Cart</button>
    </div>

    <footer>
        &copy; 2023 Simple Shop
    </footer>
</body>
</html>
`

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

  toggleDrawer() {
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
