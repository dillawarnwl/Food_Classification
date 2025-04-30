from src.data.data_loader import DataLoader
from src.models.food_classifier import FoodClassifier
from src.utils.callbacks import get_early_stopping, get_reduce_lr

def train(dataset_path, save_path):
    loader = DataLoader(dataset_path)
    train_gen, val_gen = loader.get_train_val_generators()

    model_obj = FoodClassifier(num_classes=train_gen.num_classes)
    model = model_obj.get_model()

    early_stopping = get_early_stopping()
    reduce_lr = get_reduce_lr()

    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=100,
        callbacks=[early_stopping, reduce_lr],
    )

    model.save(save_path)
    print(f"Model saved at {save_path}")
