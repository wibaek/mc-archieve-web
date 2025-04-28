export type User = {
  id: number;
  email: string;
  loginType: "BASIC" | "KAKAO" | "GOOGLE";
  joinDate: string;
  profile: {
    nickname: string;
    profileImageUrl: string | null;
  };
};
