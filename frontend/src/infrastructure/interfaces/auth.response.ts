import type { User } from "./user.interface";

export interface AuthResponse {
    status: string;
    user:   User;
    token:  string;
}