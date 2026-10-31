import type { Certificate } from "@/types";
import courseraPhp from "../../public/images/certificates/coursera-php.webp";
import devopsWorkshop from "../../public/images/certificates/devops-workshop.webp";
import glaAndroidPython from "../../public/images/certificates/gla-android-python.webp";
import glaPython from "../../public/images/certificates/gla-python.webp";
import sttpAiMl from "../../public/images/certificates/sttp-ai-ml.webp";

export const certificates: Certificate[] = [
  {
    title: "AI and ML Applications in Data Science",
    issuer: "Indus University · GUJCOST STTP",
    year: "2021",
    image: sttpAiMl,
  },
  {
    title: "Building Web Applications in PHP",
    issuer: "University of Michigan · Coursera",
    year: "2020",
    image: courseraPhp,
    verifyUrl: "https://coursera.org/verify/G8CANBYXMXQS",
  },
  {
    title: "DevOps Workshop",
    issuer: "Agile Group of Companies",
    year: "2021",
    image: devopsWorkshop,
  },
  {
    title: "Android App with Python",
    issuer: "Great Learning Academy",
    year: "2021",
    image: glaAndroidPython,
    verifyUrl: "https://verify.mygreatlearning.com/SOOTCYHM",
  },
  {
    title: "Python Programming",
    issuer: "Great Learning Academy",
    year: "2020",
    image: glaPython,
  },
];
