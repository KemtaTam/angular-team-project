import { TableRoutingModule } from './table-routing.module';

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableComponent } from './components/table.component'
import { MatIconModule } from '@angular/material/icon'
import { TableChildComponent } from './components/table-child/table-child.component'
import { MatTableModule } from '@angular/material/table'
import { TableSecondChildComponent } from './components/table-second-child/table-second-child.component'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { ReactiveFormsModule } from '@angular/forms'
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { PreloaderComponent } from './components/preloader/preloader.component'
import { MainContentComponent } from './main-content/main-content.component'
@NgModule({
	declarations: [
		TableComponent,
		TableChildComponent,
		TableSecondChildComponent,
		PreloaderComponent,
		MainContentComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		ReactiveFormsModule,
		TableRoutingModule
	],
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }]
})
export class TableModule {}
