import { Component } from "@angular/core";
import { ToolBarComponent } from "../toolBar/toolBar.component";
import { TrackTableComponent } from "../trackTable/trackTable.component";

@Component({
    standalone: true,
    selector: `app-home`,
    imports: [ToolBarComponent, TrackTableComponent],
    styleUrl: './home.component.css',
    templateUrl: './home.component.html'
})
export class HomeComponent {

}