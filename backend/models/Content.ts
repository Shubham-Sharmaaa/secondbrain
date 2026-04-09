import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;
const contentSchema = new Schema({
  userid: {
    type: ObjectID,
    ref: "Users",
  },
  type: {
    type: String,
    enum: ["document", "tweet", "youtube", "link"],
  },
  link: {
    type: String,
  },
  title: String,
  tags: [
    {
      type: ObjectID,
      ref: "Tags",
    },
  ],
});

const ContentModel = mongoose.model("Content", contentSchema);
export default ContentModel;
