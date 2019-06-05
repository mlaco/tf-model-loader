const tf = require("@tensorflow/tfjs");
const modelLoader = require("tf-model-loader!./model/model.json");
const model = tf.loadLayersModel(modelLoader);
console.log(model.summary());
