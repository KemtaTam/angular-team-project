import { Component, Input } from '@angular/core'
import { finalize, Subscription } from 'rxjs'
import { ApiService } from '../../../shared/services/api.service'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Router } from '@angular/router'
import { DateService } from '../../services/date.service'
import { TableService } from '../../services/table.service'
import { IObj } from '../../interfaces/office'
import { FormControl, FormGroup } from '@angular/forms'

interface Iqty {
	qty: number[]
}

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
	expandedElement?: IObj | null
	isLoading = false
	dataMap?: Map<string, Iqty>
	currentObj?: IObj
	@Input() warehousesMap?: any
	@Input() dateObj?: FormGroup<{
		start: FormControl<Date | null>
		end: FormControl<Date | null>
	}>
	constructor(
		private apiService: ApiService,
		private router: Router,
		private dateService: DateService,
		private tableService: TableService
	) {
		this.displayedColumns = this.tableService.displayedColumns
		this.displayedColumnsWithArrow = this.tableService.displayedColumnsWithArrow
	}

	getData(elem: IObj): void {
		this.expandedElement = this.expandedElement === elem ? null : elem
		if (this.currentObj === elem) return
		if (!this.dateObj) return
		const dateStartStr = this.dateService.getFullDate(this.dateObj?.value.start)
		const dateEndStr = this.dateService.getFullDate(this.dateObj?.value.end)
		this.currentObj = elem
		this.isLoading = true
		const mapWhId = new Map<string, Iqty>()
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
						if (!currentDate) return
						currentDate.qty.push(item.qty)
					})

					this.dataMap = mapWhId
					return data
				})
		)
	}
	getChartWhId(key: number): void {
		this.router?.navigate(['/charts'], { queryParams: { wh_id: `${key}` } })
	}
	ngOnDestroy(): void {
		for (let subscriber of this.sub) {
			subscriber.unsubscribe()
		}
	}
}
