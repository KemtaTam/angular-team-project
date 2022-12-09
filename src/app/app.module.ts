import { MatNativeDateModule } from '@angular/material/core'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'

import { SharedModule } from './shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
	declarations: [AppComponent],
	providers: [],
	bootstrap: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatNativeDateModule,
		SharedModule
	]
})
export class AppModule {}
