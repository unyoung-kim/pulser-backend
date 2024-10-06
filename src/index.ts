import { createServer } from './server';
import { setupRoutes } from './routes';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    const app = createServer();
    setupRoutes(app);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
