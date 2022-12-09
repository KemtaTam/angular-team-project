import { Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { DateService } from '../services/date.service'
import { ApiService, IData0 } from '../../shared/services/api.service'
import { finalize, map, Observable, Subscription } from 'rxjs'
import { IOffice, Iwarehouse } from '../interfaces/interfaces'

@Component({
	selector: 'app-main-content',
	templateUrl: './main-content.component.html',
	styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
	sub: Subscription[] = []
	minDate = this.getMinMax().sixMonthAgo
	maxDate = this.getMinMax().today
	uniqueOfficeArr: IOffice[] = []
	range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null)
	})
	isLoading = false

	constructor(private apiService: ApiService, private dateService: DateService) {}
	getMinMax(): { today: Date; sixMonthAgo: Date } {
		const today = new Date()
		const sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
		return {
			today,
			sixMonthAgo
		}
	}

	getData(): void {
		this.dateService.setCurrentDate(this.range.value.start, this.range.value.end)

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
	// makeSub() {
	// 	const dateStart = this.dateService.getDate()?.dateStart
	// 	const dateEnd = this.dateService.getDate()?.dateEnd
	// 	const uniqueMap = new Map<number, IOffice>()
	// 	let filterObj$
	// 	if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
	// 		if (dateStart && dateEnd)
	// 			filterObj$ = this.apiService.getDataWithParameter({ dt_date_gte: dateStart, dt_date_lte: dateEnd })
	// 	} else {
	// 		filterObj$ = this.apiService.getData0()
	// 	}
	// 	if (!filterObj$) return
	//
	// 	this.sub.push(
	// 		filterObj$
	// 			.pipe(
	// 				finalize(() => {
	// 					this.isLoading = false
	// 				}),
	// 				map((dataArr) => {
	// 					dataArr.forEach((data) => {
	// 						if (!uniqueMap.has(data.office_id)) {
	// 							uniqueMap.set(data.office_id, {
	// 								office_id: data.office_id,
	// 								totalQty: 0
	// 							})
	// 						}
	// 						const warehouses = uniqueMap.get(data.office_id)
	// 						if (!warehouses) return
	// 						warehouses.totalQty += data.qty
	// 					})
	// 				})
	// 			)
	// 			.subscribe((item) => {
	// 				this.uniqueOfficeArr = [...uniqueMap.values()]
	// 				return item
	// 			})
	// 	)
	// }
	// makeSub(observable: Observable<IData0[]>): void {}
	ngOnDestroy(): void {
		for (let subscriber of this.sub) {
			subscriber.unsubscribe()
		}
	}
}
