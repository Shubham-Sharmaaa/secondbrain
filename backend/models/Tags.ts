import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: String,
});
const TagModel = mongoose.model("Tags", TagSchema);

export default TagModel;
