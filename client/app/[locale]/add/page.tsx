"use client";

import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useDocumentTitle } from "@mantine/hooks";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Image } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useLocale } from "next-intl";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import axios from "axios";
import { remove as removeDiacritics } from "diacritics";

export default function AddPage() {
  useDocumentTitle("Add");
  const router = useRouter();
  const locale = useLocale();

  const [active, setActive] = useState<number>(0);
  // const [nextStepButtonDisabled, setNextStepButtonDisabled] = useState<Array<boolean>>([false, false, true, true]);
  let nextStepButtonDisabled: Array<boolean> = [false, false, false, false];
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [existingSchoolYears, setExistingSchoolYears] = useState<Array<number>>([]);

  type ClazzData = {
    schoolYear: Date | null;
    clazzName: string;
    folderColor: string;
    students: Array<string>;
    photos: Array<FileWithPath>;
    studentsWithPhotos: Array<{ name: string, photo: FileWithPath, preview: React.ReactNode }>;
  };

  const initialClazzData: ClazzData = {
    schoolYear: new Date(),
    clazzName: "P1A",
    folderColor: "#fcbc19",
    students: [],
    photos: [],
    studentsWithPhotos: [],
  };

  const [clazzData, setClazzData] = useState<ClazzData>(initialClazzData);
  const [classesInSelectedYear, setClassesInSelectedYear] = useState<string[]>([]);
  const [previews, setPreviews] = useState<React.ReactNode[]>([]);

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

  const checkStepCompletion = () =>{
    if (active === 0) {
      const buttonValues = nextStepButtonDisabled;
      buttonValues[1] = true;
      // setNextStepButtonDisabled(buttonValues);





    } else if (active === 1) {

      console.log("one");

      // if (clazzData.clazzName === "" || clazzData.folderColor === "") {
      //   const buttonValues = nextStepButtonDisabled;
      //   buttonValues[1] = true;
      //   setNextStepButtonDisabled(buttonValues);
      // } else {
      //   const buttonValues = nextStepButtonDisabled;
      //   buttonValues[1] = false;
      //   setNextStepButtonDisabled(buttonValues);
      // }

      if (clazzData.clazzName === "" || clazzData.folderColor === "") {
        const newState = [...nextStepButtonDisabled];
        newState[1] = true;
        nextStepButtonDisabled = newState;
      
      }  // } else {
      //   const newState = [...nextStepButtonDisabled];
      //   newState[1] = false;
      //   nextStepButtonDisabled = newState;
      // }

      console.log(nextStepButtonDisabled)



    } else if (active === 2) {
      console.log("two");
    } else if (active === 3) {
      console.log("three");
    }
  }

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

    checkStepCompletion();
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

    checkStepCompletion();
  }

  const handleFolderColorChange = (color: string) => {
    setClazzData({ ...clazzData, folderColor: color });

    checkStepCompletion();
  }

  const handleCSVUpload = (file: File) => {
    Papa.parse(file, {
      delimiter: ";",
      complete: (results) => {
        const studentsNames = results.data[0] as Array<string>;
        const namesWithPhotos: Array<{ name: string, photo: FileWithPath, preview: React.ReactNode }> = [];
        studentsNames.forEach((name, index) => {
          namesWithPhotos.push({ name: name, photo: new File([], "") as FileWithPath, preview: <></> });
        });
        setClazzData({ ...clazzData, students: studentsNames, studentsWithPhotos: namesWithPhotos });
      },
    });

    checkStepCompletion();
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
          <Link href={imageUrl} data-fancybox="gallery" data-caption={`${student}`} key={uuid()}>
            <Image radius="md" src={imageUrl} />
          </Link>
        );
      } else {
        photo = new File([], "") as FileWithPath;
        preview = <></>;
      }

      return { name: student, photo: photo, preview: preview };
    });

    setClazzData({ ...clazzData, photos: photos, studentsWithPhotos: updatedStudentsWithPhotos });
  }

  const handleStudentsDataSubmission = async () => {
    try {
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

      // POST new class
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

      // POST new students
      for (let i = 0; i < clazzData.students.length; i++) {
        const studentNameParts = clazzData.students[i].split(" ");

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_LOCALE}/api/years/${clazzData.schoolYear?.getFullYear()}/classes/${clazzData.clazzName.toLowerCase()}/students`, {
          lastname: studentNameParts[0],
          middlename: studentNameParts.length > 2 ? studentNameParts[1] : "",
          firstname: studentNameParts.length > 2 ? studentNameParts[2] : studentNameParts[1],
        })
        .then((res) => {
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
          console.log("Uploaded!");
        })
        .catch((error) => {
          console.log("Upload failed!");
          console.error(error);
        });
      }
      router.push(`/${locale}`);
    } catch (error) {
      console.error(error);
    }
  }
  
  console.log(clazzData);

  const stateAndHandlers = {
    active: active,
    setActive: setActive,
    nextStep: nextStep,
    prevStep: prevStep,
    nextStepButtonDisabled: nextStepButtonDisabled,
    clazzData: clazzData,
    setClazzData: setClazzData,
    classesInSelectedYear: classesInSelectedYear,
    previews: previews,
    handlePickYearChange: handlePickYearChange,
    handleClassNameChange: handleClassNameChange,
    handleFolderColorChange: handleFolderColorChange,
    handleCSVUpload: handleCSVUpload,
    handlePhotosUpload: handlePhotosUpload,
    handleStudentsDataSubmission: handleStudentsDataSubmission,
  };

  return (
    <Stepper stateAndHandlers={stateAndHandlers} />
  );
}
