export type UserRole = 'ATHLETE' | 'PARENT' | 'COACH' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  profileImage: string | null;
  isVerified: boolean;
  address: string | null;
  state: string | null;
  lga: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateUserDto = Partial<
  Pick<User, 'firstName' | 'lastName' | 'phoneNumber' | 'profileImage'>
>;
