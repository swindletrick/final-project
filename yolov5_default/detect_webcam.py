import glob
import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random
import numpy as np
from datetime import datetime
import os.path
import os


from models.experimental import attempt_load
from utils.general import check_img_size, non_max_suppression, scale_coords
from utils.plots import plot_one_box
from utils.torch_utils import select_device, time_synchronized
from functions.letterbox import letterbox
from flask import Flask, request, redirect, url_for, send_from_directory,render_template, Response
from werkzeug.utils import secure_filename

device = select_device('')
model = attempt_load('best.pt', map_location=device)  # load FP32 model

# Get names and colors
names = model.module.names if hasattr(model, 'module') else model.names
print('names', names)

colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

half = device.type != 'cpu'  # half precision only supported on CUDA
if half:
    model.half()  # to FP16

stride = int(model.stride.max())  # model stride
imgsz = check_img_size(416, s=stride)  # check img_size

#cap = cv2.VideoCapture('http://192.168.1.69:8080/video')
cap = cv2.VideoCapture(0)

now = datetime.now()
dmy = now.strftime("%d%B%Y")

app = Flask(__name__,static_folder = "/imgs")
UPLOAD_FOLDER = '/imgs'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

pred_name = []
def gen_frame():
    while True:
        _, img0 = cap.read()
        img = letterbox(img0, imgsz, stride=stride)[0]
        img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB, to 3x416x416
        img = np.ascontiguousarray(img)
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Symbol Recognition.
        pred = model(img)[0]
        pred = non_max_suppression(pred, 0.7, 0.2)

        #Haarcascade
        #gray = cv2.cvtColor(img0, cv2.COLOR_BGR2GRAY)
        #faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        for i, det in enumerate(pred):  # detections per image
            s = ''
            if len(det):
                det[:, :4] = scale_coords(
                    img.shape[2:], det[:, :4], img0.shape).round()

                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string
                for *xyxy, conf, cls in reversed(det):
                    # Rescale boxes from img_size to im0 size
                    det[:, :4] = scale_coords(
                        img.shape[2:], det[:, :4], img0.shape).round()
                    label = f'{names[int(cls)]} {conf:.2f}'
                    namelog = f'{names[int(cls)]}'
                    plot_one_box(xyxy, img0, label=label,
                                color=colors[int(cls)], line_thickness=3)
                    now = datetime.now()
                    current_time = now.strftime("%D %H:%M:%S")
                    d_m_y = now.strftime("%d%B%Y")
                    h_m_s = now.strftime("%H.%M.%S")
                    if os.path.exists('{}'.format(d_m_y)) == False:
                        os.makedirs('{}'.format(d_m_y))
                    if os.path.exists(d_m_y) == True:
                        pass
                #if(label != None):
                    if(namelog in pred_name):
                        pass
                    if(namelog not in pred_name):
                        cv2.imwrite("{}/{}{}.jpg".format(d_m_y,namelog ,h_m_s), img0)
                        lines = ["<p>"+namelog +" "+ current_time+"</p>"]
                        with open('templates/log{}.html'.format(d_m_y), 'a') as f:
                            for line in lines:
                                f.write(line)
                                f.write('\n')
                        pred_name.append(str(namelog))
            else:
                pred_name.clear()
                #Haar detect

        #for (x,y,w,h) in faces:
            #img_Unknow = cv2.rectangle(img0,(x,y),((x+w),(y+h)),(110,255,123),4)
            #roi_color = img0[y:y+h, x:x+w]
            #cv2.putText(img0, 'Unknow', (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.8,(110,255,123),2)

        #cv2.imshow('result', img0)
        #if cv2.waitKey(10) == ord('q'):
        #    break
        ret, jpeg = cv2.imencode('.jpg', img0)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')



@app.route('/video_feed')
def video_feed():
    return Response(gen_frame(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/log')
def video_log():
    return render_template('log{}.html'.format(dmy))

@app.route('/{}/<filename>'.format(dmy))
def send_image(filename):
    return send_from_directory('{}'.format(dmy),filename)

@app.route('/show')
def uploaded_file():
    #gallery_images = glob.glob('imgs/*')
    gallery_images = [i for i in os.listdir('{}/'.format(dmy)) if i.endswith('.jpg')]
    print(gallery_images)
    return render_template('show.html',gallery_images = gallery_images)

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=8000, threaded=True, use_reloader=False)