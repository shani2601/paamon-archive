import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectUserFirstName } from "../../../state/auth/auth.selectors";
import { AuthState } from "../../../state/auth/auth.reducer";
import { Observable } from "rxjs";
import { AsyncPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: `tool-bar`,
    imports: [AsyncPipe],
    styleUrl: './toolBar.component.css',
    templateUrl: './toolBar.component.html'
})
export class ToolBarComponent {
    userFirstName$!: Observable<string | undefined>;

    constructor(private store: Store<AuthState>) {}

    ngOnInit() {
        this.userFirstName$ = this.store.select(selectUserFirstName);
    }
}