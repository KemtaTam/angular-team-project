import { Subscription } from 'rxjs'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'

import { ChartsDataService, IChartWithOptions } from './services/charts-data.service'
import { ApiService } from '../shared/services/api.service'

export interface IParamsData {
	type: string
	id: string
}

@Component({
	selector: 'app-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
	error = ''
	isLoading = true
	configuredData: IChartWithOptions[] = []
	subscriptionData!: Subscription
	subscriptionRoute!: Subscription

	constructor(
		private apiService: ApiService,
		private chartsDataService: ChartsDataService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.subscriptionData = this.apiService.getData1().subscribe({
			next: (res) => {
				this.subscriptionRoute = this.route.queryParams.subscribe((params: Params) => {
					if (!Object.getOwnPropertyNames(params).length) {
						if (!this.chartsDataService.chartsWithOptions.length) {
							this.chartsDataService.setChartsData(res)
						}
						this.configuredData = this.chartsDataService.chartsWithOptions
					} else {
						const paramsData: IParamsData = {
							type: Object.getOwnPropertyNames(params)[0],
							id: params[Object.getOwnPropertyNames(params)[0]]
						}
						this.chartsDataService.setChartsData(res, paramsData)
						this.configuredData = this.chartsDataService.chartsWithSumOptions
					}
				})
			},
			error: (error) => {
				this.error = error.message
			},
			complete: () => {
				this.isLoading = false
			}
		})
	}

	ngOnDestroy(): void {
		this.subscriptionData.unsubscribe()
		this.subscriptionRoute.unsubscribe()
	}
}
