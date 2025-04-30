from tensorflow.keras.applications import MobileNet
from tensorflow.keras.layers import (
    Dense,
    GlobalAveragePooling2D,
    Dropout,
    BatchNormalization,
)
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam


class FoodClassifier:
    def __init__(self, input_shape=(224, 224, 3), num_classes=5, learning_rate=1e-4):
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.learning_rate = learning_rate
        self.model = self.build_model()

    def build_model(self):
        base_model = MobileNet(
            weights="imagenet", include_top=False, input_shape=self.input_shape
        )

        for layer in base_model.layers[:20]:
            layer.trainable = True

        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.5)(x)
        x = BatchNormalization()(x)
        x = Dense(128, activation="relu")(x)
        predictions = Dense(self.num_classes, activation="softmax")(x)

        model = Model(inputs=base_model.input, outputs=predictions)

        model.compile(
            optimizer=Adam(learning_rate=self.learning_rate),
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )

        return model

    def get_model(self):
        return self.model
