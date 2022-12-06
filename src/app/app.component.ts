import { Component } from '@angular/core'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'team-project-wb'
	lala() {
		if (true) console.log('object');
    if(true) {
      let map = new Map();
      let array = [1,3,3,5,6,7,9,8,9];
      array.forEach(elem => {
        if(!map.has(elem)) {
          map.set(elem, {
            data: []
          })
        }
      })
    }
		if (true) console.log('object')
		if (true) console.log('object')
	}
}
