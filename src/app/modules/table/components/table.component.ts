import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core'
import { ApiService, IData0 } from '../../../services/api.service'
import { delay, finalize, Subscription } from 'rxjs'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { FormControl, FormGroup } from '@angular/forms'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
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
	warehousesMap: any
	dis = ['hi', 'hi2', 'h3', 'h4']
	range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null)
	})
	constructor(private apiService: ApiService, private router: Router) {}

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
								items: [],
								totalQty: 0
							})
						}
						let uniqueOffice = this.mapUniqueOffice.get(elem.office_id)
						uniqueOffice.totalQty += elem.qty
						uniqueOffice.items.push(elem)
					})

					return elem
				})
		)
	}

	onClick(elem: any) {
		if (this.currentOffice !== elem) {
			this.currentOffice = elem
			this.isLoading = true
			let map = new Map()
			let warehouses$ = this.apiService.getDataWithParameter(`office_id=${elem.key}`)

			this.sub.push(
				warehouses$
					.pipe(
						finalize(() => {
							this.isLoading = false
						})
					)
					.subscribe((data) => {
						console.log(data)

						data.forEach((item) => {
							if (!map.has(item.wh_id)) {
								map.set(item.wh_id, {
									wh_id: item.wh_id,
									items: [],
									totalQty: 0
								})
							}

							const warehouses = map.get(item.wh_id)
							warehouses.totalQty += item.qty
							warehouses.items.push(item)
							console.log(warehouses)
						})
						this.warehousesMap = map
						return data
					})
			)
		}
	}
	getChartOffice(key: any) {
		this.router.navigate(['/charts'], { queryParams: { office_id: `${key}` } })
	}
	ngOnDestroy(): void {
		for (let sub of this.sub) {
			sub?.unsubscribe()
		}
	}
}
