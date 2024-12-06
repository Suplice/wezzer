export type Room = {
  RoomId: string;
  Description: string;
  Name: string;
  backgroundImage: string;
  CreatorId: string;
  creatorName: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  guest?: boolean;
};

export type ApiResponse = {
  message: string;
  result: boolean;
  code?: number;
  data?: any;
};

export type LoginData = {
  email: string;
  password: string;
};

export type Participant = {
  UserId: string;
  Nickname: string;
};
