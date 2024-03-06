export interface ResponseUser {
  user: User;
}

export interface User {
  username: string;
  is_superuser: boolean;
  is_active: boolean;
  id: string;
  role: "exporer" | "therapist";
}

export interface ResponseError {
  detail: Detail[];
}

export interface Detail {
  loc: [string, number];
  msg: string;
  type: string;
}
