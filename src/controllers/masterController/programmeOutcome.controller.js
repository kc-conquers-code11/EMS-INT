const db = require('../../../models');
const ProgrammeOutcome = db.programme_outcome;

// Create a new PO
exports.createPO = async (req, res) => {
  try {
    const { programm_id, po_code, description } = req.body;

    if (!programm_id || !po_code) {
      return res.status(400).json({ message: 'programm_id and po_code are required' });
    }

    const newPO = await ProgrammeOutcome.create({
      programm_id,
      po_code,
      description,
    });

    return res.status(201).json({ message: 'PO created successfully', data: newPO });
  } catch (error) {
    console.error('Error creating PO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get POs by Programme ID
exports.getPOsByProgramme = async (req, res) => {
  try {
    const { programm_id } = req.params;

    const pos = await ProgrammeOutcome.findAll({
      where: { programm_id },
      order: [['po_code', 'ASC']],
    });

    return res.status(200).json({ data: pos });
  } catch (error) {
    console.error('Error fetching POs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update PO
exports.updatePO = async (req, res) => {
  try {
    const { po_id } = req.params;
    const { po_code, description } = req.body;

    const po = await ProgrammeOutcome.findByPk(po_id);
    if (!po) {
      return res.status(404).json({ message: 'PO not found' });
    }

    await po.update({ po_code, description });

    return res.status(200).json({ message: 'PO updated successfully', data: po });
  } catch (error) {
    console.error('Error updating PO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete PO
exports.deletePO = async (req, res) => {
  try {
    const { po_id } = req.params;

    const po = await ProgrammeOutcome.findByPk(po_id);
    if (!po) {
      return res.status(404).json({ message: 'PO not found' });
    }

    await po.destroy();

    return res.status(200).json({ message: 'PO deleted successfully' });
  } catch (error) {
    console.error('Error deleting PO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
