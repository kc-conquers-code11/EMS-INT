const supervisorAllocationService = require('../../services/allocation/supervisorAllocation.service');
const { ZodError } = require('zod');
const createDuty = async (req, res) => {
  try {
    const result = await supervisorAllocationService.createDuty(req.body);
    return res.status(201).json({ success: true, data: result, message: 'Duty created' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    console.error('Error in createDuty:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const getAllDuties = async (req, res) => {
  try {
    const result = await supervisorAllocationService.getAllDuties(req.query);
    return res.status(200).json({ success: true, ...result, message: 'Duties retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    console.error('Error in getAllDuties:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const getDutyById = async (req, res) => {
  try {
    const { duty_id } = req.params;
    const result = await supervisorAllocationService.getDutyById(duty_id);
    return res.status(200).json({ success: true, data: result, message: 'Duty retrieved successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in getDutyById:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const updateDuty = async (req, res) => {
  try {
    const { duty_id } = req.params;
    const result = await supervisorAllocationService.updateDuty(duty_id, req.body);
    return res.status(200).json({ success: true, data: result, message: 'Duty updated successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in updateDuty:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const deleteDuty = async (req, res) => {
  try {
    const { duty_id } = req.params;
    const result = await supervisorAllocationService.deleteDuty(duty_id);
    return res.status(200).json({ success: true, data: result, message: 'Duty deleted successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Error in deleteDuty:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const acceptDuty = async (req, res) => {
  try {
    const { duty_id } = req.params;
    const result = await supervisorAllocationService.acceptDuty(duty_id);
    return res.status(200).json({ success: true, data: result, message: 'Duty accepted' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.status === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Error in acceptDuty:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

const rejectDuty = async (req, res) => {
  try {
    const { duty_id } = req.params;
    const { remarks } = req.body;
    const result = await supervisorAllocationService.rejectDuty(duty_id, remarks);
    return res.status(200).json({ success: true, data: result, message: 'Duty rejected' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false, message: 'Validation error', errors: error.errors
      });
    }
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.status === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    console.error('Error in rejectDuty:', error);
    return res.status(500).json({
      success: false, message: 'Internal server error', error: error.message
    });
  }
};

module.exports = {
  createDuty,
  getAllDuties,
  getDutyById,
  updateDuty,
  deleteDuty,
  acceptDuty,
  rejectDuty,
};
