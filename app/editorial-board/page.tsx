type EditorialMember = {
  name: string;
  qualification: string;
  editorialRole: string;
  professionalRole: string;
  institution: string;
  location: string;
  specialty?: string;
};

const editorInChief: EditorialMember[] = [
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Editor-in-Chief",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
    specialty: "Electro-Homoeopathy & Research",
  },
];

const executiveEditors: EditorialMember[] = [
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Executive Editor",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Managing Editor",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
];

const associateEditors: EditorialMember[] = [
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Associate Editor",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Associate Editor",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
];

const sectionEditors: EditorialMember[] = [
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Section Editor",
    professionalRole: "Researcher / Academician",
    institution: "Institution / Organization",
    location: "City, Country",
    specialty: "Phytochemistry",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Section Editor",
    professionalRole: "Researcher / Academician",
    institution: "Institution / Organization",
    location: "City, Country",
    specialty: "Pharmacognosy",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Section Editor",
    professionalRole: "Researcher / Academician",
    institution: "Institution / Organization",
    location: "City, Country",
    specialty: "Clinical Research",
  },
];

const editorialMembers: EditorialMember[] = [
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Editorial Board Member",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Editorial Board Member",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Editorial Board Member",
    professionalRole: "Professional Designation",
    institution: "Institution / Organization",
    location: "City, Country",
  },
];

const advisoryMembers: EditorialMember[] = [
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Scientific Advisory Board Member",
    professionalRole: "Scientist / Academician",
    institution: "Institution / Organization",
    location: "City, Country",
  },
  {
    name: "To Be Appointed",
    qualification: "Qualifications",
    editorialRole: "Academic Advisory Board Member",
    professionalRole: "Academician / Researcher",
    institution: "Institution / Organization",
    location: "City, Country",
  },
];

export default function EditorialBoardPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">Journal Leadership</span>

          <h1>Editorial Board</h1>

          <p>
            The editorial structure of the International Journal of
            Electro-Homoeopathy &amp; Research (IJER) brings together academic,
            scientific, research, and editorial expertise to support responsible
            scholarly publication.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <BoardSection
            eyebrow="Editorial Leadership"
            title="Editor-in-Chief"
            description="The Editor-in-Chief provides overall academic and editorial leadership for the journal."
            members={editorInChief}
            featured
          />

          <BoardSection
            eyebrow="Editorial Management"
            title="Executive & Managing Editors"
            description="Responsible for coordinating editorial operations, manuscript processing, and publication workflow."
            members={executiveEditors}
          />

          <BoardSection
            eyebrow="Editorial Team"
            title="Associate Editors"
            description="Associate Editors support manuscript evaluation and coordinate peer review across relevant disciplines."
            members={associateEditors}
          />

          <BoardSection
            eyebrow="Subject Expertise"
            title="Section Editors"
            description="Section Editors provide subject-specific editorial oversight for the journal's major research areas."
            members={sectionEditors}
          />

          <BoardSection
            eyebrow="Scholarly Community"
            title="Editorial Board Members"
            description="Editorial Board Members contribute academic expertise and support the journal's scholarly standards."
            members={editorialMembers}
          />

          <BoardSection
            eyebrow="Academic Guidance"
            title="Scientific & Academic Advisory Board"
            description="Advisory members provide broader scientific, academic, and research guidance to the journal."
            members={advisoryMembers}
          />

          <section
            style={{
              marginTop: "110px",
              padding: "48px",
              borderRadius: "26px",
              background: "var(--green-soft)",
              border: "1px solid #cfe2d8",
            }}
          >
            <span className="eyebrow">Editorial Independence</span>

            <h2
              style={{
                margin: "0 0 18px",
                fontSize: "34px",
                lineHeight: 1.2,
              }}
            >
              Commitment to Responsible Editorial Practice
            </h2>

            <p
              style={{
                maxWidth: "850px",
                margin: 0,
                color: "var(--muted)",
                fontSize: "17px",
                lineHeight: 1.9,
              }}
            >
              Editorial decisions should be based on academic relevance,
              methodological quality, ethical requirements, peer-review
              considerations, and the journal&apos;s aims and scope.
              Appointment to the editorial board does not imply endorsement of
              every claim or conclusion published by individual authors.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

function BoardSection({
  eyebrow,
  title,
  description,
  members,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  members: EditorialMember[];
  featured?: boolean;
}) {
  return (
    <section
      style={{
        marginBottom: "105px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          marginBottom: "42px",
        }}
      >
        <span className="eyebrow">{eyebrow}</span>

        <h2
          style={{
            margin: "0 0 16px",
            fontSize: "clamp(32px, 4vw, 46px)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: 0,
            color: "var(--muted)",
            fontSize: "17px",
            lineHeight: 1.8,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: featured
            ? "minmax(0, 760px)"
            : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {members.map((member, index) => (
          <MemberCard
            key={`${member.editorialRole}-${index}`}
            member={member}
            featured={featured}
          />
        ))}
      </div>
    </section>
  );
}

function MemberCard({
  member,
  featured,
}: {
  member: EditorialMember;
  featured: boolean;
}) {
  return (
    <article
      style={{
        padding: featured ? "38px" : "30px",
        border: "1px solid var(--border)",
        borderRadius: "22px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: featured ? "76px" : "64px",
          height: featured ? "76px" : "64px",
          marginBottom: "24px",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "var(--green-soft)",
          color: "var(--green)",
          fontSize: featured ? "24px" : "20px",
          fontWeight: 900,
        }}
      >
        +
      </div>

      <span
        style={{
          display: "inline-block",
          marginBottom: "14px",
          padding: "7px 12px",
          borderRadius: "999px",
          background: "var(--green-soft)",
          color: "var(--green)",
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {member.editorialRole}
      </span>

      <h3
        style={{
          margin: "0 0 6px",
          fontSize: featured ? "27px" : "22px",
          lineHeight: 1.3,
        }}
      >
        {member.name}
      </h3>

      <p
        style={{
          margin: "0 0 18px",
          color: "var(--green)",
          fontWeight: 700,
        }}
      >
        {member.qualification}
      </p>

      <div
        style={{
          paddingTop: "18px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontWeight: 700,
          }}
        >
          {member.professionalRole}
        </p>

        <p
          style={{
            margin: "0 0 6px",
            color: "var(--muted)",
          }}
        >
          {member.institution}
        </p>

        <p
          style={{
            margin: 0,
            color: "var(--muted)",
            fontSize: "14px",
          }}
        >
          {member.location}
        </p>

        {member.specialty && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: "4px",
                color: "var(--muted)",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Specialty
            </span>

            <strong
              style={{
                color: "var(--green-dark)",
              }}
            >
              {member.specialty}
            </strong>
          </div>
        )}
      </div>
    </article>
  );
}