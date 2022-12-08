import { Component, Input } from '@angular/core'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { TableService } from '../../services/table.service'
import { Subscription } from 'rxjs'

@Component({
	selector: 'app-table-second-child',
	templateUrl: './table-second-child.component.html',
	styleUrls: ['./table-second-child.component.scss'],
	animations: [
		trigger('detailExpand1', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class TableSecondChildComponent {
	@Input() dataMap?: any
	sub: Subscription[] = []
	displayedColumns: string[]
	displayedColumnsWithArrow: string[]
	expandedElement?: string

	constructor(private tableService: TableService) {
		this.displayedColumns = this.tableService.displayedColumns
		this.displayedColumnsWithArrow = this.tableService.displayedColumnsWithArrow
	}

	ngOnDestroy(): void {
		for (let subscriber of this.sub) {
			subscriber.unsubscribe()
		}
	}
}
