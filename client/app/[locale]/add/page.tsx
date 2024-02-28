"use client";

import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useDocumentTitle } from "@mantine/hooks";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Image, ActionIcon, RingProgress as RingProgressMantine, Text, Center, rem, Flex, Button, Title, Loader, Container, Blockquote } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useLocale } from "next-intl";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import axios from "axios";
import { remove as removeDiacritics } from "diacritics";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import RingProgress from "@/components/RingProgress";
import Dots from "@/components/MainBanner/Dots";
import classes from "@/components/MainBanner/MainBanner.module.css";

export default function AddPage() {
  useDocumentTitle("Add");
  const router = useRouter();
  const locale = useLocale();

  const [active, setActive] = useState<number>(4);
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [existingSchoolYears, setExistingSchoolYears] = useState<Array<number>>([]);

  type ClazzData = {
    schoolYear: Date | null;
    clazzName: string;
    folderColor: string;
    students: Array<string>;
    photos: Array<FileWithPath>;
    studentsWithPhotos: Array<{ name: string, photo: FileWithPath, isPhotoValid: boolean, preview: React.ReactElement }>;
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
  const [classesInSelectedYear, setClassesInSelectedYear] = useState<string[]>([]);
  const [previews, setPreviews] = useState<React.ReactNode[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const [schoolYearProgress, setSchoolYearProgress] = useState<number>(0);
  const [clazzProgress, setClazzProgress] = useState<number>(0);
  const [studentsProgress, setStudentsProgress] = useState<number>(0);
  const [photosProgress, setPhotosProgress] = useState<number>(0);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years`)
      .then((res) => {
        const existingSchoolYearsArray: Array<number> = [];
        res.data.forEach((element: any) => {
          existingSchoolYearsArray.push(element.year);
        });
        setExistingSchoolYears(existingSchoolYearsArray);
      });

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years/${clazzData.schoolYear?.getFullYear()}`)
      .then((res) => {
        if (res.data) {
          setClassesInSelectedYear(res.data.classes.map((c: Class) => (
            c.name
          )));
        } 
      });
  }, []);

  const handlePickYearChange = (date: Date | null) => {
    const year = date?.getFullYear();
    setClazzData({ ...clazzData, schoolYear: date });

    if (year) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years/${year}`)
        .then((res) => {
          if (res.data) {
            setClassesInSelectedYear(res.data.classes.map((c: Class) => (
              c.name
            )));
          }
        });
    }
  }

  const handleClassNameChange = (n: string) => {
    const name = n.toUpperCase();
    const nameWithoutDiacritics = removeDiacritics(name);
    setClazzData({ ...clazzData, clazzName: nameWithoutDiacritics });

    if (name && classesInSelectedYear.includes(name)) {
      console.log("Class already exists");

    } else {
      console.log("Class does not exist");
    }
  }

  const handleFolderColorChange = (color: string) => {
    setClazzData({ ...clazzData, folderColor: color });
  }

  const handleCSVUpload = (file: File) => {
    Papa.parse(file, {
      delimiter: ";",
      complete: (results) => {
        const studentsNames = results.data[0] as Array<string>;
        const namesWithPhotos: Array<{ name: string, photo: FileWithPath, isPhotoValid: boolean, preview: React.ReactElement }> = [];
        studentsNames.forEach((name, index) => {
          namesWithPhotos.push({ name: name, photo: new File([], "") as FileWithPath, isPhotoValid: false, preview: <></> });
        });
        setClazzData({ ...clazzData, students: studentsNames, studentsWithPhotos: namesWithPhotos });
      },
    });
  }

  // const handlePhotosUpload = (files: FileWithPath[]) => {
  //   const updatedStudentsWithPhotos = clazzData.studentsWithPhotos.map((student, i) => {
  //     const imageUrl = URL.createObjectURL(files[i]);
  //     return {
  //       ...student,
  //       photo: files[i],
  //       preview: (
  //         <Link href={imageUrl} data-fancybox="gallery" data-caption={`${student.name}`} key={uuid()}>
  //           <Image radius="md" src={imageUrl} />
  //         </Link>
  //       ),
  //     };
  //   });

  //   setClazzData({ ...clazzData, photos: files, studentsWithPhotos: updatedStudentsWithPhotos });
  // }
  
  const handlePhotosUpload = (files: FileWithPath[]) => {
    const photos = files.slice(0, clazzData.students.length);
    const updatedStudentsWithPhotos = clazzData.students.map((student, i) => {
      let photo: FileWithPath;
      let preview: React.ReactNode;

      if (i < files.length) {
        photo = files[i];
        const imageUrl = URL.createObjectURL(photo);
        preview = (
          // <Link href={imageUrl} data-fancybox="gallery" data-caption={`${student}`} key={uuid()}>
            <Image radius="md" src={imageUrl} />
          // </Link>
        );
      } else {
        photo = new File([], "") as FileWithPath;
        preview = <></>;
      }

      return { name: student, photo: photo, isPhotoValid: true, preview: preview };
    });

    setClazzData({ ...clazzData, photos: photos, studentsWithPhotos: updatedStudentsWithPhotos });
  }

  const handleDeleteStudent = (index: number) => {
    const updatedStudents = clazzData.students.filter((s, i) => i !== index);
    const updatedPhotos = clazzData.photos.filter((p, i) => i !== index);
    const updatedStudentsWithPhotos = clazzData.studentsWithPhotos.filter((s, i) => i !== index);

    setClazzData({ ...clazzData, students: updatedStudents, photos: updatedPhotos, studentsWithPhotos: updatedStudentsWithPhotos });
  }

  const handleStudentsDataSubmission = async () => {
    try {
      setUploading(true);

      // POST new year if it does not exist
      if (!existingSchoolYears.includes(clazzData.schoolYear?.getFullYear() ?? 0)) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years`, {
          year: clazzData.schoolYear?.getFullYear(),
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
      if (!classesInSelectedYear.includes(clazzData.clazzName)) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years/${clazzData.schoolYear?.getFullYear()}/classes`, {
          name: clazzData.clazzName,
          folderColor: clazzData.folderColor,
        })
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

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years/${clazzData.schoolYear?.getFullYear()}/classes/${clazzData.clazzName.toLowerCase()}/students`, {
          lastname: studentNameParts[0],
          middlename: studentNameParts.length > 2 ? studentNameParts[1] : "",
          firstname: studentNameParts.length > 2 ? studentNameParts[2] : studentNameParts[1],
        })
        .then((res) => {
          setTimeout(() => setStudentsProgress(100 / clazzData.students.length * (i + 1)), 500);
          console.log("Submitted!");
        })
        .catch((error) => {
          console.log("Submission failed!");
          console.error(error);
        });
      }

      // POST new photos
      const formData = new FormData();

      for (let i = 0; i < clazzData.photos.length; i++) {
        formData.set("photo", clazzData.photos[i]);
        const studentNameParts = clazzData.students[i].split(" ");

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/photos`, formData, {
          params: {
            year: clazzData.schoolYear?.getFullYear(),
            clazz: clazzData.clazzName.toLowerCase(),
            name: `${studentNameParts[0]}${studentNameParts.length > 2 ? `_${studentNameParts[1]}` : ""}_${studentNameParts.length > 2 ? studentNameParts[2] : studentNameParts[1]}`
          },
          headers: {
            "content-type": "multipart/form-data"
          }
        })
        .then((res) => {
          setTimeout(() => setPhotosProgress(100 / clazzData.photos.length * (i + 1)), 500);
          console.log("Uploaded!");
        })
        .catch((error) => {
          console.log("Upload failed!");
          console.error(error);
        });
      }
      setTimeout(() => router.push(`/${locale}`), 2500);
    } catch (error) {
      console.error(error);
    }
  }
  
  console.log(clazzData);
  // console.log(classesInSelectedYear);
  // console.log(existingSchoolYears);

  const stateAndHandlers = {
    active: active,
    setActive: setActive,
    nextStep: nextStep,
    prevStep: prevStep,
    clazzData: clazzData,
    setClazzData: setClazzData,
    classesInSelectedYear: classesInSelectedYear,
    previews: previews,
    handlePickYearChange: handlePickYearChange,
    handleClassNameChange: handleClassNameChange,
    handleFolderColorChange: handleFolderColorChange,
    handleCSVUpload: handleCSVUpload,
    handlePhotosUpload: handlePhotosUpload,
    handleDeleteStudent: handleDeleteStudent,
    handleStudentsDataSubmission: handleStudentsDataSubmission,
  };

  return (
    <>
      {
        uploading === false ? (
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

              <Flex
                direction="column"
                justify="center"
              >
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify={{ base: "center", md: "space-between" }}
                  align={{ base: "center", md: "center" }}
                >
                  <RingProgress value={schoolYearProgress} label="School year" />
                  <RingProgress value={clazzProgress} label="Class" />
                  <RingProgress value={studentsProgress} label="Students" />
                  <RingProgress value={photosProgress} label="Photos" />
                </Flex>
                {/* <div className={classes.controls}>
                  <Button component={Link} href={`/${locale}/about`} className={classes.control} size="md" variant="default" color="gray">
                    aaa
                  </Button>
                  <Button component={Link} href={`/${locale}/add`} className={classes.control} size="md">
                    bbb
                  </Button>
                </div> */}
              </Flex>
              {/* <Blockquote color="blue" cite="– Forrest Gump" icon={<IconInfoCircle />} mt={60}>
                Life is like an npm install – you never know what you are going to get.
              </Blockquote> */}

            </div>
          </Container>
        ) : (
          <Stepper stateAndHandlers={stateAndHandlers} />
        )
      }
    </>
  );
}
