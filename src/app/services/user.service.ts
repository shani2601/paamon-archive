import { Injectable } from "@angular/core";
import { User } from "../models/user.model";


@Injectable({providedIn: 'root'})
export class UserService {
    private users: User[] = [];
    private currentlyLoginUser: User | undefined;

    constructor() {
        const usersJson = localStorage.getItem('users');
        this.users = usersJson ? JSON.parse(usersJson) : [];
    }

    loginUser(user: User) {
        const matchedUser = this.users.find(u => u.username === user.username);

        if (matchedUser && (matchedUser.password === user.password)) {
            this.currentlyLoginUser = user;
        }
    }

    registerUser(user: User) {
        if (!(this.users.find(u => u.username === user.username))) {
            this.users.push(user);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }
}