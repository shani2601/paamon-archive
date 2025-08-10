import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import * as bcrypt from 'bcryptjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users$ = new BehaviorSubject<User[]>([]);

  constructor(private localStorageService: LocalStorageService) {
    const users = this.localStorageService.getUsersFromStorage();
    this.users$.next(users);
  }

  register(user: User): boolean {
    const currentUsers = this.users$.value;

    if (currentUsers.some((u) => u.username === user.username)) {
      return false;
    } else {        
      user = {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      };
      const updatedUsers = [...currentUsers, user];
      this.users$.next(updatedUsers);
      this.localStorageService.saveUsersToStorage(updatedUsers);
      return true;
    }
  }

  login(user: User): boolean {
    const matchedUser = this.users$.value.find(
      (u) =>
        u.username === user.username &&
        bcrypt.compareSync(user.password, u.password)
    );
    return !!matchedUser;
  }

  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }
}
