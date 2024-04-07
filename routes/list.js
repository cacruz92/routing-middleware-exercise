const express = require ("express");
const router = new express.Router();
const ExpressError = require("../expressError")
const list = require("../fakeDb")

router.get("/", function (req, res){
    res.json({list})
})

router.get("/:name", function(req, res){
    const foundItem = list.find(item => item.name === req.params.name);
    if (foundItem === undefined){
        throw new ExpressError("Item not found", 404)
    }else{
        return res.json({item: foundItem})
    }
})

router.post("/", function(req, res, next){
    try{

        // change all the '.query.' to '.body.'
        if(!req.query.name || !req.query.price){
            throw new ExpressError("Name and price required", 400);
        }
        const newItem = {
        name: req.query.name,
        price: req.query.price
        }

        list.push(newItem);
        return res.status(201).json({item: newItem})

    } catch(e) {

        return next(e)
    }
})

router.patch("/:name", function (req, res, next){
     // change all the '.query.' to '.body.'
    try{
        let foundItem = list.find(item => item.name === req.params.name);
        if(foundItem === undefined){
        throw new ExpressError("Item not found", 404)
        }
        foundItem.name = req.query.name;
        foundItem.price = req.query.name;
        return res.status(201).json({item: foundItem})
    }catch(e){
        return next(e);
    }
})

router.delete("/:name", function(req, res, next){
    let foundItem = list.find(item => item.name === req.params.name);
    if(foundItem === undefined){
        throw new ExpressError("Item not found", 404)
    }
    list.splice(foundItem, 1);
    return res.json ({message: "Item Deleted!"})
})



module.exports = router;