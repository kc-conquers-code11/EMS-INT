const db = require('../../../models');
const CoPoMapping = db.co_po_mapping;
const CourseOutcome = db.course_outcome;
const ProgrammeOutcome = db.programme_outcome;

// Bulk map COs to POs
exports.mapCoPo = async (req, res) => {
  try {
    const { mappings } = req.body;

    if (!mappings || !Array.isArray(mappings)) {
      return res.status(400).json({ message: 'mappings array is required' });
    }

    // Mapping payload structure: [{ co_id: 1, po_id: 2, correlation_level: true/false }, ...]
    // Upsert mappings
    const results = [];
    for (const mapping of mappings) {
      const { co_id, po_id, correlation_level } = mapping;

      const [record, created] = await CoPoMapping.upsert({
        co_id,
        po_id,
        correlation_level,
      });
      results.push(record);
    }

    return res.status(200).json({ message: 'CO-PO mapped successfully', data: results });
  } catch (error) {
    console.error('Error mapping CO-PO:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get CO-PO mappings for a specific subject (via its COs)
exports.getCoPoMapping = async (req, res) => {
  try {
    const { subject_id } = req.params;

    // Get all COs for this subject
    const cos = await CourseOutcome.findAll({
      where: { subject_id },
      attributes: ['co_id', 'co_code'],
    });

    const coIds = cos.map((co) => co.co_id);

    // Get all mappings for these COs
    const mappings = await CoPoMapping.findAll({
      where: { co_id: coIds },
    });

    return res.status(200).json({ data: mappings });
  } catch (error) {
    console.error('Error fetching CO-PO mapping:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
