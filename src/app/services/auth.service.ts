import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from '../models/user.model';
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
    private users$ = new BehaviorSubject<User[]>([]);

    register(user: User): boolean {
        const currentUsers = this.users$.value;

        if (currentUsers.some(u => u.username === user.username)) {
            return false;
        }
        else {
            this.users$.next([...currentUsers, user]);
            return true;
        }
    }

    login(user: User): "success" | "wrong-username" | "wrong-password" {
        const matchedUser = this.users$.value.find(u => u.username === user.username);

        if (matchedUser) {
            if (matchedUser.password === user.password) {
                return "success";
            }
            else {
                return "wrong-password";
            }
        }
        else {
            return "wrong-username";
        }
    }

    getUsers(): Observable<User[]> {
        return (this.users$.asObservable());
    }
}