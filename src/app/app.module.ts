import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage, DashboardPage } from './pages/';
import { DrawerComponent } from './components/drawer/drawer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    DashboardPage,
    DrawerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
