import express, { Express } from 'express';

export const createServer = (): Express => {
  const app = express();
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
