import os
from tensorflow import keras
from flask import Flask, jsonify
from gevent.pywsgi import WSGIServer
import urllib.request
import numpy as np

app = Flask(__name__)

@app.route("/")
def hello1():
	return jsonify({"Label":"Hello1"})


@app.route("/<urlImg>")
def predict(urlImg):
    keras.backend.clear_session();
    model = keras.models.load_model('models/DenseNet201_160x160.h5');
    #decode
    # inputs="\\";
    # outputs="/";
    # linkk = str(urlImg);
    # trans = linkk.maketrans(inputs, outputs)
    # linkk=linkk.translate(trans)
    # url_response = urllib.request.urlopen(linkk)
    # image = np.asarray(bytearray(url_response.read()), dtype="uint8")
    ###################
    urlImg ="https://hakufarm.vn/wp-content/uploads/2017/11/hinh-anh-y-nghia-cua-hoa-huong-duong.jpg"
    f = open('00000001.jpg','wb')
    f.write(urllib.request.urlopen(urlImg).read())
    f.close()
    img = keras.preprocessing.image.load_img('00000001.jpg', target_size=(160, 160))
    img_tensor = keras.preprocessing.image.img_to_array(img)
    img_tensor = np.expand_dims(img_tensor, axis=0)
    img_tensor /= 255
    predict = model.predict(img_tensor)
    kq = np.argmax(predict, axis=-1)
    print(kq)
    if kq == 0:
        return jsonify({"Lable":"1"})
    elif kq == 1:
        return jsonify({"Lable":"0"})
    else :
        jsonify({"Lable":"-1"})

if __name__ == '__main__':
	#app.run(debug=True)
    # Serve the app with gevent
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()
