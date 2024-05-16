type SchoolYear = {
  id: string;
  year: number;
  clazzes: Clazz[];
};

type Clazz = {
  id: string;
  name: string;
  folderColor: string;
  schoolYear: SchoolYear;
  schoolYearId: String;
  students: Student[];
};

type Student = {
  id: string;
  clazz: Clazz;
  clazzId: string;
  firstname: string;
  middlename: string;
  lastname: string;
};

type StudentWithPhoto = Student & { photo: string };
