import mongoose, {model, models, Schema} from "mongoose";

const PlatformSchema = new Schema({
  name: {type:String,required:true},
  parent: {type:mongoose.Types.ObjectId, ref:'Platform'},
  category: [{type:Object}]
});

export const Platform = models?.Platform || model('Platform', PlatformSchema);