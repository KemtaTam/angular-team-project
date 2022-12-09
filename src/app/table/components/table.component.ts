import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core'
import { ApiService, IData0 } from '../../shared/services/api.service'
import { finalize, Observable, Subscription } from 'rxjs'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Router } from '@angular/router'
import { DateService } from '../services/date.service'
import { TableService } from '../services/table.service'
import { IObj, IOffice, Iwarehouse } from '../interfaces/office'
import { FormControl, FormGroup } from '@angular/forms'

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
	expandedElement?: IObj | null
	currentObj?: IObj
	isLoading = false
	warehousesMap?: Map<number, Iwarehouse>

	@Input() dateObj?: FormGroup<{ start: FormControl<Date | null>; end: FormControl<Date | null> }>
	@Input() officeMap!: Map<number, IOffice>

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
		this.officeMap = new Map<number, IOffice>()
		if (!this.dateObj) return
		const dateStart = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateStart
		const dateEnd = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateEnd
		let filterObj$

		if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
			filterObj$ = this.apiService.getDataWithParameter(`dt_date_gte=${dateStart}&dt_date_lte=${dateEnd}`)
		} else {
			filterObj$ = this.apiService.getData0()
		}
		this.makeSub(filterObj$)
	}

	getData(elem: IObj): void {
		this.expandedElement = this.expandedElement === elem ? null : elem
		if (this.currentObj !== elem) {
			if (!this.dateObj) return
			const dateStart = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateStart
			const dateEnd = this.dateService.getDate(this.dateObj.value.start, this.dateObj.value.end)?.dateEnd
			this.currentObj = elem
			this.isLoading = true
			let warehousesMap = new Map<number, Iwarehouse>()
			let warehouses$
			if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
				warehouses$ = this.apiService.getDataWithParameter({
					office_id: elem.key,
					dt_date_gte: dateStart,
					dt_date_lte: dateEnd
				})
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
					.subscribe((data) => {
						data.forEach((item) => {
							if (!warehousesMap.has(item.wh_id)) {
								warehousesMap.set(item.wh_id, {
									wh_id: item.wh_id,
									totalQty: 0
								})
							}

							const warehouses = warehousesMap.get(item.wh_id)
							if (!warehouses) return
							warehouses.totalQty += item.qty
						})
						this.warehousesMap = warehousesMap
						return data
					})
			)
		}
	}
	getChartOffice(key: number): void {
		this.router.navigate(['/charts'], { queryParams: { office_id: `${key}` } })
	}

	makeSub(observable: Observable<IData0[]>): void {
		this.sub.push(
			observable
				.pipe(
					finalize(() => {
						this.isLoading = false
					})
				)
				.subscribe((item: IData0[]) => {
					item.forEach((elem) => {
						if (!this.officeMap.has(elem.office_id)) {
							this.officeMap.set(elem.office_id, {
								office_id: elem.office_id,
								totalQty: 0
							})
						}
						let uniqueOffice = this.officeMap.get(elem.office_id)
						uniqueOffice!.totalQty += elem.qty
					})
					return item
				})
		)
	}

	ngOnDestroy(): void {
		for (let subscriber of this.sub) {
			subscriber.unsubscribe()
		}
	}
}
