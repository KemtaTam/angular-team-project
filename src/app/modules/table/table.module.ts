import { RouterModule } from '@angular/router';
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

@NgModule({
	declarations: [TableComponent, TableChildComponent, TableSecondChildComponent],
	imports: [
		CommonModule,
		MatIconModule,
		MatTableModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{path: 'table', component: TableComponent}
		]),
	],
	exports: [
		TableComponent
	]
})
export class TableModule {}
