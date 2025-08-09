import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getUsersFromStorage(): User[] {
    const storedUsers = localStorage.getItem('users');
    try {
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch {
      return [];
    }
  }

  saveUsersToStorage(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
