import mongoose from "mongoose";
require('dotenv').config();
import { memberSchema } from "../models/memberSchema.js";

const Admin = mongoose.model("Admin", memberSchema);


//POST
export const addAdmin = (req, res) => {
    let newAdmin = new Admin(req.body);

    newAdmin.save((err, adminObject) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(adminObject);
    });
};

//GET
export const getAdmin = (req, res) => {
    Admin.find(async (err, adminObject) => {
        //save to DB
        if (err) {
            res.send(err);
        }

        // if database does not include master admin, forcefully add them
        if (!adminObject.some((item => item.email === process.env.MASTER_ADMIN_EMAIL))) {
            const newAdmin = new Admin({ name: "Master Admin", email: process.env.MASTER_ADMIN_EMAIL });
            newAdmin.save((err, adminObject) => {
                if (err) {
                    res.send(err);
                }
                // recursive call once master admin is added
                getAdmin(req, res);
            });
        } else {
            res.json(adminObject);
        }

    });
};


//PUT
export const changeAdmin = (req, res) => {
    let bodyid = req.body;
    console.log(bodyid);

    Admin.findByIdAndUpdate(
        req.body,
        { blocked: true },
        { new: true },
        (err, Admin) => {
            if (err) {
                res.send(err);
            }
            res.json(Admin);
        }
    );
};

//DELETE
export const deleteAdmin = (req, res) => {
    if (req.body.id !== undefined) {
        const { id, ...filter } = req.body;
        Admin.findByIdAndDelete(
            id,
            filter,
            (err, Admin) => {
                if (err) {
                    res.send(err);
                }
                res.json(Admin);
            }
        );
    } else {
        Admin.deleteOne(
            req.body,
            (err, Admin) => {
                if (err) {
                    res.send(err);
                }
                res.json(Admin);
            }
        );
    }
};
