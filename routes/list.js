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

        
        if(!req.body.name || !req.body.price){
            throw new ExpressError("Name and price required", 400);
        }
        const newItem = {
        name: req.body.name,
        price: req.body.price
        }

        list.push(newItem);
        return res.status(201).json({item: newItem})

    } catch(e) {

        return next(e)
    }
})

router.patch("/:name", function (req, res, next){
     
    try{
        let foundItem = list.find(item => item.name === req.params.name);
        if(foundItem === undefined){
        throw new ExpressError("Item not found", 404)
        }
        foundItem.name = req.body.name;
        foundItem.price = req.body.price;
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