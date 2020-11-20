import base64
import numpy as np
import pandas as pd 
import tensorflow as tf

IMAGE_WIDTH = 160
IMAGE_HEIGHT = 160
IMAGE_SIZE=(IMAGE_WIDTH, IMAGE_HEIGHT)
model = tf.keras.models.load_model('model/DenseNet201_160x160.h5')

def predict(data):
    ###  IMAGE PREPROCESSING  ###
    fh = open("predict.jpg", "wb")
    fh.write(base64.b64decode(data))
    fh.close()
    #  data-->preprocessed_data #
    image = tf.keras.preprocessing.image.load_img('predict.jpg',target_size=IMAGE_SIZE)
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr])  # Convert single image to a batch.
    input_arr = input_arr/255
    ###          END          ###
    prediction = model.predict(input_arr)
    # You may want to further format the prediction to make it more
    # human readable
    return prediction