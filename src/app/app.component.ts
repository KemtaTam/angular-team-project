import { ApiService, IData0, IData1 } from './services/api.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	baseURL = "http://localhost:3001"
	data0: IData0[] | null = null;
	data1: IData1[] | null = null;
	error = ''
	isLoading = false

	constructor(private apiService: ApiService) {}

	ngOnInit(): void {
		this.apiService.getData0().subscribe({
			next: (res) => {
				this.isLoading = true
				this.data0 = res;
			},
			error: (error) => {
				this.error = error.message;
			},
			complete: () => {
				this.isLoading = false;
			},
		})
		this.apiService.getData1().subscribe({
			next: (res) => {
				this.isLoading = true
				this.data1 = res;
				debugger
			},
			error: (error) => {
				this.error = error.message;
			},
			complete: () => {
				this.isLoading = false;
			},
		})
	}
}
