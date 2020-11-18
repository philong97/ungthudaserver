import tensorflow as tf
model = tf.keras.models.load_model('model/DenseNet201_160x160.h5')
def predict(data):
    ###  IMAGE PREPROCESSING  ###

    #  data-->preprocessed_data #
    
    ###          END          ###
    prediction = model.predict(preprocessed_data)
    
    # You may want to further format the prediction to make it more
    # human readable
    return prediction