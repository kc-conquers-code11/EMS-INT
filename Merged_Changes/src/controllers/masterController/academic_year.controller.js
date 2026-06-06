const sequelize = require('../../config/db.js');
const Sequelize = require('sequelize');
const academicYearModel = require('../../models/academic_year.js');

// ✅ initialize model
const academicYear = academicYearModel(sequelize, Sequelize.DataTypes);
const { Op } = require('sequelize');

// Create Academic Year
const createAcademicYear = async (req, res) => {
  try {
    console.log('Received data for new academic year:', req.body);
    const { academic_name, start_date, end_date, is_admission, current_ay } = req.body;

    // If current_ay is 1, update all other records to have current_ay = 0
    if (current_ay === 1) {
      await academicYear.update(
        { current_ay: 0 },
        { where: { current_ay: 1 } }
      );
    }

    const data = await academicYear.create({
      academic_name,
      start_date,
      end_date,
      is_admission: is_admission || 0,
      current_ay: current_ay || 0,
    });

    console.log('Academic year created successfully:', data);

    res.status(201).json({
      success: true,
      message: 'Academic year created successfully',
      data,
    });
  } catch (error) {
    console.log('Error creating academic year:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All Academic Years (latest created first)
const getAllAcademicYears = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await academicYear.findAndCountAll({
      limit: limitNum,
      offset: offset,
      order: [['created_at', 'DESC']],
    });

    // Format dates for frontend
    const formattedRows = rows.map(row => ({
      ...row.toJSON(),
      startDate: row.start_date ? new Date(row.start_date).toLocaleDateString('en-GB') : '',
      endDate: row.end_date ? new Date(row.end_date).toLocaleDateString('en-GB') : '',
    }));

    res.status(200).json({
      success: true,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum),
      data: formattedRows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Academic Year By ID
const getAcademicYearById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await academicYear.findByPk(id);

    if (!data) {
      return res.status(404).json({ success: false, message: 'Academic year not found' });
    }

    const formattedData = {
      ...data.toJSON(),
      startDate: data.start_date ? new Date(data.start_date).toLocaleDateString('en-GB') : '',
      endDate: data.end_date ? new Date(data.end_date).toLocaleDateString('en-GB') : '',
    };

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Academic Year
const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = ['academic_name', 'start_date', 'end_date', 'is_admission', 'current_ay'];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    // If setting current_ay to 1, update all other records
    if (updateData.current_ay === 1) {
      await academicYear.update(
        { current_ay: 0 },
        { where: { current_ay: 1, academic_id: { [Op.ne]: id } } }
      );
    }

    const [updated] = await academicYear.update(updateData, {
      where: { academic_id: id },
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Academic year not found' });
    }

    const updatedData = await academicYear.findByPk(id);

    res.status(200).json({
      success: true,
      message: 'Academic year updated successfully',
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Academic Year (Soft delete)
const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await academicYear.destroy({
      where: { academic_id: id },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Academic year not found' });
    }

    res.status(200).json({ success: true, message: 'Academic year moved to trash successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Deleted Academic Years
const getDeletedAcademicYears = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await academicYear.findAndCountAll({
      paranoid: false,
      where: {
        deletedAt: { [Op.ne]: null },
      },
      limit: limitNum,
      offset: offset,
      order: [['deletedAt', 'DESC']],
    });

    const formattedRows = rows.map(row => ({
      ...row.toJSON(),
      startDate: row.start_date ? new Date(row.start_date).toLocaleDateString('en-GB') : '',
      endDate: row.end_date ? new Date(row.end_date).toLocaleDateString('en-GB') : '',
    }));

    res.status(200).json({
      success: true,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum),
      data: formattedRows,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Restore Academic Year
const restoreAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const restored = await academicYear.restore({
      where: { academic_id: id },
    });

    if (!restored) {
      return res.status(404).json({ success: false, message: 'Academic year not found or not deleted' });
    }

    res.status(200).json({ success: true, message: 'Academic year restored successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAcademicYearsDropdown = async (req, res) => {
  try {
    const data = await academicYear.findAll({
      attributes: ['academic_id', 'academic_name', 'is_admission', 'current_ay'],
      order: [['academic_name', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data,
      message: "Academic years dropdown retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  deleteAcademicYear,
  getDeletedAcademicYears,
  restoreAcademicYear,
  getAcademicYearsDropdown
};