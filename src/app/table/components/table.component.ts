
import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core'
import { ApiService, IData0 } from '../../shared/services/api.service'
import { delay, finalize, Observable, Subscription } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { DateService } from '../services/date.service'
import { TableService } from '../services/table.service'

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
	displayedColumns: string[]
	displayedColumnsWithArrow: string[]
	expandedElement: any
	currentObj?: IData0 | null
	isLoading = false
	warehousesMap: any
	@Input() dateObj?: any
	@Input() officeMap?: any
	constructor(
		private apiService: ApiService,
		private router: Router,
		private dateService: DateService,
		private tableService: TableService
	) {
		this.displayedColumns = this.tableService.displayedColumns
		this.displayedColumnsWithArrow = this.tableService.displayedColumnsWithArrow
	}

	ngAfterViewInit(): void {
		this.officeMap = new Map()

		const dateStart = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateStart
		const dateEnd = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateEnd
		let filterObj$

		if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
			console.log(dateStart, dateEnd)
			filterObj$ = this.apiService.getDataWithParameter(`dt_date_gte=${dateStart}&dt_date_lte=${dateEnd}`)
		} else {
			filterObj$ = this.apiService.getData1()
		}
		this.makeSub(filterObj$)
	}

	onClick(elem: any) {
		if (this.currentObj !== elem) {
			const dateStart = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateStart
			const dateEnd = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateEnd
			console.log(dateStart, dateEnd)
			this.currentObj = elem
			this.isLoading = true
			let warehousesMap = new Map()
			let warehouses$
			if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
				console.log(dateStart, dateEnd)
				warehouses$ = this.apiService.getDataWithParameter(
					`office_id=${elem.key}&dt_date_gte=${dateStart}&dt_date_lte=${dateEnd}`
				)
			} else {
				warehouses$ = this.apiService.getDataWithParameter(`office_id=${elem.key}`)
			}

			this.sub.push(
				warehouses$
					.pipe(
						finalize(() => {
							this.isLoading = false
						})
					)
					.subscribe((data: any) => {
						data.forEach((item: any) => {
							if (!warehousesMap.has(item.wh_id)) {
								warehousesMap.set(item.wh_id, {
									wh_id: item.wh_id,
									items: [],
									totalQty: 0
								})
							}

							const warehouses = warehousesMap.get(item.wh_id)
							warehouses.totalQty += item.qty
							warehouses.items.push(item)
						})
						this.warehousesMap = warehousesMap
						return data
					})
			)
		}
	}
	getChartOffice(key: any) {
		this.router.navigate(['/charts'], { queryParams: { office_id: `${key}` } })
	}

	makeSub(observable: Observable<any>) {
		this.sub.push(
			observable
				.pipe(
					finalize(() => {
						this.isLoading = false
					})
				)
				.subscribe((item: any) => {
					item.forEach((elem: any) => {
						if (!this.officeMap.has(elem.office_id)) {
							this.officeMap.set(elem.office_id, {
								officeId: elem.office_id,
								items: [],
								totalQty: 0
							})
						}
						let uniqueOffice = this.officeMap.get(elem.office_id)
						uniqueOffice.totalQty += elem.qty
						uniqueOffice.items.push(elem)
					})
					return item
				})
		)
	}

	ngOnDestroy(): void {
		for (let sub of this.sub) {
			sub?.unsubscribe()
		}
	}
}
