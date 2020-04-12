const express = require('express');
const router = express.Router();
const File = require('../classes/file');
const RouteCalculator = require('../classes/route.calculator');

/* GET users listing. */
router.post('/', (req, res, next) => {
    if (req.body) {
        const file = new File();
        file.writing(Object.values(req.body)).then(value => {
            res.json(req.body);
        }).catch(reason => {
            res.status(400);
            res.json({
                error: reason
            });
        });
    }
});

router.get('/:from/:to', (req, res, next) => {
    const {from, to} = req.params;
    const routeCalculator = new RouteCalculator(from, to);

    routeCalculator.calculate().then(value => {
        res.json(value);
    }).catch(reason => {
        res.status(400);
        res.json({
            error: reason.toString()
        });
    })


});

module.exports = router;
