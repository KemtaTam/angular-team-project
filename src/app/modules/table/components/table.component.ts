import { AfterViewInit, Component, OnDestroy } from '@angular/core'
import { ApiService, IData0 } from '../../../services/api.service'
import { delay, finalize, Subscription } from 'rxjs'
import { animate, state, style, transition, trigger } from '@angular/animations'
@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		])
	]
})
export class TableComponent implements AfterViewInit, OnDestroy {
	sub: Subscription[] = []
	data0: IData0[] = []
	mapUniqueOffice: any = new Map()
	displayedColumns: string[] = ['office_id', 'wh_id', 'dt_date', 'qty']
	expandedElement: any
	clickedRows = new Set<IData0>()
	isIntervalPassed = false
	currentOffice?: IData0 | null
	builtInArr: any = []
	expandedElementTwo: any
	isLoading = false
	dis = ['hi', 'hi2', 'h3', 'h4']
	constructor(private apiService: ApiService) {}

	ngAfterViewInit(): void {
		this.sub.push(
			this.apiService
				.getData0()
				.pipe(
					finalize(() => {
						this.isLoading = false
					})
				)
				.subscribe((elem) => {
					this.data0 = elem
					this.data0.forEach((elem) => {
						if (!this.mapUniqueOffice.has(elem.office_id)) {
							this.mapUniqueOffice.set(elem.office_id, {
								officeId: elem.office_id,
								items: []
							})
						}
						let result = this.mapUniqueOffice.get(elem.office_id)
						result.items.push(elem)
					})

					return elem
				})
		)

		console.log(this.mapUniqueOffice)
	}
	onClick(elem: any) {
		if (this.currentOffice !== elem) {
			this.currentOffice = elem
			this.isLoading = true
			let warehousesSet = new Set()
			let warehouses$ = this.apiService.getWarehouses(`office_id=${elem.key}`)
			this.sub.push(
				warehouses$
					.pipe(
						finalize(() => {
							this.isLoading = false
						})
					)
					.subscribe((data) => {
						console.log(data)
						data.forEach((item) => warehousesSet.add(item.wh_id))
						this.builtInArr = Array.from(warehousesSet)
						return data
					})
			)
		}
	}
	ngOnDestroy(): void {
		for (let sub of this.sub) {
			sub?.unsubscribe()
		}
	}
}
