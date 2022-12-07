import { Component, Input } from '@angular/core'
import { finalize, Subscription } from 'rxjs'
import { ApiService, IData0 } from '../../../../services/api.service'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { Router } from '@angular/router'

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
	isLoading = false
	dataArrTwo: any = []
	uniqueMap?: any
	currentObj: any
	@Input() builtInArr?: any
	constructor(private apiService: ApiService, private router: Router) {}

	ngAfterViewInit(): void {}
	onClickTwo(elem: any) {
		if (this.currentObj === elem) return
		this.currentObj = elem
		this.isLoading = true
		let mapWhId = new Map()
		let data$ = this.apiService.getDataWithParameter(`wh_id=${elem.key}`)
		this.sub.push(
			data$
				.pipe(
					finalize(() => {
						this.isLoading = false
					})
				)
				.subscribe((data) => {
					data.forEach((item, index) => {
						mapWhId.set(item.dt_date, {
							qty: []
						})
						const currentDate = mapWhId.get(item.dt_date)
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
