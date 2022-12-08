import { Component, Input } from '@angular/core'
import { finalize, map, Subscription } from 'rxjs'
import { ApiService, IData0 } from '../../../services/api.service'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Router } from '@angular/router'
import { DateService } from '../../services/date.service'
import { TableService } from '../../services/table.service'

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
	clickedRows = new Set<IData0>()
	expandedElement: any
	isLoading = false
	uniqueMap?: any
	currentObj: any
	@Input() builtInArr?: any
	@Input() dateObj?: any
	constructor(
		private apiService: ApiService,
		private router: Router,
		private dateService: DateService,
		private tableService: TableService
	) {
		this.displayedColumns = this.tableService.displayedColumns
		this.displayedColumnsWithArrow = this.tableService.displayedColumnsWithArrow
	}

	ngAfterViewInit(): void {}
	onClickTwo(elem: any) {
		if (this.currentObj === elem) return
		const dateStartStr = this.dateService.getFullDate(this.dateObj?.value.start)
		const dateEndStr = this.dateService.getFullDate(this.dateObj?.value.end)
		console.log(dateStartStr, dateEndStr)
		this.currentObj = elem
		this.isLoading = true
		let mapWhId = new Map()
		let data$
		if (dateStartStr && dateEndStr) {
			data$ = this.apiService.getDataWithParameter(
				`wh_id=${elem.key}&dt_date_gte=${dateStartStr}&dt_date_lte=${dateEndStr}`
			)
		} else {
			data$ = this.apiService.getDataWithParameter(`wh_id=${elem.key}`)
		}

		this.sub.push(
			data$
				.pipe(
					finalize(() => {
						this.isLoading = false
					})
				)
				.subscribe((data) => {
					data.forEach((item) => {
						let date = item.dt_date
						mapWhId.set(date, {
							qty: []
						})
						const currentDate = mapWhId.get(date)
						currentDate.qty.push(item.qty)
					})

					this.uniqueMap = mapWhId
					return data
				})
		)
	}
	getChartWhId(key: any) {
		console.log(key)
		this.router.navigate(['/charts'], { queryParams: { wh_id: `${key}` } })
	}
	ngOnDestroy(): void {
		for (let sub of this.sub) {
			sub?.unsubscribe()
		}
	}
}
