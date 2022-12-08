import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, delay, throwError } from 'rxjs'

export interface IData0 {
	office_id: number
	wh_id: number
	qty: number
}
export interface IData1 extends IData0 {
	dt_date: string
}

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	baseURL = 'http://localhost:3001'
	data0: IData0 | null = null
	data1: IData1 | null = null

	constructor(private http: HttpClient) {}

	getData0() {
		return this.http.get<IData0[]>(`${this.baseURL}/data0`).pipe(
			catchError((error) => {
				console.log('Error: ', error.message)
				return throwError(() => error)
			})
		)
	}

	getData1() {
		return this.http.get<IData1[]>(`${this.baseURL}/data1`).pipe(
			catchError((error) => {
				console.log('Error: ', error.message)
				return throwError(() => error)
			})
		)
	}

	getDataWithParameter(parametrs: string) {
		return this.http.get<IData1[]>(`${this.baseURL}/data1?${parametrs}`).pipe(
			delay(100),
			catchError((error) => {
				console.log('Error: ', error.message)
				return throwError(() => error)
			})
		)
	}
}
