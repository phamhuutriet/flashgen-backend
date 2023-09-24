// custom.d.ts

declare namespace Express {
  export interface Request {
    tokenStore: any; // Replace YourTokenType with the actual type of tokenStore
  }
}
