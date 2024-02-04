"use client";

import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useDocumentTitle } from "@mantine/hooks";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Image } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useLocale } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddPage() {
  useDocumentTitle("Add");
  const router = useRouter();
  const locale = useLocale();

  const [active, setActive] = useState<number>(0);
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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
    fetch(`/${locale}/api/years/${clazzData.schoolYear?.getFullYear()}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setClassesInSelectedYear(data.classes.map((c: Class) => (
          c.name
        )));
      });
  }, []);

  const handlePickYearChange = (date: Date | null) => {
    const year = date?.getFullYear();
    setClazzData({ ...clazzData, schoolYear: date });

    if (year) {
      fetch(`/${locale}/api/years/${year}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setClassesInSelectedYear(data.classes.map((c: Class) => (
            c.name
          )));
        });
    }
  }

  const handleClassNameChange = (n: string) => {
    const name = n.toUpperCase();
    setClazzData({ ...clazzData, clazzName: name });

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
        const namesWithPhotos: Array<{ name: string, photo: FileWithPath, preview: React.ReactNode }> = [];
        studentsNames.forEach((name, index) => {
          namesWithPhotos.push({ name: name, photo: new File([], "") as FileWithPath, preview: <></> });
        });
        setClazzData({ ...clazzData, students: studentsNames, studentsWithPhotos: namesWithPhotos });
      },
    });
  }

  const handlePhotosUpload = (files: FileWithPath[]) => {
    // setPreviews(...previews, files.map((file, index) => {
    //   const imageUrl = URL.createObjectURL(file);
    //   return (
    //     <Link
    //       href={imageUrl}
    //       data-fancybox="gallery"
    //     >
    //       <Image key={index} src={imageUrl} />
    //     </Link>
    //   );
    // }));
    // console.log(files)
    // setClazzData({ ...clazzData, photos: files });

    // setPreviews(prevPreviews => [
    //   ...prevPreviews,
    //   ...files
    //     // .sort((a, b) => a.name.localeCompare(b.name))
    //     .map((file, index) => {
    //       const imageUrl = URL.createObjectURL(file);
    //       return (
    //         <Link
    //           href={imageUrl}
    //           data-fancybox="gallery"
    //         >
    //           <Image key={index} src={imageUrl} />
    //         </Link>
    //       );
    //     })
    // ]);

    const updatedStudentsWithPhotos = clazzData.studentsWithPhotos.map((student, index) => {
      const imageUrl = URL.createObjectURL(files[index]);
      return {
        ...student,
        photo: files[index],
        preview: (
          <Link href={imageUrl} data-fancybox="gallery" data-caption={`${student.name}`} key={uuidv4()}>
            <Image radius="md" src={imageUrl} />
          </Link>
        ),
      };
    });

    setClazzData({ ...clazzData, photos: files, studentsWithPhotos: updatedStudentsWithPhotos });
  }

  const handleStudentsDataSubmission = (files: FileWithPath[]) => {
    if (!files) {
      return;
    }
    
    try {
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.set("file", files[i]);

        // console.log(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/photos?year=${clazzData.schoolYear?.getFullYear()}&clazz=${clazzData.clazzName}`)

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${locale}/api/photos`, formData, {
          params: {
            year: clazzData.schoolYear?.getFullYear(),
            clazz: clazzData.clazzName
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
    clazzData: clazzData,
    setClazzData: setClazzData,
    classesInSelectedYear: classesInSelectedYear,
    previews: previews,
    nextStep: nextStep,
    prevStep: prevStep,
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
