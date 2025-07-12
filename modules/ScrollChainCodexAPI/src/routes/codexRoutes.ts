import { Router } from 'express';
import { fetchScrollEntropy } from '../controllers/scrollEntropy';
import { mintScrollNFT } from '../controllers/scrollMint';
import { getArcRadius } from '../controllers/geometryCalc';

export const codexRouter = Router();

codexRouter.get('/entropy', fetchScrollEntropy);
codexRouter.post('/mint', mintScrollNFT);
codexRouter.get('/geometry', getArcRadius);
