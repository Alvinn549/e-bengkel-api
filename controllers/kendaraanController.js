const { User, Kendaraan } = require('../db/models');
const {
  kendaraanValidationSchema,
} = require('../validator/kendaraanValidator');
const { faker } = require('@faker-js/faker/locale/id_ID');
const path = require('path');
const fs = require('fs');

// Get all kendaraans
async function getAllKendaraan(req, res) {
  try {
    const kendaraans = await Kendaraan.findAll({
      attributes: [
        'id',
        'user_id',
        'no_plat',
        'merek',
        'foto',
        'foto_url',
        'createdAt',
        'updatedAt',
      ],
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
      },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(kendaraans);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Get kendaraan by ID
async function getKendaraanById(req, res) {
  try {
    const kendaraanId = req.params.id;
    const kendaraan = await Kendaraan.findByPk(kendaraanId, {
      attributes: [
        'id',
        'user_id',
        'no_plat',
        'merek',
        'foto',
        'foto_url',
        'createdAt',
        'updatedAt',
      ],
      include: {
        model: User,
        as: 'pemilik',
        attributes: ['id', 'nama', 'no_telp', 'alamat', 'role'],
      },
    });

    if (!kendaraan) {
      return res.status(404).json({ error: 'Kendaraan tidak ditemukan!' });
    }

    res.status(200).json(kendaraan);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error', message: error.message });
  }
}

// Create new kendaraan
async function storeKendaraan(req, res) {
  try {
    const { user_id, no_plat, merek } = req.body;

    const { error } = kendaraanValidationSchema.validate({
      user_id,
      no_plat,
      merek,
    });
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    const existingKendaraan = await Kendaraan.findOne({ where: { no_plat } });

    if (existingKendaraan) {
      return res
        .status(409)
        .json({ message: 'Kedaraan dengan No Plat ini sudah terdaftar!' });
    }

    if (!req.files || !req.files.foto) {
      return res
        .status(400)
        .json({ message: 'Foto kendaraan tidak boleh kosong!' });
    }

    const file = req.files.foto;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s/g, '')}`;
    const fileUrl = `${req.protocol}://${req.get(
      'host'
    )}/upload/images/${fileName}`;

    const allowedTypes = ['.png', '.jpeg', '.jpg'];

    if (!allowedTypes.includes(ext.toLowerCase())) {
      return res.status(422).json({ message: 'Invalid image format!' });
    }

    if (fileSize > 5000000) {
      return res
        .status(422)
        .json({ message: 'Image size must be less than 5MB!' });
    }

    await file.mv(`./public/upload/images/${fileName}`);

    var foto = fileName;
    var foto_url = fileUrl;

    const newKendaraaan = await Kendaraan.create({
      id: faker.string.uuid(),
      user_id,
      no_plat,
      merek,
      foto,
      foto_url,
    });

    return res.status(201).json({
      message: 'Kendaraan berhasil disimpan!',
      id: newKendaraaan.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Update kendaraan
async function updateKendaraan(req, res) {
  try {
    return res.status(200).json({ msg: 'updateKendaraan' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

// Delete kendaraan
async function destroyKendaraan(req, res) {
  try {
    return res.status(200).json({ msg: 'destroyKendaraan' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Internal server error!', message: error.message });
  }
}

module.exports = {
  getAllKendaraan,
  getKendaraanById,
  storeKendaraan,
  updateKendaraan,
  destroyKendaraan,
};
