import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {RouterModule} from '@angular/router'

import { PreloaderComponent } from './components/preloader/preloader.component'
import { SidebarComponent } from './components/sidebar/sidebar.component'

@NgModule({
	declarations: [PreloaderComponent, SidebarComponent],
	imports: [CommonModule, RouterModule],
	exports: [PreloaderComponent, SidebarComponent]
})
export class SharedModule {}
