import { createGameDemo } from './demo/createGameDemo';
import { Demo } from './demo/Demo';

export const routes = new Map<string, () => Demo>();
routes.set('game', createGameDemo);
