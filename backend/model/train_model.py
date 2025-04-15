import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.applications import MobileNet
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import numpy as np
import os

# Enable mixed precision training for better performance
tf.keras.mixed_precision.set_global_policy('mixed_float16')

# Optimized data preprocessing
def create_data_generators(dataset_path):
    # MobileNet-specific preprocessing
    train_datagen = ImageDataGenerator(
        preprocessing_function=tf.keras.applications.mobilenet.preprocess_input,
        rotation_range=30,
        width_shift_range=0.25,
        height_shift_range=0.25,
        shear_range=0.25,
        zoom_range=0.25,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.15
    )

    # Increase batch size if GPU memory allows (was 32)
    batch_size = 64

    train_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=(150, 150),
        batch_size=batch_size,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    validation_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=(150, 150),
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    return train_generator, validation_generator

# Optimized model architecture
def create_optimized_model(num_classes):
    # Load MobileNet with pre-trained weights
    base_model = MobileNet(
        weights='imagenet',
        include_top=False,
        input_shape=(150, 150, 3)
    )

    # Freeze more layers for better feature extraction
    for layer in base_model.layers[:-20]:
        layer.trainable = False

    # Build model
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax', dtype='float32')  # Mixed precision output
    ])

    return model

# Training function with optimizations
def train_model(dataset_path):
    # Get data generators
    train_generator, validation_generator = create_data_generators(dataset_path)
    num_classes = len(train_generator.class_indices)

    # Create and compile model
    model = create_optimized_model(num_classes)
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3)]
    )

    # Define callbacks
    early_stopping = EarlyStopping(
        monitor='val_accuracy',
        patience=10,
        restore_best_weights=True
    )

    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=5,
        min_lr=1e-6
    )

    # Calculate steps per epoch
    steps_per_epoch = train_generator.samples // train_generator.batch_size
    validation_steps = validation_generator.samples // validation_generator.batch_size

    # Train the model
    history = model.fit(
        train_generator,
        steps_per_epoch=steps_per_epoch,
        epochs=50,
        validation_data=validation_generator,
        validation_steps=validation_steps,
        callbacks=[early_stopping, reduce_lr],
        verbose=1
    )

    return model, history

# Main execution
if __name__ == "__main__":
    dataset_path = '/content/drive/MyDrive/Food-dataset'
    model, history = train_model(dataset_path)

    # Define the save path in Google Drive
    save_path = '/content/drive/MyDrive/Models/food_classifier_model.h5'

    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    # Save the model to Google Drive
    model.save(save_path)
    print(f"Model saved to: {save_path}")