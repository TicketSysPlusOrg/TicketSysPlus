import mongoose from "mongoose";

require("dotenv").config();
import { memberSchema } from "../models/memberSchema.js";

const Admin = mongoose.model("Admin", memberSchema);


//POST
export const addAdmin = async (req, res) => {
    let newAdmin = new Admin(req.body);

    newAdmin.save()
        .then(admin => {
            res.json(admin);
        })
        .catch((err) => {
            res.send(err);
        });
};

//GET
export const getAdmin = (req, res) => {
    Admin.find().exec()
        .then(async admins => {
            let savingNewAdmin = false;
            if (!admins.some((item => item.email === process.env.MASTER_ADMIN_EMAIL))) {
                savingNewAdmin = true;
                const newAdmin = new Admin({ name: "Master Admin", email: process.env.MASTER_ADMIN_EMAIL });
                await newAdmin.save()
                    .catch(err => {res.send(err);});
            }
            if (!admins.some((item => item.email === "ashwin@motorq.com"))) {
                savingNewAdmin = true;
                const newAdmin = new Admin({ name: "Master Admin", email: "ashwin@motorq.com" });
                await newAdmin.save()
                    .catch(err => {res.send(err);});
            }
            if (savingNewAdmin) {
                getAdmin(req, res);
            } else {
                res.json(admins);
            }
        })
        .catch(err => {
            res.send(err);
        });
};


//PUT
export const changeAdmin = (req, res) => {
    let bodyid = req.body;

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
