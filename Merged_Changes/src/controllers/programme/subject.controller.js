// controllers/academics/subject.controller.js
const {
    createSubjectSchema,
    updateSubjectSchema,
    subjectIdParamSchema,
    idParamSchema,
} = require('../../validations/programme/subject.validations.js');
const { ZodError } = require('zod');
const db = require('../../../models');

const enrichSubjectScopeFields = async (models, data) => {
    const payload = { ...data };

    if (payload.branch_id) {
        const branch = await models.branch.findByPk(payload.branch_id);
        if (branch) {
            payload.depart_id = payload.depart_id || branch.depart_id;
            if (payload.depart_id) {
                const department = await models.department.findByPk(payload.depart_id);
                if (department) {
                    payload.institution_id = payload.institution_id || department.institution_id;
                }
            }
        }
    }

    if (payload.academic_id && !payload.acad_year) {
        const academicYear = await models.academic_year.findByPk(payload.academic_id);
        if (academicYear?.academic_name) {
            payload.acad_year = academicYear.academic_name;
        }
    }

    return payload;
};

// Get all subjects with scheme and branch details
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await db.sequelize.query(
            `
      SELECT 
        s.*,
        sch.scheme_name, sch.scheme_year, sch.programm_id,
        b.branch_name, b.branch_code
      FROM subject s
      LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id AND sch.deletedAt IS NULL
      LEFT JOIN branch b ON s.branch_id = b.branch_id AND b.deletedAt IS NULL
      WHERE s.deletedAt IS NULL
      ORDER BY s.createdAt DESC
    `,
            {
                nest: true,
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json({
            success: true,
            data: subjects,
            message: 'Subjects retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getAllSubjects:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get subject by ID with scheme and branch details
const getSubjectById = async (req, res) => {
    try {
        const { subject_id } = subjectIdParamSchema.parse(req.params);

        const [subject] = await db.sequelize.query(
            `
      SELECT 
        s.*,
        sch.scheme_name, sch.scheme_year, sch.programm_id,
        b.branch_name, b.branch_code
      FROM subject s
      LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id AND sch.deletedAt IS NULL
      LEFT JOIN branch b ON s.branch_id = b.branch_id AND b.deletedAt IS NULL
      WHERE s.subject_id = :subject_id AND s.deletedAt IS NULL
    `,
            {
                replacements: { subject_id },
                nest: true,
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        res.status(200).json({
            success: true,
            data: subject,
            message: 'Subject retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in getSubjectById:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get subjects by scheme ID
const getSubjectsByScheme = async (req, res) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        const scheme = await req.db.models.scheme.findByPk(id);
        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        const subjects = await req.db.models.subject.findAll({
            where: { scheme_id: id },
            order: [['sem', 'ASC'], ['subject_name', 'ASC']],
        });

        res.status(200).json({
            success: true,
            data: subjects,
            scheme_name: scheme.scheme_name,
            message: 'Subjects retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in getSubjectsByScheme:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get subjects by branch ID
const getSubjectsByBranch = async (req, res) => {
    try {
        const { id } = idParamSchema.parse(req.params);

        const branch = await req.db.models.branch.findByPk(id);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found',
            });
        }

        const subjects = await req.db.models.subject.findAll({
            where: { branch_id: id },
            order: [['sem', 'ASC'], ['subject_name', 'ASC']],
        });

        res.status(200).json({
            success: true,
            data: subjects,
            branch_name: branch.branch_name,
            message: 'Subjects retrieved successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in getSubjectsByBranch:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get subjects by semester
const getSubjectsBySemester = async (req, res) => {
    try {
        const { scheme_id, sem } = req.params;

        const subjects = await req.db.models.subject.findAll({
            where: {
                scheme_id: scheme_id,
                sem: sem
            },
            order: [['subject_name', 'ASC']],
        });

        res.status(200).json({
            success: true,
            data: subjects,
            message: 'Subjects retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getSubjectsBySemester:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Create new subject
const createSubject = async (req, res) => {
    try {
        const validatedData = createSubjectSchema.parse(req.body);

        // Check if scheme exists
        const scheme = await req.db.models.scheme.findByPk(validatedData.scheme_id);
        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found. Please select a valid scheme.',
            });
        }

        // Check if branch exists (if provided)
        if (validatedData.branch_id) {
            const branch = await req.db.models.branch.findByPk(validatedData.branch_id);
            if (!branch) {
                return res.status(404).json({
                    success: false,
                    message: 'Branch not found. Please select a valid branch.',
                });
            }
        }

        // Check for duplicate subject within same scheme and semester
        const existingSubject = await req.db.models.subject.findOne({
            where: {
                subject_name: validatedData.subject_name,
                scheme_id: validatedData.scheme_id,
                sem: validatedData.sem || null,
            },
        });

        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: 'Subject with this name already exists in the selected scheme and semester',
            });
        }

        // Check for duplicate subject code if provided
        if (validatedData.subject_code) {
            const existingCode = await req.db.models.subject.findOne({
                where: {
                    subject_code: validatedData.subject_code,
                    scheme_id: validatedData.scheme_id,
                },
            });

            if (existingCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject with this code already exists in the selected scheme',
                });
            }
        }

        const createPayload = await enrichSubjectScopeFields(req.db.models, validatedData);
        const subject = await req.db.models.subject.create(createPayload);

        // Fetch related data for response
        const branch = createPayload.branch_id
            ? await req.db.models.branch.findByPk(createPayload.branch_id)
            : null;

        res.status(201).json({
            success: true,
            data: {
                ...subject.toJSON(),
                scheme_name: scheme.scheme_name,
                branch_name: branch ? branch.branch_name : null,
            },
            message: 'Subject created successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in createSubject:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Update subject
const updateSubject = async (req, res) => {
    try {
        const { subject_id } = subjectIdParamSchema.parse(req.params);
        const validatedData = updateSubjectSchema.parse(req.body);

        const subject = await req.db.models.subject.findByPk(subject_id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        // Check if new scheme exists
        if (validatedData.scheme_id && validatedData.scheme_id !== subject.scheme_id) {
            const scheme = await req.db.models.scheme.findByPk(validatedData.scheme_id);
            if (!scheme) {
                return res.status(404).json({
                    success: false,
                    message: 'New scheme not found. Please select a valid scheme.',
                });
            }
        }

        // Check if new branch exists
        if (validatedData.branch_id && validatedData.branch_id !== subject.branch_id) {
            const branch = await req.db.models.branch.findByPk(validatedData.branch_id);
            if (!branch) {
                return res.status(404).json({
                    success: false,
                    message: 'New branch not found. Please select a valid branch.',
                });
            }
        }

        // Check for duplicate name (excluding current subject)
        if (validatedData.subject_name) {
            const schemeId = validatedData.scheme_id || subject.scheme_id;
            const sem = validatedData.sem !== undefined ? validatedData.sem : subject.sem;

            const existingSubject = await req.db.models.subject.findOne({
                where: {
                    subject_name: validatedData.subject_name,
                    scheme_id: schemeId,
                    sem: sem,
                    subject_id: { [req.db.Sequelize.Op.ne]: subject_id },
                },
            });

            if (existingSubject) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject with this name already exists in the scheme and semester',
                });
            }
        }

        // Check for duplicate code (excluding current subject)
        if (validatedData.subject_code) {
            const schemeId = validatedData.scheme_id || subject.scheme_id;

            const existingCode = await req.db.models.subject.findOne({
                where: {
                    subject_code: validatedData.subject_code,
                    scheme_id: schemeId,
                    subject_id: { [req.db.Sequelize.Op.ne]: subject_id },
                },
            });

            if (existingCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject with this code already exists in the scheme',
                });
            }
        }

        const updatePayload = await enrichSubjectScopeFields(req.db.models, validatedData);
        await subject.update(updatePayload);

        // Fetch related data for response
        const scheme = await req.db.models.scheme.findByPk(subject.scheme_id);
        const branch = subject.branch_id
            ? await req.db.models.branch.findByPk(subject.branch_id)
            : null;

        res.status(200).json({
            success: true,
            data: {
                ...subject.toJSON(),
                scheme_name: scheme ? scheme.scheme_name : null,
                branch_name: branch ? branch.branch_name : null,
            },
            message: 'Subject updated successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in updateSubject:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Soft delete subject
const deleteSubject = async (req, res) => {
    try {
        const { subject_id } = subjectIdParamSchema.parse(req.params);

        const subject = await req.db.models.subject.findByPk(subject_id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        await subject.destroy();

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in deleteSubject:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Permanently delete subject
const permanentDeleteSubject = async (req, res) => {
    try {
        const { subject_id } = subjectIdParamSchema.parse(req.params);

        const subject = await req.db.models.subject.findByPk(subject_id, {
            paranoid: false,
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        // Check if subject is used anywhere (e.g., in exam schedules, grades, etc.)
        // Add checks for any dependent tables here

        await subject.destroy({ force: true });

        res.status(200).json({
            success: true,
            message: 'Subject permanently deleted successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in permanentDeleteSubject:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get subjects dropdown (for form selects)
const getSubjectsDropdown = async (req, res) => {
    try {
        const { scheme_id } = req.query;

        const whereCondition = { status: true };
        if (scheme_id) {
            whereCondition.scheme_id = scheme_id;
        }

        const subjects = await req.db.models.subject.findAll({
            where: whereCondition,
            attributes: [
                'subject_id',
                'subject_name',
                'subject_code',
                'subject_type',
                'credits',
                'sem',
                'scheme_id',
                'branch_id',
            ],
            order: [['sem', 'ASC'], ['subject_name', 'ASC']],
        });

        // Group by semester
        const subjectsBySemester = {};
        for (const subject of subjects) {
            const sem = subject.sem || 'Not Specified';
            if (!subjectsBySemester[sem]) {
                subjectsBySemester[sem] = [];
            }
            subjectsBySemester[sem].push(subject);
        }

        res.status(200).json({
            success: true,
            data: subjects,
            groupedBySemester: subjectsBySemester,
            message: 'Subjects dropdown retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getSubjectsDropdown:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get deleted subjects
const getDeletedSubjects = async (req, res) => {
    try {
        const subjects = await db.sequelize.query(
            `
      SELECT 
        s.*,
        sch.scheme_name, sch.scheme_year,
        b.branch_name, b.branch_code
      FROM subject s
      LEFT JOIN scheme sch ON s.scheme_id = sch.scheme_id
      LEFT JOIN branch b ON s.branch_id = b.branch_id
      WHERE s.deletedAt IS NOT NULL
      ORDER BY s.deletedAt DESC
    `,
            {
                nest: true,
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json({
            success: true,
            data: subjects,
            message: 'Deleted subjects retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getDeletedSubjects:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Restore soft deleted subject
const restoreSubject = async (req, res) => {
    try {
        const { subject_id } = subjectIdParamSchema.parse(req.params);

        const subject = await req.db.models.subject.findByPk(subject_id, {
            paranoid: false,
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found in records',
            });
        }

        if (!subject.deletedAt) {
            return res.status(400).json({
                success: false,
                message: 'Subject is already active',
            });
        }

        await subject.restore();

        res.status(200).json({
            success: true,
            message: 'Subject restored successfully',
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors || error.issues,
            });
        }

        console.error('Error in restoreSubject:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Bulk create subjects for a scheme
const bulkCreateSubjects = async (req, res) => {
    try {
        const { scheme_id, subjects } = req.body;

        // Validate scheme exists
        const scheme = await req.db.models.scheme.findByPk(scheme_id);
        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        const createdSubjects = [];
        const errors = [];

        for (const subjectData of subjects) {
            try {
                // Check for duplicate
                const existing = await req.db.models.subject.findOne({
                    where: {
                        subject_name: subjectData.subject_name,
                        scheme_id: scheme_id,
                        sem: subjectData.sem,
                    },
                });

                if (existing) {
                    errors.push({
                        subject_name: subjectData.subject_name,
                        error: 'Subject already exists in this scheme and semester',
                    });
                    continue;
                }

                const subject = await req.db.models.subject.create({
                    ...subjectData,
                    scheme_id: scheme_id,
                });
                createdSubjects.push(subject);
            } catch (err) {
                errors.push({
                    subject_name: subjectData.subject_name,
                    error: err.message,
                });
            }
        }

        res.status(201).json({
            success: true,
            data: {
                created: createdSubjects,
                failed: errors,
                total_created: createdSubjects.length,
                total_failed: errors.length,
            },
            message: `${createdSubjects.length} subjects created successfully`,
        });
    } catch (error) {
        console.error('Error in bulkCreateSubjects:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    getSubjectsByScheme,
    getSubjectsByBranch,
    getSubjectsBySemester,
    createSubject,
    updateSubject,
    deleteSubject,
    permanentDeleteSubject,
    getSubjectsDropdown,
    getDeletedSubjects,
    restoreSubject,
    bulkCreateSubjects,
};