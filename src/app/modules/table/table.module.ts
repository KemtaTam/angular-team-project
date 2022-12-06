import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableComponent } from './components/table.component'
import { TableRoutingModule } from './table.routing.module'
import { MatIconModule } from '@angular/material/icon'
import { TableChildComponent } from './components/table-child/table-child.component'
import { MatTableModule } from '@angular/material/table';
import { TableSecondChildComponent } from './components/table-second-child/table-second-child.component'

@NgModule({
	declarations: [TableComponent, TableChildComponent, TableSecondChildComponent],
	imports: [CommonModule, TableRoutingModule, MatIconModule, MatTableModule]
})
export class TableModule {}
