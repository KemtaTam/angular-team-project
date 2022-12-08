import { Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { DateService } from '../services/date.service'
import { ApiService } from '../../shared/services/api.service'
import { finalize, Observable, Subscription } from 'rxjs'
interface Office {
	officeId: number
	totalQty: number
}
interface MinMax {
	today: Date
	sixMonthAgo: Date
}
@Component({
	selector: 'app-main-content',
	templateUrl: './main-content.component.html',
	styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {
	minDate = this.getMinMax().sixMonthAgo
	maxDate = this.getMinMax().today
	mapUniqueOffice = new Map<number, Office>()
	range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null)
	})
	sub: Subscription[] = []
	isLoading = false

	constructor(private apiService: ApiService, private dateService: DateService) {}
	getMinMax(): MinMax {
		const today = new Date()
		const sixMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 6))
		return {
			today,
			sixMonthAgo
		}
	}

	getData(): void {
		this.mapUniqueOffice = new Map<number, Office>()
		const dateStart = this.dateService.getDate(this.range.value.start, this.range.value.end)?.dateStart
		const dateEnd = this.dateService.getDate(this.range.value.start, this.range.value.end)?.dateEnd
		let filterObj$
		if (this.dateService.isCorrectFilterDate(dateStart, dateEnd)) {
			filterObj$ = this.apiService.getDataWithParameter(`dt_date_gte=${dateStart}&dt_date_lte=${dateEnd}`)
		} else {
			filterObj$ = this.apiService.getData1()
		}
		console.log('TERTRRE')
		this.makeSub(filterObj$)
	}

	makeSub(observable: Observable<any>): void {
		this.sub.push(
			observable
				.pipe(
					finalize(() => {
						this.isLoading = false
					})
				)
				.subscribe((item) => {
					item.forEach((elem: any) => {
						if (!this.mapUniqueOffice.has(elem.office_id)) {
							this.mapUniqueOffice.set(elem.office_id, {
								officeId: elem.office_id,
								totalQty: 0
							})
						}
						console.log(elem)
						let uniqueOffice = this.mapUniqueOffice.get(elem.office_id)
						if (!uniqueOffice) return
						uniqueOffice.totalQty += elem.qty
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
