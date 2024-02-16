type Year = {
  id: string;
  year: number;
  classes: string;
}

type Class = {
  id: string;
  name: string;
  folderColor: string;
  year: Year;
  yearId: String;
  students: Student[];
}

type Student = {
  id: string;
  class: Class;
  classId: string;
  firstname: string;
  middlename: string;
  lastname: string;
}

type StudentWithPhoto = Student & { photo: string };
