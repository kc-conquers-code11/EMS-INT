const db = require('../../../models');
const CourseOutcome = db.course_outcome;

// Create a new CO
exports.createCO = async (req, res) => {
  try {
    const { subject_id, co_code, description, blooms_level } = req.body;

    if (!subject_id || !co_code) {
      return res.status(400).json({ message: 'subject_id and co_code are required' });
    }

    const newCO = await CourseOutcome.create({
      subject_id,
      co_code,
      description,
      blooms_level,
    });

    return res.status(201).json({ message: 'CO created successfully', data: newCO });
  } catch (error) {
    console.error('Error creating CO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get COs by Subject ID
exports.getCOsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;

    const cos = await CourseOutcome.findAll({
      where: { subject_id },
      order: [['co_code', 'ASC']],
    });

    return res.status(200).json({ data: cos });
  } catch (error) {
    console.error('Error fetching COs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update CO
exports.updateCO = async (req, res) => {
  try {
    const { co_id } = req.params;
    const { co_code, description, blooms_level } = req.body;

    const co = await CourseOutcome.findByPk(co_id);
    if (!co) {
      return res.status(404).json({ message: 'CO not found' });
    }

    await co.update({ co_code, description, blooms_level });

    return res.status(200).json({ message: 'CO updated successfully', data: co });
  } catch (error) {
    console.error('Error updating CO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete CO
exports.deleteCO = async (req, res) => {
  try {
    const { co_id } = req.params;

    const co = await CourseOutcome.findByPk(co_id);
    if (!co) {
      return res.status(404).json({ message: 'CO not found' });
    }

    await co.destroy();

    return res.status(200).json({ message: 'CO deleted successfully' });
  } catch (error) {
    console.error('Error deleting CO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
