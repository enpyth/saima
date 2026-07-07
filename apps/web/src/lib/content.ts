export const publicEvents = [
  {
    date: '18 Jul',
    title: 'SAIMA Winter Showcase',
    summary: 'A shared program of chamber music, new works, and international repertoire in Adelaide.',
    location: 'Adelaide Town Hall',
  },
  {
    date: '03 Aug',
    title: 'Welcome Session for International Musicians',
    summary: 'Meet members, learn about joining SAIMA, and find collaborators for future performances.',
    location: 'Adelaide CBD',
  },
  {
    date: '24 Aug',
    title: 'Teaching Studio Exchange',
    summary: 'Members open course times and discuss teaching practice with visitors and emerging musicians.',
    location: 'Community music room',
  },
]

export const membershipBenefits = [
  'Profile in the SAIMA musician network',
  'Access to member-led events and teaching opportunities',
  'Ability to publish course and lesson availability',
  'Community support for performances, collaboration, and settlement',
]

export const courseSlots = [
  {
    title: 'Piano interpretation session',
    host: 'Member studio',
    time: 'Tuesdays, 5:30 PM',
  },
  {
    title: 'Strings audition preparation',
    host: 'SAIMA member teacher',
    time: 'Saturdays, 10:00 AM',
  },
  {
    title: 'Voice and diction coaching',
    host: 'City rehearsal space',
    time: 'By appointment',
  },
]

export const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Youth', to: '/youth' },
  { label: 'Choir', to: '/choir' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Courses', to: '/courses' },
  { label: 'Join', to: '/membership' },
  { label: 'Contact', to: '/contact' },
] as const

export const publicRoutePaths = publicNavItems.map((item) => item.to)

export const siteImages = {
  heroStage: '/images/saima/hero-stage.jpg',
  mandateLesson: '/images/saima/mandate-lesson.jpg',
  eventsConcert: '/images/saima/events-concert.jpg',
  youthPiano: '/images/saima/youth-piano.jpg',
  galleryPerformance: '/images/saima/gallery-performance.jpg',
  choirHall: '/images/saima/choir-hall.jpg',
} as const

export const programPillars = [
  {
    title: 'Concerts & Recitals',
    summary:
      'Curated performances that bring international musical traditions into South Australian venues.',
    icon: 'music',
  },
  {
    title: 'Educational Workshops',
    summary: 'Masterclasses and practical sessions for students, families, and community learners.',
    icon: 'school',
  },
  {
    title: 'Artistic Collaborations',
    summary: 'A working network where musicians can meet, rehearse, teach, and create together.',
    icon: 'users',
  },
] as const

export const missionValues = [
  {
    title: 'Inclusivity',
    summary: 'A welcoming platform for artists, families, and listeners from many cultural roots.',
  },
  {
    title: 'Excellence',
    summary: 'Programs shaped with care for musical craft, teaching quality, and public presentation.',
  },
  {
    title: 'Heritage',
    summary: 'Respect for traditional practice, contemporary interpretation, and shared community memory.',
  },
] as const

export const galleryMoments = [
  {
    title: 'Winter Showcase',
    category: 'Concert',
    image: siteImages.heroStage,
  },
  {
    title: 'Mentor Studio',
    category: 'Education',
    image: siteImages.mandateLesson,
  },
  {
    title: 'Youth Recital',
    category: 'Showcase',
    image: siteImages.youthPiano,
  },
  {
    title: 'Community Stage',
    category: 'Performance',
    image: siteImages.galleryPerformance,
  },
] as const

export const youthShowcases = [
  {
    title: 'Parent-Child Choir Performances',
    summary: 'Families rehearse and perform together in a generous, supportive setting.',
  },
  {
    title: 'Young Artist Showcase',
    summary: 'Student soloists and small ensembles present work shaped through SAIMA programs.',
  },
  {
    title: 'Community Recitals',
    summary: 'Low-pressure performance opportunities help emerging musicians build confidence.',
  },
] as const

export const participationPaths = [
  {
    title: 'Performer',
    summary: 'Join as an artist seeking concerts, recitals, collaborations, and public programs.',
    action: 'Apply as performer',
    to: '/membership',
  },
  {
    title: 'Teacher',
    summary: 'Publish member-led music sessions and share your practice with learners.',
    action: 'Apply as teacher',
    to: '/membership',
  },
  {
    title: 'Collaborator',
    summary: 'Connect with SAIMA members around ensembles, cultural exchanges, and new projects.',
    action: 'Apply as collaborator',
    to: '/membership',
  },
  {
    title: 'Supporter',
    summary: 'Apply as a performer, teacher, collaborator, or supporter.',
    action: 'Start membership',
    to: '/membership',
  },
] as const
