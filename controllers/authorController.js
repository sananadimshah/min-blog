import { json } from "express";
import authorModel from "../models/authorModel.js";
import jwt from 'jsonwebtoken';

const isValidEmail = (email) => {
  const regex = /[a-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}/.test(email);
  // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  return regex;
};

const createauthor = async (req, res) => {
  try {
    let { fname, lname, title, email, password } = req.body;
    let request = ['fname', 'lname', 'title', 'email', 'password']
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ status: false, msg: "Data is required" });
      
    }
    for(let ele of request) {
      if(!req.body[ele]){
      return res
        .status(400)
        .send({ status: false, msg: `${ele} is required`})};
    }

    const usedemail = await authorModel.findOne({ email});
    if (usedemail) {
      return res
        .status(400)
        .send({ status: false, msg: `${email.trim()} email Already Exist`});
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, msg: "Email is required in validformat" });
    }

    
    if (!["Mr", "Mrs", "Miss"].includes(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "Must be in Mr , Mrs , Miss " });
    }

    let authorCreated = await authorModel.create(req.body);
    return res
      .status(201)
      .send({ status: true, msg: "Successfully Created", authorCreated });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let request = ["email", "password"];

    if (Object.keys(req.body).length === 0)
      return res.status(400).send({ status: false, msg: `Data is required` });

    for (let element of request) {
      if (!req.body[element])
        return res
          .status(400)
          .send({ status: false, msg: `${element} is required` });
    }

    let user = await authorModel.findOne({ email: email, password: password });
    if (!user)
      return res
        .status(400)
        .send({ status: false, msg: `email or the password is not correct` });

    let payload = {
      authorId: user._id.toString(),
      data: "Blog Site",
    };
    let token = jwt.sign(payload, "blogging");
    return res.status(201).send({ status: true, token: token });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message || 'Internal server error' });
  }
};



export { createauthor,login};
