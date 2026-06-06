const blockAllocationService = require('../../services/allocation/blockAllocation.service');

const createBlock = async (req, res) => {
  try {
    const result = await blockAllocationService.createBlock(req.body);
    return res.status(201).json({ success: true, data: result, message: 'Block created' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    console.error('Error in createBlock:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const getAllBlocks = async (req, res) => {
  try {
    const result = await blockAllocationService.getAllBlocks(req.query);
    return res.status(200).json({ success: true, ...result, message: 'Blocks retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    console.error('Error in getAllBlocks:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const getBlockById = async (req, res) => {
  try {
    const { block_id } = req.params;
    const result = await blockAllocationService.getBlockById(block_id);
    return res.status(200).json({ success: true, data: result, message: 'Block retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in getBlockById:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const updateBlock = async (req, res) => {
  try {
    const { block_id } = req.params;
    const result = await blockAllocationService.updateBlock(block_id, req.body);
    return res.status(200).json({ success: true, data: result, message: 'Block updated successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in updateBlock:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const deleteBlock = async (req, res) => {
  try {
    const { block_id } = req.params;
    const result = await blockAllocationService.deleteBlock(block_id);
    return res.status(200).json({ success: true, data: result, message: 'Block deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in deleteBlock:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

module.exports = {
  createBlock,
  getAllBlocks,
  getBlockById,
  updateBlock,
  deleteBlock,
};
