"use client";

import Stepper from "@/components/Stepper";
import { useDocumentTitle } from "@mantine/hooks";
import Papa from "papaparse";
import { useState } from "react";
import { Image } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";

export default function AddPage() {
  useDocumentTitle("Add");

  const [active, setActive] = useState<number>(0);

  // const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   const currentStep = active;

  //   const form = document.getElementById(`form-step-${currentStep}`);
  
  //   if (form) {
  //     form.dispatchEvent(new Event("submit", { cancelable: true }));
  //   }
  //   setActive(currentStep < 4 ? currentStep + 1 : currentStep)
  // };

  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [schoolYear, setSchoolYear] = useState<Date | null>(new Date());
  const [className, setClassName] = useState<string>("");
  const [students, setStudents] = useState<string[]>([]);

  const [classesInYear, setClassesInYear] = useState<string[]>([]);
  const [classExists, setClassExists] = useState<boolean>(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<React.ReactNode[]>([]);

  const handlePickYearChange = (date: Date | null) => {
    const year = date?.getFullYear();
    setSchoolYear(date);

    if (year) {
      fetch(`/api/years/${year}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setClassesInYear(data.classes.map((c: Class) => (
              c.name
            )));
          }
      });
    }
  }

  const handleClassNameChange = (n: string) => {
    const name = n.toUpperCase();
    setClassName(name);

    if (name && classesInYear.includes(name)) {
      console.log("Class already exists");
      setClassExists(true);

    } else {
      setClassExists(false);
    }
  }

  const handleCSVUpload = (file: File) => {
    Papa.parse(file, {
      delimiter: ";",
      complete: (results) => {
        setStudents(results.data[0] as string[]);
      },
    });
  }

  const handlePhotosUpload = (files: FileWithPath[]) => {
    setPreviews(files.map((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      return (
        <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
      );
    }));
  }

  const stateAndHandlers = {
    active: active,
    setActive: setActive,
    schoolYear: schoolYear,
    setSchoolYear: setSchoolYear,
    className: className,
    setClassName: setClassName,
    students: students,
    setStudents: setStudents,
    classesInYear: classesInYear,
    classExists: classExists,
    previews: previews,
    nextStep: nextStep,
    prevStep: prevStep,
    handlePickYearChange: handlePickYearChange,
    handleClassNameChange: handleClassNameChange,
    handleCSVUpload: handleCSVUpload,
    handlePhotosUpload: handlePhotosUpload,
  };

  return (
    <Stepper stateAndHandlers={stateAndHandlers} />
  );
}
