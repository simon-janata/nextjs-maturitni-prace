import axios from "axios";
import { remove as removeDiacritics } from "diacritics";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import { Image } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";

type ClazzData = {
  schoolYear: Date | null;
  clazzName: string;
  folderColor: string;
  students: Array<string>;
  photos: Array<FileWithPath>;
  studentsWithPhotos: Array<{
    name: string;
    photo: File;
    amountOfFaces: number;
    preview: React.ReactElement;
  }>;
};

const initialClazzData: ClazzData = {
  schoolYear: new Date(),
  clazzName: "",
  folderColor: "#fcbc19",
  students: [],
  photos: [],
  studentsWithPhotos: [],
};

type ClazzDataContextType = {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  isNextStepButtonDisabled: boolean;
  setIsNextStepButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  nextStep: () => void;
  prevStep: () => void;
  clazzData: ClazzData;
  clazzesInSelectedSchoolYear: string[];
  faceHeightRange: [number, number];
  setFaceHeightRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  faceWidthRange: [number, number];
  setFaceWidthRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  eyeHeightRange: [number, number];
  setEyeHeightRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  eyeWidthRange: [number, number];
  setEyeWidthRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  arePhotosResizing: boolean;
  arePhotosValidating: boolean;
  hasValidationBeenDone: boolean;
  uploading: boolean;
  schoolYearProgress: number;
  clazzProgress: number;
  studentsProgress: number;
  photosProgress: number;
  handlePickYearChange: (date: Date | null) => void;
  handleClazzNameChange: (n: string) => void;
  handleFolderColorChange: (color: string) => void;
  handleCSVUpload: (files: File) => void;
  handleResizePhotos: (files: FileWithPath[]) => void;
  handleValidatePhotos: () => void;
  handleDeleteStudent: (index: number) => void;
  handleStudentNameChange: (index: number, name: string) => void;
  handleClazzDataSubmission: () => void;
};

// Create the context with a default value
export const ClazzDataContext = createContext<ClazzDataContextType | null>(null);

