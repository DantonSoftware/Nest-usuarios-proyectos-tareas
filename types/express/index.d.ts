import 'express-serve-static-core';

export {}; 

declare module 'express-serve-static-core' {
  interface Request {
    idUser: string;
    roleUser: string | string[];
  }
}