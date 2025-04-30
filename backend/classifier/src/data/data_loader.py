import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator

class DataLoader:
    def __init__(self, dataset_dir: str, img_size=(224, 224), batch_size=16, validation_split=0.15):
        self.dataset_dir = dataset_dir
        self.img_size = img_size
        self.batch_size = batch_size
        self.validation_split = validation_split

        self.datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=30,
            width_shift_range=0.3,
            height_shift_range=0.3,
            shear_range=0.3,
            zoom_range=0.3,
            horizontal_flip=True,
            brightness_range=[0.8, 1.2],
            fill_mode='nearest',
            validation_split=0.15
        )

    def get_train_val_generators(self):
        train_generator = self.datagen.flow_from_directory(
            self.dataset_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='training'
        )

        val_generator = self.datagen.flow_from_directory(
            self.dataset_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='validation'
        )

        return train_generator, val_generator

    def get_test_generator(self):
        return self.datagen.flow_from_directory(
            self.dataset_dir,
            target_size=self.img_size,
            batch_size=32,
            class_mode='categorical',
            shuffle=False
        )
