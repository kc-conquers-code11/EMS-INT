const express = require('express');
const { validate } = require('../../middlewares/validate');
const {
  createBlockSchema,
  updateBlockSchema,
  blockIdSchema,
  blockQuerySchema,
} = require('../../validations/allocation/blockAllocation.validations');
const {
  createBlock,
  getAllBlocks,
  getBlockById,
  updateBlock,
  deleteBlock,
} = require('../../controllers/allocation/blockAllocation.controller');

const router = express.Router();

router.post('/', validate(createBlockSchema, 'body'), createBlock);
router.get('/', validate(blockQuerySchema, 'query'), getAllBlocks);
router.get('/:block_id', validate(blockIdSchema, 'params'), getBlockById);
router.put('/:block_id', validate(blockIdSchema, 'params'), validate(updateBlockSchema, 'body'), updateBlock);
router.delete('/:block_id', validate(blockIdSchema, 'params'), deleteBlock);

module.exports = router;
