const studentSeatingService = require('../../services/allocation/studentSeating.service');

const createSeating = async (req, res) => {
  try {
    const result = await studentSeatingService.createSeating(req.body);
    return res.status(201).json({ success: true, data: result, message: 'Seating created' });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getAllSeatings = async (req, res) => {
  try {
    const result = await studentSeatingService.getAllSeatings(req.query);
    return res.status(200).json({ success: true, ...result, message: 'Seatings retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    console.error('Error in getAllSeatings:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const getSeatingById = async (req, res) => {
  try {
    const { seating_id } = req.params;
    const result = await studentSeatingService.getSeatingById(seating_id);
    return res.status(200).json({ success: true, data: result, message: 'Seating retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in getSeatingById:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const updateSeating = async (req, res) => {
  try {
    const { seating_id } = req.params;
    const result = await studentSeatingService.updateSeating(seating_id, req.body);
    return res.status(200).json({ success: true, data: result, message: 'Seating updated successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in updateSeating:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const softDeleteSeating = async (req, res) => {
  try {
    const { seating_id } = req.params;
    const result = await studentSeatingService.softDeleteSeating(seating_id);
    return res.status(200).json({ success: true, data: result, message: 'Seating soft deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in softDeleteSeating:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const getSeatsByBlock = async (req, res) => {
  try {
    const { block_id } = req.params;
    const result = await studentSeatingService.getSeatsByBlock(block_id, req.query);
    return res.status(200).json({ success: true, ...result, message: 'Seats retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    console.error('Error in getSeatsByBlock:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

module.exports = {
  createSeating,
  getAllSeatings,
  getSeatingById,
  updateSeating,
  softDeleteSeating,
  getSeatsByBlock,
};
