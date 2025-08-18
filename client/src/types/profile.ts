export interface ProfileState {
  nickname: string;
  balance: number;
  uuid: string;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}
