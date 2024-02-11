import cv2
import os

cwd = os.getcwd()
# face_cascade = cv2.CascadeClassifier("/root/Downloads/project/haarcascade_frontalface_alt.xml")
face_cascade = cv2.CascadeClassifier(f"{cwd}\\haarcascade_frontalface_default.xml")
img = cv2.imread(f"{cwd}\\8peole.JPG")

if img is None:
  print("Failed to read image file")
  print(f"{cwd}\\opencvScripts\\dog.JPG")
else:
  print("Image file was read successfully")
  print(img.shape)
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  faces = face_cascade.detectMultiScale(gray, 1.3, 1)
  print (len(faces))
