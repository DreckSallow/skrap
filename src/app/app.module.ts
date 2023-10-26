import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage, DashboardPage } from './pages/';
import { BoxOverlayComponent, ButtonDropdownComponent, DrawerComponent } from './components';
import { OutlickDirective } from './directives';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    DashboardPage,
    DrawerComponent,
    ButtonDropdownComponent,
    BoxOverlayComponent,
    OutlickDirective
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
