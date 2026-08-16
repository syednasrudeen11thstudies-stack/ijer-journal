import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditorialMember = {
  id: string;
  fullName: string;
  qualifications: string | null;
  editorialDesignation: string;
  specialty: string | null;
  professionalDesignation: string | null;
  department: string | null;
  institution: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  email: string | null;
  biography: string | null;
  researchInterests: string | null;
  photoUrl: string | null;
};

type BoardGroup = {
  title: string;
  eyebrow: string;
  description: string;
  designations: string[];
  featured?: boolean;
};

const boardGroups: BoardGroup[] = [
  {
    eyebrow: "Journal Leadership",
    title: "Patrons & Editorial Leadership",
    description:
      "Senior leadership supporting the academic direction, governance and editorial development of IJER.",
    designations: [
      "PATRON",
      "HONORARY_PATRON",
      "CHAIRPERSON_EDITORIAL_COUNCIL",
      "EDITOR_IN_CHIEF",
    ],
    featured: true,
  },
  {
    eyebrow: "Editorial Management",
    title: "Executive & Managing Editors",
    description:
      "Editors responsible for journal operations, manuscript processing and publication workflow.",
    designations: [
      "EXECUTIVE_EDITOR",
      "MANAGING_EDITOR",
      "DEPUTY_EDITOR",
    ],
  },
  {
    eyebrow: "Editorial Team",
    title: "Associate & Assistant Editors",
    description:
      "Editors supporting manuscript evaluation, peer review coordination and editorial decision-making.",
    designations: [
      "ASSOCIATE_EDITOR",
      "ASSISTANT_EDITOR",
    ],
  },
  {
    eyebrow: "Subject Expertise",
    title: "Section & Specialist Editors",
    description:
      "Subject-specific editors supporting research quality across the journal's major academic areas.",
    designations: [
      "SECTION_EDITOR",
      "STATISTICAL_EDITOR",
      "RESEARCH_METHODOLOGY_EDITOR",
    ],
  },
  {
    eyebrow: "Scholarly Community",
    title: "Editorial Board Members",
    description:
      "Editorial Board Members contribute academic expertise and help maintain the scholarly standards of IJER.",
    designations: [
      "EDITORIAL_BOARD_MEMBER",
      "INTERNATIONAL_EDITORIAL_BOARD_MEMBER",
    ],
  },
  {
    eyebrow: "Academic Guidance",
    title: "Scientific & Academic Advisory Board",
    description:
      "Advisory members provide broader scientific, academic and research guidance to the journal.",
    designations: [
      "SCIENTIFIC_ADVISORY_BOARD_MEMBER",
      "ACADEMIC_ADVISORY_BOARD_MEMBER",
    ],
  },
  {
    eyebrow: "Peer Review",
    title: "Reviewers",
    description:
      "Reviewers support the journal's peer-review process through independent academic assessment.",
    designations: [
      "REVIEWER",
    ],
  },
];

export default async function EditorialBoardPage() {
  const members = await prisma.editorialMember.findMany({
    where: {
      status: "ACTIVE",
      showOnWebsite: true,
    },

    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        fullName: "asc",
      },
    ],
  });

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            Journal Leadership
          </span>

          <h1>Editorial Board</h1>

          <p>
            The editorial structure of the International Journal of
            Electro-Homoeopathy &amp; Research brings together academic,
            scientific, research and editorial expertise to support
            responsible scholarly publication.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          {members.length === 0 ? (
            <div className="board-empty">
              <span className="eyebrow">
                Editorial Board
              </span>

              <h2>
                Editorial appointments will be announced soon
              </h2>

              <p>
                Editorial and advisory members have not yet been
                published on the IJER website.
              </p>
            </div>
          ) : (
            boardGroups.map((group) => {
              const groupMembers = members.filter(
                (member) =>
                  group.designations.includes(
                    member.editorialDesignation,
                  ),
              );

              if (groupMembers.length === 0) {
                return null;
              }

              return (
                <BoardSection
                  key={group.title}
                  eyebrow={group.eyebrow}
                  title={group.title}
                  description={group.description}
                  members={groupMembers}
                  featured={group.featured}
                />
              );
            })
          )}

          <section className="editorial-independence">
            <span className="eyebrow">
              Editorial Independence
            </span>

            <h2>
              Commitment to Responsible Editorial Practice
            </h2>

            <p>
              Editorial decisions should be based on academic relevance,
              methodological quality, ethical requirements, peer-review
              considerations and the journal&apos;s aims and scope.
              Appointment to the editorial board does not imply
              endorsement of every claim or conclusion published by
              individual authors.
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
    <section className="board-section">
      <div className="board-section-heading">
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>
      </div>

      <div
        className={
          featured
            ? "board-grid board-grid-featured"
            : "board-grid"
        }
      >
        {members.map((member) => (
          <MemberCard
            key={member.id}
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
  const location = [
    member.city,
    member.state,
    member.country,
  ]
    .filter(Boolean)
    .join(", ");

  const initials = member.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <article
      className={
        featured
          ? "member-card member-card-featured"
          : "member-card"
      }
    >
      <div className="member-avatar">
        {initials || "IJ"}
      </div>

      <span className="member-role">
        {formatDesignation(
          member.editorialDesignation,
        )}
      </span>

      <h3>
        {member.fullName}
      </h3>

      {member.qualifications && (
        <p className="member-qualification">
          {member.qualifications}
        </p>
      )}

      <div className="member-details">
        {member.professionalDesignation && (
          <strong>
            {member.professionalDesignation}
          </strong>
        )}

        {member.department && (
          <p>
            {member.department}
          </p>
        )}

        {member.institution && (
          <p>
            {member.institution}
          </p>
        )}

        {location && (
          <p>
            {location}
          </p>
        )}

        {member.email && (
          <p>
            <strong>Email: </strong>
            <a href={`mailto:${member.email}`}>
              {member.email}
            </a>
          </p>
        )}

        {member.specialty && (
          <div className="member-specialty">
            <span>
              Specialty
            </span>

            <strong>
              {member.specialty}
            </strong>
          </div>
        )}

        {member.researchInterests && (
          <div className="member-specialty">
            <span>
              Research Interests
            </span>

            <strong>
              {member.researchInterests}
            </strong>
          </div>
        )}

        {member.biography && (
          <p className="member-biography">
            {member.biography}
          </p>
        )}
      </div>
    </article>
  );
}

function formatDesignation(
  value: string,
) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}
