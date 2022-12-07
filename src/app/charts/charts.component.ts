import { ChartsDataService, IChartWithOptions } from './services/charts-data.service'
import { ApiService } from './../services/api.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
// todo: поменять формат даты
// todo: вынести сервис апи в shared

export interface IParamsData {
	type: string;
	id: string
}

@Component({
	selector: 'app-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
	error = ''
	isLoading = true
	configuredData: IChartWithOptions[] = []

	constructor(
		private apiService: ApiService,
		private chartsDataService: ChartsDataService,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.apiService.getData1().subscribe({
			next: (res) => {
				this.route.queryParams.subscribe((params: Params) => {
					if(!Object.getOwnPropertyNames(params).length) {
						this.chartsDataService.setChartsData(res)
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
}
