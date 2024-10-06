import { Express, Request, Response } from 'express';

export const setupRoutes = (app: Express): void => {
  app.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello, World!' });
  });

};
