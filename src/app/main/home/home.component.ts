import { Component } from "@angular/core";
import { HeadlineComponent } from "../headline/headLine.component";

@Component({
    standalone: true,
    selector: 'app-home',
    imports: [HeadlineComponent],
    styleUrls: [],
    template: `
        <app-headline></app-headline>
    `
})
export class Home {

}