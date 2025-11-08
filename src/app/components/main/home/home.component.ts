import { Component } from "@angular/core";
import { ToolBarComponent } from "../toolBar/toolBar.component";

@Component({
    standalone: true,
    selector: `app-home`,
    imports: [ToolBarComponent],
    styleUrl: './home.component.css',
    templateUrl: './home.component.html'
})
export class HomeComponent {

}