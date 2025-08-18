export interface AuthState {
  uuid: string;
  token: string;
  loggedIn: boolean;
  login: (nickname: string) => Promise<void>;
  register: (nickname: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logOut: () => void;
}
