export type TServerConfig = {
  dbUrl: string,
  host: string,
  // logLevel: string,
  port: number,
}

export type TTokenConfig = {
  // algorithm: string | jwt.Algorithm | others?
  hash_salt: number,
  refreshTokenExpirationTime: string,
  refreshTokenSecretKey: string,
  accessTokenExpirationTime: string,
  accessTokenSecretKey: string,
}
