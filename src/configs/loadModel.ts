import * as tflite from "@tensorflow/tfjs-tflite";

export async function loadModel() {
  const tfliteModel = await tflite.loadTFLiteModel(
    "https://storage.googleapis.com/ml-model-terravision/model-in-prod/model.tflite"
  );
  return tfliteModel;
}
