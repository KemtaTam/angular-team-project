import { IData1, ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit{
	data1: IData1[] | null = null
	error = ''
	isLoading = false

	constructor(private apiService: ApiService) {}
	
	ngOnInit(): void {
		this.apiService.getData1().subscribe({
			next: (res) => {
				this.isLoading = true
				this.data1 = res
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
