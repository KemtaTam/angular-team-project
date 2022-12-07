import { PreloaderComponent } from './components/preloader/preloader.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component'

@NgModule({
	declarations: [PreloaderComponent, SidebarComponent],
	imports: [CommonModule],
	exports: [PreloaderComponent, SidebarComponent]
})
export class SharedModule {}
