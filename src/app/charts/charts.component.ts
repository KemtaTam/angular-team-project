import { DateService } from './../table/services/date.service'
import { IData1 } from './../shared/services/api.service'
import { Subscription, switchMap } from 'rxjs'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'

import { ChartsDataService, IChartWithOptions } from './services/charts-data.service'
import { ApiService } from '../shared/services/api.service'

export interface IParamsData {
	type: string
	id: string
}
interface IDate {
	[dt_date_gte: string]: string
	dt_date_lte: string
}

@Component({
	selector: 'app-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
	error = ''
	isLoading = true
	subscriptionData!: Subscription
	configuredData: IChartWithOptions[] = []
	data!: IData1[]

	constructor(
		private apiService: ApiService,
		private chartsDataService: ChartsDataService,
		private route: ActivatedRoute,
		private dateService: DateService
	) {}

	ngOnInit(): void {
		const date = this.dateService.getDate()
		const params: IDate | {} = date
			? { dt_date_gte: date.dateStart as string, dt_date_lte: date.dateEnd as string }
			: {}

		this.subscriptionData = this.apiService
			.getDataWithParameter(params)
			.pipe(
				switchMap((res) => {
					this.data = res
					return this.route.queryParams
				})
			)
			.subscribe((params) => {
				this.setData(params)
				this.isLoading = false
			})
	}

	setData(params: Params) {
		if (!Object.getOwnPropertyNames(params).length) {
			this.chartsDataService.setChartsData(this.data)
			this.configuredData = this.chartsDataService.chartsWithOptions
		} else {
			const paramsData: IParamsData = {
				type: Object.getOwnPropertyNames(params)[0],
				id: params[Object.getOwnPropertyNames(params)[0]]
			}
			this.chartsDataService.setChartsData(this.data, paramsData)
			this.configuredData = this.chartsDataService.chartsWithSumOptions
		}
	}

	ngOnDestroy(): void {
		this.subscriptionData.unsubscribe()
	}
}
