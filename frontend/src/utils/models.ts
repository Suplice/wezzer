export type Room = {
  RoomId: string;
  Description: string;
  Name: string;
  backgroundImage: string;
  CreatorId: string;
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
};

export type ApiResponse = {
  message: string;
  result: boolean;
  code?: number;
  data?: any;
};
