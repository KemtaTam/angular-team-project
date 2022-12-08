import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class TableService {
	displayedColumns: string[] = ['office_id', 'wh_id', 'dt_date', 'qty']
	displayedColumnsWithArrow: string[] = ['office_id', 'wh_id', 'dt_date', 'qty', 'expand']
	constructor() {}
}
