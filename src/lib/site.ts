// Site-wide constants. Everything that names Tibor's public accounts lives here once.

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tibor-balint.netlify.app',
  name: 'Tibor Bálint',
  title: 'Tibor Bálint — Software Engineer',
  description:
    'Software engineer, frontend-leaning: Angular, React and Next.js on the front, Node and C# behind it. ' +
    'Explore the character sheet, quest log and skill tree.',
  email: 'balinttibornb@gmail.com',
  cvPath: '/cv/Tibor_Balint_CV.pdf',
  links: {
    github: 'https://github.com/F3KT0R',
    linkedin: 'https://www.linkedin.com/in/tibor-b%C3%A1lint-a30a11205/',
  },
} as const
