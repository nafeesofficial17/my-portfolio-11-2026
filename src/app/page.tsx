import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/process/Process";
import { SelectedWork } from "@/components/projects/SelectedWork";
import { Services } from "@/components/services/Services";
import { TechMarquee } from "@/components/skills/TechMarquee";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { certificates } from "@/data/certificates";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

// Structured data so search engines understand who this site is about.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.description,
  url: siteUrl,
  image: `${siteUrl}/images/profile/mohd-nafees.webp`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Indus University" },
  knowsAbout: [
    "Python",
    "Django",
    "FastAPI",
    "Next.js",
    "React",
    "TypeScript",
    "Generative AI",
    "LLMs",
    "RAG",
    "Agentic AI",
    "LangChain",
    "Machine Learning",
  ],
  hasCredential: certificates
    .filter((certificate) => certificate.credentialId)
    .map((certificate) => ({
      "@type": "EducationalOccupationalCredential",
      name: certificate.title,
      credentialCategory: "certification",
      identifier: certificate.credentialId,
      recognizedBy: { "@type": "Organization", name: certificate.issuer },
    })),
  sameAs: profile.socials.filter((social) => social.platform !== "email").map((social) => social.href),
};

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        // JSON.stringify output can't break out of the script tag once "<" is escaped.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <TechMarquee />
      <SelectedWork />
      <Services />
      <About />
      <Process />
      <Testimonials />
      <Contact />
    </main>
  );
}
