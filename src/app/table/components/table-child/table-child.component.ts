import { Component, Input } from '@angular/core'
import { finalize, map, Subscription } from 'rxjs'
import { ApiService } from '../../../shared/services/api.service'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Router } from '@angular/router'
import { DateService } from '../../services/date.service'
import { TableService } from '../../services/table.service'
import { Data, Iwarehouse } from '../../interfaces/interfaces'

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
	displayedColumns: string[]
	displayedColumnsWithArrow: string[]
	expandedElement?: Iwarehouse | null
	isLoading = false
	dataArr: Data[] = []
	currentObj?: Iwarehouse
	@Input() warehousesArr: Iwarehouse[] = []

	constructor(
		private apiService: ApiService,
		private router: Router,
		private dateService: DateService,
		private tableService: TableService
	) {
		this.displayedColumns = this.tableService.displayedColumns
		this.displayedColumnsWithArrow = this.tableService.displayedColumnsWithArrow
	}

	getData(elem: Iwarehouse): void {
		this.expandedElement = this.expandedElement === elem ? null : elem
		if (this.currentObj === elem) return
		const dateStartStr = this.dateService.getDate()?.dateStart
		const dateEndStr = this.dateService.getDate()?.dateEnd

		this.currentObj = elem
		this.isLoading = true
		let data$
		if (dateStartStr && dateEndStr) {
			data$ = this.apiService.getDataWithParameter({
				wh_id: elem.wh_id.toString(),
				dt_date_gte: dateStartStr,
				dt_date_lte: dateEndStr
			})
		} else {
			data$ = this.apiService.getDataWithParameter({ wh_id: elem.wh_id.toString() })
		}

		this.sub.push(
			data$
				.pipe(
					finalize(() => {
						this.isLoading = false
					}),
					map((elem) => {
						return elem.map((data) => {
							return {
								dt_date: data.dt_date,
								qty: data.qty
							}
						})
					})
				)
				.subscribe((data) => {
					this.dataArr = data
					return data
				})
		)
	}
	getChartWhId(wh_id: number): void {
		this.router?.navigate(['/charts'], { queryParams: { wh_id: `${wh_id}` } })
	}
	ngOnDestroy(): void {
		for (let subscriber of this.sub) {
			subscriber.unsubscribe()
		}
	}
}
