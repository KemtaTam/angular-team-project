import { Component, Input, OnInit } from '@angular/core'
import { animate, state, style, transition, trigger } from '@angular/animations'

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
export class TableSecondChildComponent implements OnInit {
	@Input() uniqueMap?: any

	displayedColumns: string[] = ['office_id', 'wh_id', 'dt_date', 'qty']
	expandedElementTwo: any
	ngOnInit() {}
	onClick(elem: any) {}
}
