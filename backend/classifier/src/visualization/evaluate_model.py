import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
from tensorflow.keras.models import load_model
from src.data.data_loader import DataLoader

def evaluate(model_path, dataset_path):
    loader = DataLoader(dataset_path)
    test_gen = loader.get_test_generator()

    model = load_model(model_path)

    y_pred = model.predict(test_gen)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true = test_gen.classes

    class_names = list(test_gen.class_indices.keys())

    conf_matrix = confusion_matrix(y_true, y_pred_classes)
    print("Confusion Matrix:")
    print(conf_matrix)

    plt.figure(figsize=(8, 6))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues',
                xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix', fontsize=16)
    plt.xlabel('Predicted Labels', fontsize=14)
    plt.ylabel('True Labels', fontsize=14)
    plt.show()

    print("\nClassification Report:")
    print(classification_report(y_true, y_pred_classes, target_names=class_names))
