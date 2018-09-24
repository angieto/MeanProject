const bcrypt = require('bcrypt-as-promised');
const User = require("./model");

module.exports = {
    CreateUser: (req,res) =>User.create(req.body)
                            .then(data=>console.log("Create User success") || res.json(data))
                            .catch(errs=>console.log("Create User error") || res.json(errs)),
    GetUser:(req,res) =>User.findById(req.params.id)                 
                            .then(data=>console.log("get one User success") || res.json(data))
                            .catch(errs=>console.log("get one User error") || res.json(errs)),
    CreateDate:(req,res)=>User.findByIdAndUpdate(req.params.user1_id,{$push:{Date: req.body}}, {new :true})
                            .then(data=>console.log("Create Date User success") || res.json(data))
                            .catch(errs=>console.log("Create Date User error") || res.json(errs)),
    UpdateUserDate:(req,res)=>User.findByIdAndUpdate(req.params.user2_id,{$push:{Date: req.body}})
                            .then(data=>console.log("Update User Date success") || res.json(data))
                            .catch(errs=>console.log("Update User Date error") || res.json(errs)),
    RemoveDate:(req,res)=>User.findByIdAndRemove(req.params.id)
                            .then(data=>console.log("Create Date User success") || res.json(data))
                            .catch(errs=>console.log("Create Date User error") || res.json(errs)),
}
                            