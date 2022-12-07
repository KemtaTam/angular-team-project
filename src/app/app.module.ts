import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

import { ChartsModule } from './charts/charts.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MatNativeDateModule } from '@angular/material/core'
@NgModule({
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ChartsModule,
		MatNativeDateModule
    ]
})
export class AppModule {}
