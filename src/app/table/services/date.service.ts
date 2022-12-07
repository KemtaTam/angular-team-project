import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class DateService {
	constructor() {}

	getFullDate(date: Date, local?: 'RU'): string {
		if (!date) return ''
		let day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
		let rightMonth = date.getMonth() + 1 > 12 ? 1 : date.getMonth() + 1
		let month = rightMonth < 10 ? `0${rightMonth}` : rightMonth
		let year = date.getFullYear()

		return local ? `${day + '/' + month + '/' + year}` : `${year + '-' + month + '-' + day}`
	}

	isCorrectFilterDate(dateStart: Date | string | undefined, dateEnd: Date | string | undefined) {
		if (!(dateStart && dateEnd)) return false
		return true
	}

	getDate(dateStart: Date | undefined | null, dateEnd: Date | undefined | null) {
		const startDate = dateStart
		const endDate = dateEnd
		if (!(startDate && endDate)) return
		const dateStartStr = this.getFullDate(startDate)
		const dateEndStr = this.getFullDate(endDate)

		return {
			dateStart: dateStartStr,
			dateEnd: dateEndStr
		}
	}
}
