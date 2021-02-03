import { v4 as uuid } from 'uuid'
import { Router } from 'express';
import * as storage from '../storage/postgre';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', auth, async (req, res, next) => {
  
  const list = await storage.listAll(req.app.get('userId'));

  res.json(list);
});

router.get('/:id', auth, async (req, res, next) => {
  //TODO get from DB by id

  const item = await storage.getById(
    req.app.get('userId'), 
    req.params['id']
  );

  res
    .status(item ? 200 : 404)
    .json(item ?? {
      statusCode: 404
    });
});

router.post('/', auth, async (req, res, next) => {

  const {body} = req;
  console.log(body);
  
  const newBody = await storage.create(
    req.app.get('userId'), 
    body
  );
  res.json(newBody);
});

router.put('/:id', auth, async (req, res, next) => {
  const {body} = req;

  const newBody = await storage.update(
    req.app.get('userId'), 
    {
      ...body,
      id: req.params.id,
    }
  );
  res.json(newBody);
});

router.delete('/:id', auth, async (req, res, next) => {
  await storage.remove(
    req.app.get('userId'), 
    req.params['id']
  )

  res
    .status(204)
    .json(null);
});


export default router;
