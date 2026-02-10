// Import model Finance
const Finance = require('../models/financeModel');

// ============================
// GET ALL FINANCES
// ============================
const getFinances = async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// CREATE FINANCE
// ============================
const createFinance = async (req, res) => {
  const { title, amount, type } = req.body;

  if (!title || !amount || !type) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  try {
    const finance = await Finance.create({
      user: req.user._id,
      title,
      amount,
      type,
    });

    res.status(201).json(finance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// UPDATE FINANCE
// ============================
const updateFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance || finance.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const updatedFinance = await Finance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedFinance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// DELETE FINANCE
// ============================
const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);

    if (!finance || finance.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    await finance.deleteOne();
    res.status(200).json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// SUMMARY FINANCE
// ============================
const getFinanceSummary = async (req, res) => {
  try {
    const finances = await Finance.find({ user: req.user._id });

    const totalIncome = finances
      .filter((f) => f.type === 'income')
      .reduce((acc, cur) => acc + cur.amount, 0);

    const totalExpense = finances
      .filter((f) => f.type === 'expense')
      .reduce((acc, cur) => acc + cur.amount, 0);

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// FILTER FINANCE
// ============================
const filterFinance = async (req, res) => {
  try {
    const { type, month, year } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;

    if (year) {
      query.createdAt = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(Number(year) + 1, 0, 1),
      };
    }

    if (month) {
      const y = year || new Date().getFullYear();
      query.createdAt = {
        $gte: new Date(y, month - 1, 1),
        $lt: new Date(y, month, 1),
      };
    }

    const finances = await Finance.find(query).sort({ createdAt: -1 });
    res.status(200).json(finances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// EXPORT SEMUA CONTROLLER
// ============================
module.exports = {
  getFinances,
  createFinance,
  updateFinance,
  deleteFinance,
  getFinanceSummary,
  filterFinance,
};
