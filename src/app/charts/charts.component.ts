import { ChartsDataService, IChartWithOptions } from './services/charts-data.service';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit{
	error = ''
	isLoading = true
	configuredData: IChartWithOptions[] = []

	constructor(private apiService: ApiService, private chartsDataService: ChartsDataService) {}
	
	ngOnInit(): void {
		this.apiService.getData1().subscribe({
			next: (res) => {
				this.chartsDataService.setChartsData(res)
				this.configuredData = this.chartsDataService.chartsWithOptions
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
