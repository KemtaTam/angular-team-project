import { Component } from '@angular/core'

@Component({
	selector: 'app-preloader',
	templateUrl: './preloader.component.html',
	styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent {
	preloaderObj = {
		src: './assets/images/preloader.gif',
		alt: 'Изображение загрузки контента'
	}
}
