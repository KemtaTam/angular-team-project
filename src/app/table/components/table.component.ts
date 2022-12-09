import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core'
import { ApiService, IData0 } from '../../shared/services/api.service'
import { finalize, map, Subscription } from 'rxjs'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Router } from '@angular/router'
import { DateService } from '../services/date.service'
import { TableService } from '../services/table.service'
import { IOffice, Iwarehouse } from '../interfaces/interfaces'

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
	expandedElement?: IOffice | null
	currentObj?: IOffice
	isLoading = false
	warehousesArr: Iwarehouse[] = []
	@Input() uniqueOfficeArr: IOffice[] = []

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
		const dateStart = this.dateService.getDate()?.dateStart
		const dateEnd = this.dateService.getDate()?.dateEnd
		const uniqueMap = new Map<number, IOffice>()
		let filterObj$
		if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
			if (dateStart && dateEnd)
				filterObj$ = this.apiService.getDataWithParameter({ dt_date_gte: dateStart, dt_date_lte: dateEnd })
		} else {
			filterObj$ = this.apiService.getData0()
		}
		if (!filterObj$) return

		this.sub.push(
			filterObj$
				.pipe(
					finalize(() => {
						this.isLoading = false
					}),
					map((dataArr) => {
						dataArr.forEach((data) => {
							if (!uniqueMap.has(data.office_id)) {
								uniqueMap.set(data.office_id, {
									office_id: data.office_id,
									totalQty: 0
								})
							}
							const warehouses = uniqueMap.get(data.office_id)
							if (!warehouses) return
							warehouses.totalQty += data.qty
						})
					})
				)
				.subscribe((item) => {
					this.uniqueOfficeArr = [...uniqueMap.values()]
					return item
				})
		)
	}

	getData(elem: IOffice): void {
		this.expandedElement = this.expandedElement === elem ? null : elem
		if (this.currentObj !== elem) {
			const dateStart = this.dateService.getDate()?.dateStart
			const dateEnd = this.dateService.getDate()?.dateEnd
			this.currentObj = elem
			this.isLoading = true
			let warehousesMap = new Map<number, Iwarehouse>()
			let warehouses$
			if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
				warehouses$ = this.apiService.getDataWithParameter({
					office_id: elem.office_id.toString(),
					dt_date_gte: dateStart + '',
					dt_date_lte: dateEnd + ''
				})
			} else {
				warehouses$ = this.apiService.getDataWithParameter({ office_id: elem.office_id.toString() })
			}

			this.sub.push(
				warehouses$
					.pipe(
						finalize(() => {
							this.isLoading = false
						}),
						map((dataArr) => {
							dataArr.forEach((data) => {
								if (!warehousesMap.has(data.wh_id)) {
									warehousesMap.set(data.wh_id, {
										wh_id: data.wh_id,
										totalQty: 0
									})
								}
								const warehouses = warehousesMap.get(data.wh_id)
								if (!warehouses) return
								warehouses.totalQty += data.qty
							})
						})
					)
					.subscribe((data) => {
						this.warehousesArr = [...warehousesMap.values()]
						return data
					})
			)
		}
	}
	getChartOffice(key: number): void {
		this.router.navigate(['/charts'], { queryParams: { office_id: `${key}` } })
	}

	// makeSub(observable: Observable<IData0[]>): void {}

	ngOnDestroy(): void {
		for (let subscriber of this.sub) {
			subscriber.unsubscribe()
		}
	}
}
