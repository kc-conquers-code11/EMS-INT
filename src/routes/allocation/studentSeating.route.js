const express = require('express');
const { validate } = require('../../middlewares/validate');
const {
  createSeatingSchema,
  updateSeatingSchema,
  seatingIdSchema,
  blockIdParamSchema,
  seatingQuerySchema,
} = require('../../validations/allocation/studentSeating.validations');
const {
  createSeating,
  getAllSeatings,
  getSeatingById,
  updateSeating,
  softDeleteSeating,
  getSeatsByBlock,
} = require('../../controllers/allocation/studentSeating.controller');

const router = express.Router();

router.post('/', validate(createSeatingSchema, 'body'), createSeating);
router.get('/', validate(seatingQuerySchema, 'query'), getAllSeatings);
router.get('/:seating_id', validate(seatingIdSchema, 'params'), getSeatingById);
router.put('/:seating_id', validate(seatingIdSchema, 'params'), validate(updateSeatingSchema, 'body'), updateSeating);
router.delete('/:seating_id', validate(seatingIdSchema, 'params'), softDeleteSeating);
router.get('/block/:block_id', validate(blockIdParamSchema, 'params'), validate(seatingQuerySchema, 'query'), getSeatsByBlock);

module.exports = router;