export const ClazzDataContextProvider = ({ children }: { children: ReactNode }) => {
  const p = useTranslations("Pathnames");
  const router = useRouter();
  const locale = useLocale();

  const [active, setActive] = useState<number>(0);
  const [isNextStepButtonDisabled, setIsNextStepButtonDisabled] =
    useState<boolean>(true);
  const nextStep = () => {
    setIsNextStepButtonDisabled(true);
    setActive((current) => (current < 4 ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [clazzData, setClazzData] = useState<ClazzData>(initialClazzData);
  const [existingSchoolYears, setExistingSchoolYears] = useState<Array<number>>(
    []
  );
  const [clazzesInSelectedSchoolYear, setClazzesInSelectedSchoolYear] =
    useState<string[]>([]);

  const [faceHeightRange, setFaceHeightRange] = useState<[number, number]>([
    20, 50,
  ]);
  const [faceWidthRange, setFaceWidthRange] = useState<[number, number]>([
    20, 50,
  ]);
  const [eyeHeightRange, setEyeHeightRange] = useState<[number, number]>([
    2, 10,
  ]);
  const [eyeWidthRange, setEyeWidthRange] = useState<[number, number]>([2, 10]);

  const [arePhotosResizing, setArePhotosResizing] = useState<boolean>(false);
  const [arePhotosValidating, setArePhotosValidating] =
    useState<boolean>(false);
  const [hasValidationBeenDone, setHasValidationBeenDone] =
    useState<boolean>(false);

  let invalidPhotoStudentRecords: Array<{ studentName: string; photoName: string }> = [];

  const [uploading, setUploading] = useState<boolean>(false);
  const [schoolYearProgress, setSchoolYearProgress] = useState<number>(0);
  const [clazzProgress, setClazzProgress] = useState<number>(0);
  const [studentsProgress, setStudentsProgress] = useState<number>(0);
  const [photosProgress, setPhotosProgress] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears`)
      .then((res) => {
        const existingSchoolYearsArray: Array<number> = [];
        res.data.forEach((element: SchoolYear) => {
          existingSchoolYearsArray.push(element.year);
        });
        setExistingSchoolYears(existingSchoolYearsArray);
      });

    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/cs/api/schoolYears/${clazzData.schoolYear?.getFullYear()}`
      )
      .then((res) => {
        if (res.data) {
          setClazzesInSelectedSchoolYear(
            res.data.clazzes.map((c: Clazz) => c.name)
          );
        }
      });
  }, []);

  const handlePickYearChange = (date: Date | null) => {
    const schoolYear = date?.getFullYear();
    setClazzData({ ...clazzData, schoolYear: date });

    if (schoolYear) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears/${schoolYear}`
        )
        .then((res) => {
          if (res.data) {
            setClazzesInSelectedSchoolYear(
              res.data.clazzes.map((c: Clazz) => c.name)
            );
          } else {
            setClazzesInSelectedSchoolYear([]);
          }
        });
    }
  };

  const handleClazzNameChange = (n: string) => {
    const name = n.toUpperCase();
    const nameWithoutDiacritics = removeDiacritics(name);
    setClazzData({ ...clazzData, clazzName: nameWithoutDiacritics });
  };

  const handleFolderColorChange = (color: string) => {
    setClazzData({ ...clazzData, folderColor: color });
  };

  const handleCSVUpload = (file: File) => {
    setHasValidationBeenDone(false);
    Papa.parse(file, {
      complete: (results: Papa.ParseResult<string>) => {
        const studentsNames = results.data.map((row) => row[0]);
        const namesWithPhotos: Array<{
          name: string;
          photo: File;
          amountOfFaces: number;
          preview: React.ReactElement;
        }> = [];
        studentsNames.forEach((name) => {
          namesWithPhotos.push({
            name: name,
            photo: new File([], ""),
            amountOfFaces: 0,
            preview: <></>,
          });
        });
        setClazzData({
          ...clazzData,
          students: studentsNames,
          studentsWithPhotos: namesWithPhotos,
        });
      },
    });
  };

  const handleResizePhotos = async (files: FileWithPath[]) => {
    setArePhotosResizing(true);
    setHasValidationBeenDone(false);

    const formData = new FormData();

    const photos = files.slice(0, clazzData.students.length);
    const updatedStudentsWithPhotosPromises = clazzData.students.map(
      async (student, index) => {
        let photoIn: FileWithPath;
        let photoOut: File = new File([], "");
        let preview: React.ReactNode;
        let imageUrl: string = "";

        if (photos[index]) {
          photoIn = photos[index];

          // console.log(photoIn);
          formData.set("photo", photos[index]);

          await axios
            .post(
              `${process.env.NEXT_PUBLIC_API_URL}/cs/api/photos/resize`,
              formData,
              {
                headers: {
                  "content-type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              const base64Response = res.data.resizedImage;
              imageUrl = `data:image/jpeg;base64,${base64Response}`;

              const byteCharacters = atob(base64Response);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "image/jpeg" });
              photoOut = new File([blob], photoIn.name, { type: "image/jpeg" });
            })
            .catch((error) => {
              console.log("Failed to resize the photo.");
              console.error("Error details:", error);
            })
            .finally(() => {
              console.log("The photo resize operation has been completed.");
            });

          preview = (
            <Link
              href={imageUrl}
              data-fancybox="gallery"
              data-caption={`${photoIn.name}`}
              key={uuid()}
            >
              <Image radius="md" src={imageUrl} />
            </Link>
          );
        } else {
          photoOut = new File([], "");
          preview = <></>;
        }

        return {
          name: student,
          photo: photoOut,
          amountOfFaces: 0,
          preview: preview,
        };
      }
    );

    const updatedStudentsWithPhotos = await Promise.all(
      updatedStudentsWithPhotosPromises
    );

    setClazzData({
      ...clazzData,
      photos: photos,
      studentsWithPhotos: updatedStudentsWithPhotos,
    });

    setArePhotosResizing(false);
  };

  const handleValidatePhotos = async () => {
    setArePhotosValidating(true);

    const formData = new FormData();

    const validationPromises = clazzData.studentsWithPhotos.map((student) => {
      if (student.photo.size !== 0) {
        formData.set("photo", student.photo);

        formData.set("minFaceHeight", faceHeightRange[0].toString());
        formData.set("maxFaceHeight", faceHeightRange[1].toString());
        formData.set("minFaceWidth", faceWidthRange[0].toString());
        formData.set("maxFaceWidth", faceWidthRange[1].toString());
        formData.set("minEyeHeight", eyeHeightRange[0].toString());
        formData.set("maxEyeHeight", eyeHeightRange[1].toString());
        formData.set("minEyeWidth", eyeWidthRange[0].toString());
        formData.set("maxEyeWidth", eyeWidthRange[1].toString());

        return axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/cs/api/photos/validate`,
            formData,
            {
              headers: {
                "content-type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            const amountOfFaces = res.data.amountOfFaces;
            student.amountOfFaces = amountOfFaces;
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            console.log("Validation finished for a student!");
          });
      } else {
        student.amountOfFaces = 0;
      }
    });

    Promise.all(validationPromises)
      .then(() => {
        setHasValidationBeenDone(true);
        setArePhotosValidating(false);
        nextStep();
      })
      .catch((error) => {
        console.error("An error occurred during validation:", error);
      });
  };

  const handleDeleteStudent = (index: number) => {
    invalidPhotoStudentRecords.push({
      studentName: clazzData.students[index],
      photoName:
        index <= clazzData.photos.length - 1
          ? clazzData.photos[index].name
          : "",
    });

    console.log(invalidPhotoStudentRecords);

    const updatedStudents = clazzData.students.filter((s, i) => i !== index);
    const updatedPhotos = clazzData.photos.filter((p, i) => i !== index);
    const updatedStudentsWithPhotos = clazzData.studentsWithPhotos.filter(
      (s, i) => i !== index
    );

    setClazzData({
      ...clazzData,
      students: updatedStudents,
      photos: updatedPhotos,
      studentsWithPhotos: updatedStudentsWithPhotos,
    });
  };

  const handleStudentNameChange = (index: number, name: string) => {
    const updatedStudents = clazzData.students.map((student, i) => (i === index ? name : student));
    const updatedStudentsWithPhotos = clazzData.studentsWithPhotos.map(
      (student, i) => (i === index ? { ...student, name: name } : student)
    );
    setClazzData({
      ...clazzData,
      students: updatedStudents,
      studentsWithPhotos: updatedStudentsWithPhotos,
    });
  };

  const handleClazzDataSubmission = async () => {
    try {
      setUploading(true);

      // POST new year if it does not exist
      if (
        !existingSchoolYears.includes(clazzData.schoolYear?.getFullYear() ?? 0)
      ) {
        await axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears`, {
            schoolYear: clazzData.schoolYear?.getFullYear(),
          })
          .then((res) => {
            console.log("Submitted!");
          })
          .catch((error) => {
            console.log("Submission failed!");
            console.error(error);
          });
      }
      setTimeout(() => setSchoolYearProgress(100), 500);

      // POST new class if it does not exist
      if (!clazzesInSelectedSchoolYear.includes(clazzData.clazzName)) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/cs/api/clazzes`,
            {
              name: clazzData.clazzName,
              folderColor: clazzData.folderColor,
            },
            {
              params: {
                schoolYear: clazzData.schoolYear?.getFullYear(),
              },
            }
          )
          .then((res) => {
            console.log("Submitted!");
          })
          .catch((error) => {
            console.log("Submission failed!");
            console.error(error);
          });
      }
      setTimeout(() => setClazzProgress(100), 500);

      // POST new students
      clazzData.studentsWithPhotos.map(async (student, i) => {
        const studentNameParts = student.name.split(" ");

        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URL}/cs/api/students`,
            {
              lastname: studentNameParts[0],
              middlename:
                studentNameParts.length > 2 ? studentNameParts[1] : "",
              firstname:
                studentNameParts.length > 2
                  ? studentNameParts[2]
                  : studentNameParts[1],
            },
            {
              params: {
                schoolYear: clazzData.schoolYear?.getFullYear(),
                clazzName: clazzData.clazzName.toLowerCase(),
              },
            }
          )
          .then((res) => {
            setTimeout(
              () =>
                setStudentsProgress(
                  (100 / clazzData.students.length) * (i + 1)
                ),
              500
            );
            console.log("Submitted!");
          })
          .catch((error) => {
            console.log("Submission failed!");
            console.error(error);
          });
      });

      // POST new photos
      clazzData.studentsWithPhotos.map(async (student, i) => {
        const formData = new FormData();
        formData.set("photo", student.photo);

        formData.set("minFaceHeight", faceHeightRange[0].toString());
        formData.set("maxFaceHeight", faceHeightRange[1].toString());
        formData.set("minFaceWidth", faceWidthRange[0].toString());
        formData.set("maxFaceWidth", faceWidthRange[1].toString());
        formData.set("minEyeHeight", eyeHeightRange[0].toString());
        formData.set("maxEyeHeight", eyeHeightRange[1].toString());
        formData.set("minEyeWidth", eyeWidthRange[0].toString());
        formData.set("maxEyeWidth", eyeWidthRange[1].toString());

        const studentNameParts = student.name.split(" ");

        await axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/photos`, formData, {
            params: {
              schoolYear: clazzData.schoolYear?.getFullYear(),
              clazzName: clazzData.clazzName.toLowerCase(),
              studentName: `${studentNameParts[0]}${
                studentNameParts.length > 2 ? `_${studentNameParts[1]}` : ""
              }_${
                studentNameParts.length > 2
                  ? studentNameParts[2]
                  : studentNameParts[1]
              }`,
            },
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((res) => {
            const success = res.data.success;
            if (success === false) {
              invalidPhotoStudentRecords.push({
                studentName: student.name,
                photoName: student.photo.name,
              });
            }

            setTimeout(
              () =>
                setPhotosProgress((100 / clazzData.photos.length) * (i + 1)),
              500
            );
            console.log("Uploaded!");
          })
          .catch((error) => {
            console.log("Upload failed!");
            console.error(error);
          });
      });

      // Save a text file with records of students who have invalid or uncropped photos
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/cs/api/invalidPhotoStudentRecords`,
          {
            invalidPhotoStudentRecords: invalidPhotoStudentRecords,
          },
          {
            params: {
              schoolYear: clazzData.schoolYear?.getFullYear(),
              clazzName: clazzData.clazzName.toLowerCase(),
            },
          }
        )
        .then((res) => {
          console.log("Text file created!");
        })
        .catch((err) => {
          console.log("Text file creation failed!");
          console.error(err);
        });

      setTimeout(
        () =>
          router.push(
            `/${locale}/${p(
              "schoolYears"
            )}/${clazzData.schoolYear?.getFullYear()}/${p(
              "clazzes"
            )}/${clazzData.clazzName.toLowerCase()}`
          ),
        2000
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ClazzDataContext.Provider
      value={{
        active,
        setActive,
        isNextStepButtonDisabled,
        setIsNextStepButtonDisabled,
        nextStep,
        prevStep,
        clazzData,
        clazzesInSelectedSchoolYear,
        faceHeightRange,
        setFaceHeightRange,
        faceWidthRange,
        setFaceWidthRange,
        eyeHeightRange,
        setEyeHeightRange,
        eyeWidthRange,
        setEyeWidthRange,
        arePhotosResizing,
        arePhotosValidating,
        hasValidationBeenDone,
        uploading,
        schoolYearProgress,
        clazzProgress,
        studentsProgress,
        photosProgress,
        handlePickYearChange,
        handleClazzNameChange,
        handleFolderColorChange,
        handleCSVUpload,
        handleResizePhotos,
        handleValidatePhotos,
        handleDeleteStudent,
        handleStudentNameChange,
        handleClazzDataSubmission,
      }}
    >
      {children}
    </ClazzDataContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useClazzData = (): ClazzDataContextType => {
  const context = useContext(ClazzDataContext);
  if (context === null) {
    throw new Error("useClazzData must be used within a ClazzDataProvider");
  }
  return context;
};
