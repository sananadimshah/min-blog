import blogmodel from "../models/blogModel.js";
import authorModel from "../models/authorModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const createblogs = async (req, res) => {
  let { title, body, authorId, category } = req.body;

  try {
    if (!title || !body || !authorId || !category) {
      return res
        .status(400)
        .send({ status: false, msg: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).send({ status: false, msg: "Invalid AuthorId" });
    }

    let author = await authorModel.findById({ _id: req.body.authorId });
    if (!author) {
      return res
        .status(400)
        .send({ status: false, msg: "This Author doesn't exist" });
    }
    let saved = await blogmodel.create(req.body);
    return res
      .status(201)
      .send({ status: true, msg: "Successfully created", saved });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    let authorId = req.query.authorId;
    if (authorId && !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).send({
        status: false,
        msg: "AuthorId must be present in a valid format",
      });
    }
    let check = await blogmodel.find({
      ...req.query,
      isDeleted: false,
      isPublished: true,
    });
    if (check == 0) {
      return res.status(404).send({ status: false, msg: "No blogs found" });
    }
    res.status(201).send({ status: true, msg: "Successfully GetBlogs", check });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBlogs = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    let bodyData = req.body;
    let updateValue = { $set: { isPublished: true, publishedAt: Date.now() } };

    //======================================= Start Validation===============================================//

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .send({ msg: `${blogId} is invalid`, status: false });
    }

    const blogExist = await blogmodel.findById({
      _id: blogId,
    });

    if (!blogExist) {
      return res.status(404).send({ msg: "No document exist", status: false });
    }

    if (Object.keys(bodyData).length == 0) {
      return res.status(200).send({
        msg: "User not update anything",
        data: blogExist,
        status: true,
      });
    }
    if (bodyData.title) {
      if (typeof bodyData.title !== "string") {
        return res
          .status(400)
          .send({ msg: "title must be in String", status: false });
      }
      updateValue["$set"]["title"] = bodyData.title;
    }

    if (bodyData.body) {
      if (typeof bodyData.body !== "string") {
        return res
          .status(400)
          .send({ msg: "body is must be in String", status: false });
      }
      updateValue["$set"]["body"] = bodyData.body;
    }
    if (bodyData.tags) {
      updateValue["$push"] = {};
      updateValue["$push"]["tags"] = bodyData.tags;
    }
    if (bodyData.category) {
      updateValue["$push"] = {};
      updateValue["$push"]["category"] = bodyData.category;
    }
    if (bodyData.subcategory) {
      if (!updateValue["$push"]) {
        updateValue["$push"] = {};
      }
      updateValue["$push"]["subcategory"] = bodyData.subcategory;
    }
    // console.log(updateValue)

    const updateDocument = await blogmodel.findByIdAndUpdate(
      { _id: blogId, isDeleted: false },
      updateValue,
      { returnDocument: "after" }
    );

    return res.status(200).send({
      msg: "blog update successfully",
      data: updateDocument,
      status: true,
    });
  } catch (err) {
    return res.status(500).send({ msg: err.message, status: false });
  }
};

const deleteBlogs = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .send({ msg: `${blogId} is invalid`, status: false });
    }

    let blog = await blogmodel.findOne({ _id: blogId, isDeleted: false });
    if (!blog) {
      return res.status(404).send({ msg: "No document exist", status: false });
    }
    
    await blogmodel.findByIdAndUpdate(
      blogId,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    return res.status(200).send({ status: false, msg: "Deleted successfully" });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deletebyQyery = async (req, res) => {
  try {
    let { category, tag, subcategory, authorId } = req.query;

    if (Object.keys(req.query).length == 0) {
      return res.status(400).send({ msg: "Pls dive data", status: false });
    }
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res
        .status(400)
        .send({ msg: `${authorId} is invalid`, status: false });
    }

    let blog = await blogmodel.findOne({ ...req.query });
    if (!blog) {
      return res.status(404).send({ msg: "No Blog exist", status: false });
    }

    if (blog.isDeleted === true) {
      return res
        .status(400)
        .send({ msg: "This document is already deleted", status: false });
    }

    let deletebyQyery = await blogmodel.findOneAndUpdate(
      req.query,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    return res
      .status(200)
      .send({ msg: "Deleted", status: true, data: deletebyQyery });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

export { createblogs, getBlogs, updateBlogs, deleteBlogs, deletebyQyery };
