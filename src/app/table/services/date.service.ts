import { Injectable } from '@angular/core'

interface IDatePicker {
	dateStart?: Date | null
	dateEnd?: Date | null
}
interface IDateStr {
	dateStart?: string | null
	dateEnd?: string | null
}
@Injectable({
	providedIn: 'root'
})
export class DateService {
	currentDate?: IDatePicker = {
		dateStart: null,
		dateEnd: null
	}
	constructor() {}

	setCurrentDate(dateStart?: Date | null, dateEnd?: Date | null): void {
		this.currentDate = {
			dateStart,
			dateEnd
		}
	}
	getFullDate(date: Date | null | undefined, local?: 'RU'): string | undefined {
		if (!date) return
		let day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
		let rightMonth = date.getMonth() + 1 > 12 ? 1 : date.getMonth() + 1
		let month = rightMonth < 10 ? `0${rightMonth}` : rightMonth
		let year = date.getFullYear()

		return local ? `${day + '/' + month + '/' + year}` : `${year + '-' + month + '-' + day}`
	}

	isCorrectFilterDate(dateStart?: Date | string | null, dateEnd?: Date | string | null): boolean {
		if (!(dateStart && dateEnd)) return false
		return true
	}

	getDate(): IDateStr | undefined {
		if (!(this.currentDate?.dateStart && this.currentDate?.dateEnd)) return
		const dateStartStr = this.getFullDate(this.currentDate.dateStart)
		const dateEndStr = this.getFullDate(this.currentDate.dateEnd)
		return {
			dateStart: dateStartStr,
			dateEnd: dateEndStr
		}
	}
}
