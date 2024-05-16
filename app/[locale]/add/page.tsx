"use client";

import axios from "axios";
import { remove as removeDiacritics } from "diacritics";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import Dots from "@/components/MainBanner/Dots";
import classes from "@/components/MainBanner/MainBanner.module.css";
import RingProgress from "@/components/RingProgress";
import Stepper from "@/components/Stepper";
import { Container, Flex, Image } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useDocumentTitle } from "@mantine/hooks";

export default function AddPage() {
  const t = useTranslations("AddPage");
  const p = useTranslations("Pathnames");
  useDocumentTitle(`${t("tabTitle")}`);
  const router = useRouter();
  const locale = useLocale();

  const [active, setActive] = useState<number>(0);
  const [hasValidationBeenDone, setHasValidationBeenDone] = useState<boolean>(false);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [existingSchoolYears, setExistingSchoolYears] = useState<Array<number>>(
    []
  );

  type ClazzData = {
    schoolYear: Date | null;
    clazzName: string;
    folderColor: string;
    students: Array<string>;
    photos: Array<FileWithPath>;
    studentsWithPhotos: Array<{
      name: string;
      photo: File;
      isPhotoValid: boolean;
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

  const [clazzData, setClazzData] = useState<ClazzData>(initialClazzData);
  const [clazzesInSelectedSchoolYear, setClazzesInSelectedSchoolYear] =
    useState<string[]>([]);

  const [faceHeightRange, setFaceHeightRange] = useState<[number, number]>([
    5, 10,
  ]);
  const [faceWidthRange, setFaceWidthRange] = useState<[number, number]>([
    5, 10,
  ]);
  const [eyeHeightRange, setEyeHeightRange] = useState<[number, number]>([
    5, 7,
  ]);
  const [eyeWidthRange, setEyeWidthRange] = useState<[number, number]>([5, 7]);

  const [arePhotosResizing, setArePhotosResizing] = useState<boolean>(false);
  const [arePhotosValidating, setArePhotosValidating] =
    useState<boolean>(false);

  const [invalidPhotoStudentRecords, setInvalidPhotoStudentRecords] = useState<
    Array<{ studentName: string; photoName: string }>
  >([]);

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
    const year = date?.getFullYear();
    setClazzData({ ...clazzData, schoolYear: date });

    if (year) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/cs/api/schoolYears/${year}`)
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
          isPhotoValid: boolean;
          preview: React.ReactElement;
        }> = [];
        studentsNames.forEach((name) => {
          namesWithPhotos.push({
            name: name,
            photo: new File([], ""),
            isPhotoValid: false,
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
        let photoIsValid: boolean = false;

        if (photos[index]) {
          photoIn = photos[index];

          console.log(photoIn);
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
          isPhotoValid: photoIsValid,
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
            const isSingleFace = res.data.isSingleFace;
            student.isPhotoValid = isSingleFace;
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            console.log("Validation finished for a student!");
          });
      } else {
        student.isPhotoValid = false;
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
    setInvalidPhotoStudentRecords([
      ...invalidPhotoStudentRecords,
      {
        studentName: clazzData.students[index],
        photoName: index <= (clazzData.photos.length - 1) ? clazzData.photos[index].name : "",
        // photoName: clazzData.photos[index].name,
      },
    ]);

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
      for (let i = 0; i < clazzData.students.length; i++) {
        const studentNameParts = clazzData.students[i].split(" ");

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
      }

      // POST new photos
      const formData = new FormData();

      for (let i = 0; i < clazzData.studentsWithPhotos.length; i++) {
        formData.set("photo", clazzData.studentsWithPhotos[i].photo);

        formData.set("minFaceHeight", faceHeightRange[0].toString());
        formData.set("maxFaceHeight", faceHeightRange[1].toString());
        formData.set("minFaceWidth", faceWidthRange[0].toString());
        formData.set("maxFaceWidth", faceWidthRange[1].toString());
        formData.set("minEyeHeight", eyeHeightRange[0].toString());
        formData.set("maxEyeHeight", eyeHeightRange[1].toString());
        formData.set("minEyeWidth", eyeWidthRange[0].toString());
        formData.set("maxEyeWidth", eyeWidthRange[1].toString());

        const studentNameParts = clazzData.students[i].split(" ");

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
      }

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

  const stateAndHandlers = {
    active: active,
    hasValidationBeenDone: hasValidationBeenDone,
    setActive: setActive,
    nextStep: nextStep,
    prevStep: prevStep,
    clazzData: clazzData,
    setClazzData: setClazzData,
    faceHeightRange: faceHeightRange,
    faceWidthRange: faceWidthRange,
    eyeHeightRange: eyeHeightRange,
    eyeWidthRange: eyeWidthRange,
    setFaceHeightRange: setFaceHeightRange,
    setFaceWidthRange: setFaceWidthRange,
    setEyeHeightRange: setEyeHeightRange,
    setEyeWidthRange: setEyeWidthRange,
    clazzesInSelectedSchoolYear: clazzesInSelectedSchoolYear,
    arePhotosResizing: arePhotosResizing,
    arePhotosValidating: arePhotosValidating,
    handlePickYearChange: handlePickYearChange,
    handleClazzNameChange: handleClazzNameChange,
    handleFolderColorChange: handleFolderColorChange,
    handleCSVUpload: handleCSVUpload,
    handleResizePhotos: handleResizePhotos,
    handleValidatePhotos: handleValidatePhotos,
    handleDeleteStudent: handleDeleteStudent,
    handleClazzDataSubmission: handleClazzDataSubmission,
  };

  return (
    <>
      {uploading === true ? (
        <Container className={classes.wrapper}>
          <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 100, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 200, top: 0 }} />
          <Dots className={classes.dots} style={{ left: 0, top: 40 }} />
          <Dots className={classes.dots} style={{ right: 0, top: 0 }} />
          <Dots className={classes.dots} style={{ right: 100, top: 0 }} />
          <Dots className={classes.dots} style={{ right: 160, top: 0 }} />
          <Dots className={classes.dots} style={{ right: 0, top: 40 }} />

          <div className={classes.inner}>
            <Flex direction="column" justify="center">
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify={{ base: "center", md: "space-between" }}
                align={{ base: "center", md: "center" }}
              >
                <RingProgress
                  value={schoolYearProgress}
                  label={t("schoolYearProgress")}
                />
                <RingProgress
                  value={clazzProgress}
                  label={t("clazzProgress")}
                />
                <RingProgress
                  value={studentsProgress}
                  label={t("studentsProgress")}
                />
                <RingProgress
                  value={photosProgress}
                  label={t("photosProgress")}
                />
              </Flex>
            </Flex>
          </div>
        </Container>
      ) : (
        <>
          <Stepper stateAndHandlers={stateAndHandlers} />
        </>
      )}
    </>
  );
}
