from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

def get_early_stopping(patience=5):
    return EarlyStopping(
        monitor='val_loss',
        patience=patience,
        restore_best_weights=True
    )

def get_reduce_lr(factor=0.3, patience=3, min_lr=1e-6):
    return ReduceLROnPlateau(
        monitor='val_loss',
        factor=factor,
        patience=patience,
        min_lr=min_lr,
        verbose=1
    )
