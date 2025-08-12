import tensorflow as tf
import numpy as np

def _get_last_conv_layer_from_backbone(self, backbone):
    # find last Conv2D layer inside the backbone
    for layer in reversed(backbone.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return layer.name
    # fallback: search for layer name patterns
    for layer in reversed(backbone.layers):
        if 'conv' in layer.name or 'block_16' in layer.name or 'project' in layer.name:
            return layer.name
    raise ValueError("No Conv2D layer found in backbone")

def _prepare_model_inputs(self, model, img_array):
    """
    Build an inputs structure that mirrors model.inputs, but with the actual image tensor
    instead of Input placeholders. This handles tensors, lists and nested lists.
    """
    def replace_placeholder(struct):
        # if struct is a Tensor (Input), replace with img_array
        if isinstance(struct, tf.Tensor):
            return img_array
        # if it's a list/tuple, recurse
        if isinstance(struct, (list, tuple)):
            return [replace_placeholder(x) for x in struct]
        # fallback
        return img_array

    return replace_placeholder(model.inputs)

def generate_gradcam(self, model, img_array, backbone_name="mobilenetv2_1.00_224", conv_layer_name=None):
    """
    Robust Grad-CAM generator that:
     - finds the backbone layer (if nested),
     - determines last conv layer if conv_layer_name is None,
     - prepares inputs to match model.inputs structure,
     - computes heatmap.
    """
    # 1) Get backbone layer (if model wraps the backbone as a single layer)
    try:
        backbone = model.get_layer(backbone_name)
    except (ValueError, KeyError):
        # backbone not found by that name; try to detect it heuristically:
        # find first layer that is a Model (Functional) or has name containing 'mobilenet'
        backbone = None
        for layer in model.layers:
            if isinstance(layer, tf.keras.Model) or 'mobilenet' in layer.name:
                backbone = layer
                break
        if backbone is None:
            # if nothing found, fallback to top-level model for conv layer search
            backbone = model

    # 2) find conv_layer_name if not provided
    if conv_layer_name is None:
        conv_layer_name = _get_last_conv_layer_from_backbone(self, backbone)

    # get the conv layer object
    try:
        conv_layer = backbone.get_layer(conv_layer_name)
    except Exception as e:
        # if backbone doesn't have it, try top-level
        conv_layer = None
        try:
            conv_layer = model.get_layer(conv_layer_name)
        except Exception:
            raise ValueError(f"Cannot find conv layer '{conv_layer_name}' in backbone or model.") from e

    # 3) build grad_model using conv_layer.output and model.output
    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[conv_layer.output, model.output]
    )

    # 4) prepare the inputs to match model.inputs structure
    # ensure img_array is a tf.Tensor
    if not isinstance(img_array, tf.Tensor):
        img_tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)
    else:
        img_tensor = img_array

    prepared_inputs = _prepare_model_inputs(self, model, img_tensor)

    # 5) compute gradients and heatmap
    with tf.GradientTape() as tape:
        # ensure tape watches conv outputs / inputs
        # call grad_model with the prepared inputs structure
        conv_outputs, predictions = grad_model(prepared_inputs)
        # predicted class index
        predicted_class = tf.argmax(predictions[0])
        loss = predictions[:, predicted_class]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]  # H x W x C
    heatmap = tf.reduce_mean(tf.multiply(pooled_grads, conv_outputs), axis=-1)

    heatmap = tf.maximum(heatmap, 0)
    denom = tf.math.reduce_max(heatmap)
    heatmap = tf.math.divide_no_nan(heatmap, denom)

    return heatmap.numpy()
