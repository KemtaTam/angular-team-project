import { Component } from '@angular/core'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'team-project-wb'
	lala() {
		if (true) console.log('object')
		if (false) {
			console.log('fdfsdf')
		} else {
			if (true) {
				console.log('hi')
			}
			console.log('ye')
		}
		if (true) console.log('object')
		if (true) console.log('object')
	}
}
