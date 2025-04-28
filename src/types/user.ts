export interface User {
  id: number;
  email: string;
  loginType: "BASIC" | "KAKAO" | "GOOGLE";
  joinDate: string;
  profile: Profile;
}

export interface Profile {
  nickname: string;
  profileImageUrl: string | null;
}
