# import cv2

# # Load the pre-trained face detection model
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# # Load the image
# image_path = r"C:\Users\janat\source\repos\nextjs-maturitni-prace\client\opencvScripts\8people.jpg"
# image = cv2.imread(image_path)

# # Convert the image to grayscale
# gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # Detect faces in the image
# # faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=6, minSize=(70, 70))
# faces = face_cascade.detectMultiScale(gray_image, 1.1, 4, minSize=(400, 400))

# # Draw rectangles around the faces and count them
# face_count = 0
# for (x, y, w, h) in faces:
#     cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
#     faces = image[y:y + h, x:x + w] 
#     cv2.imshow("face",faces) 
#     # cv2.imwrite('face.jpg', faces) 
#     # face_count += 1

# # Display the number of faces
# print("Number of faces detected:", face_count)

# # Display the image with rectangles drawn around faces
# cv2.imshow('Face Counter', image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

import cv2

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load the image
image_path = r"C:\Users\janat\source\repos\nextjs-maturitni-prace\client\opencvScripts\test6.jpg"
image = cv2.imread(image_path)

# Convert the image to grayscale
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Detect faces in the image
faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(300, 300))

# Process each detected face
for (x, y, w, h) in faces:
    # Extract the region of interest (ROI) from the top of the hair to the shoulders
    top_hair_y = max(0, y - int(0.35 * h))
    shoulders_y = y + h
    roi = image[top_hair_y:shoulders_y, x:x+w]

    # Draw a rectangle around the detected face
    cv2.rectangle(image, (x, top_hair_y), (x+w, shoulders_y), (255, 0, 0), 2)

    # Add a label indicating the face
    cv2.putText(image, 'Face', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

# Display the labeled image
cv2.imshow('Face Detection and Labeling', image)
cv2.waitKey(0)
cv2.destroyAllWindows()
