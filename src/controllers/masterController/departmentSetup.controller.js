const departmentSetupService = require('../../services/masterService/departmentSetup.service.js');

const buildEmailStatusMessage = (emailDelivery) => {
  if (!emailDelivery) {
    return 'Department created successfully. Credential emails could not be confirmed.';
  }
  const { sent = [], failed = [] } = emailDelivery;
  if (sent.length && !failed.length) {
    const list = sent.map((s) => s.email).join(', ');
    return `Department created successfully. Login credentials were emailed to: ${list}. Ask recipients to check spam/junk if not received.`;
  }
  if (sent.length && failed.length) {
    const ok = sent.map((s) => s.email).join(', ');
    const bad = failed.map((f) => `${f.email} (${f.error})`).join('; ');
    return `Department created. Emails sent to: ${ok}. Failed for: ${bad}.`;
  }
  if (failed.length) {
    const bad = failed.map((f) => `${f.email} (${f.error})`).join('; ');
    return `Department created but credential emails failed: ${bad}. Check SMTP settings in .env and server logs.`;
  }
  return 'Department created successfully. No credential emails were queued (no new accounts).';
};

const createDepartmentSetup = async (req, res) => {
  try {
    const data = await departmentSetupService.createDepartmentSetup(
      req.body,
      req.user?.uid
    );
    return res.status(201).json({
      success: true,
      data,
      message: buildEmailStatusMessage(data.email_delivery),
    });
  } catch (error) {
    console.error('Error in createDepartmentSetup:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const getDepartmentSetup = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const data = await departmentSetupService.getDepartmentSetup(depart_id);
    return res.status(200).json({
      success: true,
      data,
      message: 'Department setup retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getDepartmentSetup:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const updateDepartmentSetup = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const data = await departmentSetupService.updateDepartmentSetup(
      depart_id,
      req.body,
      req.user?.uid
    );
    return res.status(200).json({
      success: true,
      data,
      message: buildEmailStatusMessage(data.email_delivery),
    });
  } catch (error) {
    console.error('Error in updateDepartmentSetup:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

const restoreDepartment = async (req, res) => {
  try {
    const { depart_id } = req.params;
    const result = await departmentSetupService.restoreDepartmentSetup(
      depart_id,
      req.user?.uid
    );
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Error in restoreDepartment:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  createDepartmentSetup,
  getDepartmentSetup,
  updateDepartmentSetup,
  restoreDepartment,
};
