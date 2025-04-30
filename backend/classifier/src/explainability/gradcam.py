import tensorflow as tf
import numpy as np
import cv2
import base64

class GradCAM:
    def __init__(self, model, last_conv_layer_name=None):
        self.model = model
        self._ensure_model_built()
        self.last_conv_layer_name = last_conv_layer_name or self.find_last_conv_layer()

    def _ensure_model_built(self):
        if not hasattr(self.model, "input") or self.model.input is None:
            input_shape = self.model.layers[0].input_shape[1:]
            dummy_input = tf.zeros((1, *input_shape))
            _ = self.model(dummy_input)

    def find_last_conv_layer(self):
        for layer in reversed(self.model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                return layer.name
            if isinstance(layer, tf.keras.Model):
                for sublayer in reversed(layer.layers):
                    if isinstance(sublayer, tf.keras.layers.Conv2D):
                        return f"{layer.name}/{sublayer.name}"
        raise ValueError("No Conv2D layer found. Cannot apply GradCAM.")

    def generate_heatmap(self, img_array):
        grad_model = tf.keras.models.Model(
            inputs=self.model.input,
            outputs=[
                self.model.get_layer(self.last_conv_layer_name).output,
                self.model.output,
            ],
        )

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            pred_index = tf.argmax(predictions[0])
            class_channel = predictions[:, pred_index]

        grads = tape.gradient(class_channel, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]

        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)

        return heatmap.numpy()

    def overlay_heatmap(self, heatmap, original_img, alpha=0.4, colormap=cv2.COLORMAP_JET):
        heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, colormap)
        superimposed_img = cv2.addWeighted(original_img, 1 - alpha, heatmap, alpha, 0)
        return superimposed_img

    def generate_and_encode(self, original_img_array, img_array_for_model):
        heatmap = self.generate_heatmap(img_array_for_model)
        superimposed_img = self.overlay_heatmap(heatmap, original_img_array)
        
        _, buffer = cv2.imencode('.jpg', superimposed_img)
        return base64.b64encode(buffer).decode('utf-8')
