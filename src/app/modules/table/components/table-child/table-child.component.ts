import { Component, Input } from '@angular/core'
import { finalize, Subscription } from 'rxjs'
import { ApiService, IData0 } from '../../../../services/api.service'
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
	selector: 'app-table-child',
	templateUrl: './table-child.component.html',
	styleUrls: ['./table-child.component.scss'],
	animations: [
		trigger('detailExpand1', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class TableChildComponent {
	sub: Subscription[] = []

	displayedColumns: string[] = ['office_id', 'wh_id', 'dt_date', 'qty']
	clickedRows = new Set<IData0>()
	expandedElement: any
	expandedElementTwo: any
	currentOffice: any
	isLoadingTwo: any
	isLoading = false
	pushBuiltInArr: any
	@Input() builtInArr?: any
	constructor(private apiService: ApiService) {}

	ngAfterViewInit(): void {}
	onClick(elem: any) {
		if (this.currentOffice !== elem) {
			this.currentOffice = elem
			this.isLoadingTwo = true
			let warehousesSet = new Set()
			let warehouses$ = this.apiService.getWarehouses(`office_id=${elem.key}&wh_id=${elem.wh_id}`)
			this.sub.push(
				warehouses$
					.pipe(
						finalize(() => {
							this.isLoadingTwo = false
						})
					)
					.subscribe((data) => {
						console.log(data)
						data.forEach((item) => warehousesSet.add(item.wh_id))
						console.log(warehousesSet)
						this.pushBuiltInArr = Array.from(warehousesSet)
						return data
					})
			)
		}
	}
}
