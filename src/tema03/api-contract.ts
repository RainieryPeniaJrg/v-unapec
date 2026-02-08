export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type SaldoResponse = {
  saldo: number;
};

export type ApiErrorResponse = {
  error: string;
};
