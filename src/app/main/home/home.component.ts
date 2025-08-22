import { Component } from "@angular/core";
import { HeadlineComponent } from "../headline/headline.component";

@Component({
    standalone: true,
    selector: `app-home`,
    imports: [HeadlineComponent],
    template: `
        <app-headline></app-headline>
    `
})
export class HomeComponent {

}