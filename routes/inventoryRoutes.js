const express = require('express');
const router = express.Router();
const { CheckSizes, queryInventory } = require('../controllers/inventoryController');
const { writeDataFile, readDataFile } = require('../services/file.service');
const { apiKeyAuth, checkAdmin } = require('../controllers/usersControllers');


router.post('/', apiKeyAuth, checkAdmin, CheckSizes, async (req, res) => {
    const inventoryList = await readDataFile();
    inventoryList.push(req.body);
    await writeDataFile(inventoryList);
    res.json({ data: inventoryList });
});



router.get('/', queryInventory);

// router.get('/', async (req, res) => {

// })

router.get('/:id', async (req, res) => {
    const inventoryList = await readDataFile();
    const id = parseInt(req.params.id);
    const item = inventoryList.find((item) => item.id === id);

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ data: item });
});

router.patch('/:id', apiKeyAuth, checkAdmin, async (req, res) => {
    const inventoryList = await readDataFile();
    const id = parseInt(req.params.id);
    const itemIndex = inventoryList.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = { ...inventoryList[itemIndex], ...req.body };
    inventoryList[itemIndex] = updatedItem;
    await writeDataFile(inventoryList);

    res.json({ data: updatedItem });
});

router.delete('/:id', apiKeyAuth, checkAdmin, async (req, res) => {
    const inventoryList = await readDataFile();
    const id = parseInt(req.params.id);
    const newInventoryList = inventoryList.filter((item) => item.id !== id);

    await writeDataFile(newInventoryList);

    res.json({ data: newInventoryList });
});

module.exports = router;
