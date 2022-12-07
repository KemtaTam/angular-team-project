import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core'
import { ApiService, IData0 } from '../../services/api.service'
import { delay, finalize, Observable, Subscription } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { FormControl, FormGroup, Validators } from '@angular/forms'
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
	currentObj?: IData0 | null
	builtInArr: any = []
	isLoading = false
	warehousesMap: any
	range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null)
	})

	minDate = this.getMinMax().sixMonthAgo
	maxDate = this.getMinMax().today
	isFilter = false
	constructor(private apiService: ApiService, private router: Router) {}

	ngAfterViewInit(): void {
		this.mapUniqueOffice = new Map()
		this.isFilter = true

		const dateStart = this.getDate()?.dateStart
		const dateEnd = this.getDate()?.dateEnd
		let filterObj$

		if (this.isCorrectFilterDate()) {
			console.log(dateStart, dateEnd)
			filterObj$ = this.apiService.getDataWithParameter(`dt_date_gte=${dateStart}&dt_date_lte=${dateEnd}`)
		} else {
			filterObj$ = this.apiService.getData1()
		}
		this.makeSub(filterObj$)
	}
	getMinMax() {
		const today = new Date()

		const sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
		console.log(today, sixMonthAgo)
		return {
			today,
			sixMonthAgo
		}
	}
	onClick(elem: any) {
		if (this.currentObj !== elem) {
			const dateStart = this.getDate()?.dateStart
			const dateEnd = this.getDate()?.dateEnd
			console.log(dateStart, dateEnd)
			this.currentObj = elem
			this.isLoading = true
			let warehousesMap = new Map()
			let warehouses$
			if (this.isCorrectFilterDate()) {
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
	getData() {
		this.mapUniqueOffice = new Map()
		const dateStart = this.getDate()?.dateStart
		const dateEnd = this.getDate()?.dateEnd
		console.log('Date = ', dateStart, dateEnd)
		let filterObj$
		if (this.isCorrectFilterDate()) {
			filterObj$ = this.apiService.getDataWithParameter(`dt_date_gte=${dateStart}&dt_date_lte=${dateEnd}`)
		} else {
			filterObj$ = this.apiService.getData1()
		}
		this.makeSub(filterObj$)
	}
	makeSub(observable: Observable<any>) {
		this.sub.push(
			observable.subscribe((elem: any) => {
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
	isCorrectFilterDate() {
		if (!(this.range.value.start && this.range.value.end)) return false
		return true
	}

	getDate() {
		const startDate = this.range.value.start
		const endDate = this.range.value.end
		if (!(startDate && endDate)) return
		const dateStartStr = this.getFullDate(startDate)
		const dateEndStr = this.getFullDate(endDate)

		return {
			dateStart: dateStartStr,
			dateEnd: dateEndStr
		}
	}

	getFullDate(date: Date): string {
		if (!date) return ''
		let day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
		let rightMonth = date.getMonth() + 1 > 12 ? 1 : date.getMonth() + 1
		let month = rightMonth < 10 ? `0${rightMonth}` : rightMonth
		let year = date.getFullYear()
		return `${year + '-' + month + '-' + day}`
	}
	ngOnDestroy(): void {
		for (let sub of this.sub) {
			sub?.unsubscribe()
		}
	}
}
