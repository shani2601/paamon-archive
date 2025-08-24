import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private usersKey = 'users';

  getUsersFromStorage(): User[] {
    const storedUsers = localStorage.getItem(this.usersKey);
    try {
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch {
      return [];
    }
  }

  saveUsersToStorage(users: User[]) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }
}
