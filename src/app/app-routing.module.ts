import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage, HomePage } from './pages';

const routes: Routes = [
  {
    path: "",
    title: "Skrap - website",
    component: HomePage
  },
  {
    path: "dashboard",
    title: "Dashbaord",
    component: DashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
