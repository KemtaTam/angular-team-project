import { PreloaderComponent } from './components/preloader/preloader.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@NgModule({
	declarations: [PreloaderComponent],
	imports: [CommonModule],
	exports: [PreloaderComponent]
})
export class SharedModule {}
