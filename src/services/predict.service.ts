// import * as tf from "@tensorflow/tfjs";
// import * as tflite from "@tensorflow/tfjs-tflite";

// // Define the model input features
// interface PropertyFeatures {
//   lt: number; // Luas Tanah (land area)
//   lb: number; // Luas Bangunan (building area)
//   jkt: number; // Jumlah Kamar Tidur (number of bedrooms)
//   jkm: number; // Jumlah Kamar Mandi (number of bathrooms)
//   kota: string; // City
// }

// // Define the model output
// interface Prediction {
//   price: number; // Predicted price or any other output you're interested in
// }

// // Load the TFLite model
// async function loadModel(): Promise<tflite.TFLiteModel> {
//   const tfliteModel = await tflite.loadTFLiteModel(
//     "https://storage.googleapis.com/ml-model-terravision/model-in-prod/model.tflite"
//   );
//   return tfliteModel;
// }

// // Function to predict based on input features
// async function predict(
//     model: tflite.TFLiteModel,
//     features: PropertyFeatures
//   ): Promise<Prediction> {
//     // Convert input features to tensors
//     const inputTensor = tf.tensor2d([
//       [features.lt, features.lb, features.jkt, features.jkm]
//     ]);

//     // Perform prediction with TFLite model
//     const output = model.predict(inputTensor);

//     // Convert output to tensor if needed
//     const outputTensor = Array.isArray(output) ? output[0] : output;

//     // Get prediction value
//     const prediction = outputTensor.dataSync()[0];

//     // Dispose of input tensor
//     inputTensor.dispose();

//     // Dispose of output tensor if it's different from the input tensor
//     if (output !== outputTensor) {
//       outputTensor.dispose();
//     }

//     // Return the prediction
//     return { price: prediction };
//   }

// // Rest of the code remains the same...
