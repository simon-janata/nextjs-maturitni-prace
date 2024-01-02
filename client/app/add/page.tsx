"use client";

import { useState } from "react";
import { useDocumentTitle } from "@mantine/hooks";
import Stepper from "@/components/Stepper";

export default function AddPage() {
  useDocumentTitle("Add");

  const [active, setActive] = useState<number>(0);
  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [schoolYearSelection, setSchoolYearSelection] = useState<string>("existing");
  const [classSelection, setClassSelection] = useState<string>("existing");

  const [schoolYear, setSchoolYear] = useState<Date | null>(new Date());
  const [className, setClassName] = useState<string>("");

  const stateAndHandlers = {
    active: active,
    setActive: setActive,
    schoolYearSelection: schoolYearSelection,
    setSchoolYearSelection: setSchoolYearSelection,
    classSelection: classSelection,
    setClassSelection: setClassSelection,
    schoolYear: schoolYear,
    setSchoolYear: setSchoolYear,
    className: className,
    setClassName: setClassName,
    nextStep: nextStep,
    prevStep: prevStep,
  };

  return (
    <Stepper stateAndHandlers={stateAndHandlers} />
  );
}
