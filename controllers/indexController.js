const UserModel = require('../models/UserModel');

const fs = require('fs');


const viewRecord = async (req, res) => {
    try {
        let record = await UserModel.find({});
        return res.render('index', { record });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }
}

const add = (req, res) => {
    return res.render('add');
}


const addData = async (req, res) => {
    try {
        const { name, des, price } = req.body;

        if (!name || !des || !price) {
            console.log("All Fields are required");
            return false
        }

        let userAdd = await UserModel.create({
            name, des, price, image: req.file.path
        });

        if (userAdd) {
            console.log("User Successfully Added");
            return res.redirect('/');
        } else {
            console.log('Invalid');
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const deleteData = async (req, res) => {
    try {
        let deleterecord = await UserModel.findById(req.query.id);

        fs.unlinkSync(deleterecord.image);
        let del = await UserModel.findByIdAndDelete(req.query.id);

        console.log("record deleted");
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        return false;
    }
}

const editData = async(req,res) => {
    try{
        let id=  req.query.id;
        let single = await UserModel.findById(id);
        return res.render('edit',{single});
    }catch(err){
        console.log(err);
        return false;
    }
}

const updateRecord = async(req,res) => {
    try{
        if(req.file){
            let old = await UserModel.findById(req.body.id);
            fs.unlinkSync(old.image);
            let up = await UserModel.findByIdAndUpdate(req.body.id,{
                name : req.body.name,
                des : req.body.des,
                price : req.body.price,
                image : req.file.path
            });
            if(up){
                console.log("record update");
                return res.redirect('/');
            }
        }else{
            let old = await UserModel.findById(req.body.id);
            let up = await UserModel.findByIdAndUpdate(req.body.id,{
                name : req.body.name,
                des : req.body.des,
                price : req.body.price,
                image : old.image
            });
            if(up){
                console.log("record update");
                return res.redirect('/');
            }
        }
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = {
    viewRecord, add, addData, deleteData, editData, updateRecord
}