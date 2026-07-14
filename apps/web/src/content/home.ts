import type { Localized } from './types'

type HomeContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
    primaryAction: string
    secondaryAction: string
  }
  mandate: {
    eyebrow: string
    title: string
    paragraphs: string[]
    action: string
  }
  pillars: Array<{
    title: string
    summary: string
    icon: 'music' | 'school' | 'users'
  }>
  sections: {
    whatWeDo: string
  }
  cta: {
    title: string
    text: string
    primaryAction: string
    secondaryAction: string
  }
}

export const homeContent: Localized<HomeContent> = {
  en: {
    hero: {
      eyebrow: 'South Australia / Community arts',
      title: 'South Australian International Musicians Association.',
      paragraphs: [
        'South Australian International Musicians Association is a not-for-profit community arts organisation based in South Australia. We are committed to promoting music education, multicultural artistic exchange, youth performance opportunities, and community engagement through music.',
        'Our work includes concerts, student showcases, charity performances, cultural exchange projects, workshops, masterclasses, and collaborations with local artists, educators, families, and community organisations.',
        'Through music, we aim to connect people across cultures, generations, and communities.',
      ],
      primaryAction: 'Discover our programs',
      secondaryAction: 'Upcoming events',
    },
    mandate: {
      eyebrow: 'Rooted in South Australia',
      title: 'Music, education, culture, and community.',
      paragraphs: [
        'We create inclusive public programs where artists, young performers, families, educators, and community partners can meet through music.',
        'Our projects bring together concerts, student showcases, charity performances, cultural exchange, workshops, masterclasses, and collaborations with local organisations.',
      ],
      action: 'Learn more about our mission',
    },
    pillars: [
      {
        title: 'Concerts & Showcases',
        summary: 'Concerts, student showcases, charity performances, and public community programs.',
        icon: 'music',
      },
      {
        title: 'Workshops & Masterclasses',
        summary: 'Learning opportunities for students, families, educators, and community musicians.',
        icon: 'school',
      },
      {
        title: 'Cultural Exchange',
        summary: 'Projects that connect local artists, multicultural communities, families, and partners.',
        icon: 'users',
      },
    ],
    sections: {
      whatWeDo: 'What We Do',
    },
    cta: {
      title: 'Join our musical community.',
      text: 'Whether you are a musician, teacher, student, parent, volunteer, sponsor, community supporter, or arts enthusiast, there are many ways to become involved.',
      primaryAction: 'Join SAIMA',
      secondaryAction: 'Contact us',
    },
  },
  zh: {
    hero: {
      eyebrow: '南澳 / 社区艺术',
      title: '南澳国际音乐协会',
      paragraphs: [
        '南澳国际音乐协会是一家位于南澳大利亚的非营利性社区艺术组织。我们致力于通过音乐推动音乐教育、多元文化艺术交流、青少年表演机会以及社区参与。',
        '我们的项目包括音乐会、学生展演、慈善演出、文化交流活动、工作坊、大师班，以及与本地艺术家、教育工作者、家庭和社区组织的合作。',
        '我们希望通过音乐连接不同文化、不同世代和不同社区的人们。',
      ],
      primaryAction: '了解我们的项目',
      secondaryAction: '即将举办活动',
    },
    mandate: {
      eyebrow: '扎根南澳',
      title: '音乐、教育、文化与社区。',
      paragraphs: [
        '我们创造包容性的公共音乐项目，让艺术家、年轻表演者、家庭、教育工作者和社区伙伴通过音乐建立连接。',
        '我们的项目涵盖音乐会、学生展演、慈善演出、文化交流、工作坊、大师班，以及与本地组织的合作。',
      ],
      action: '了解我们的宗旨',
    },
    pillars: [
      {
        title: '音乐会与展演',
        summary: '音乐会、学生展演、慈善演出及公共社区项目。',
        icon: 'music',
      },
      {
        title: '工作坊与大师班',
        summary: '面向学生、家庭、教育工作者和社区音乐人的学习机会。',
        icon: 'school',
      },
      {
        title: '文化交流',
        summary: '连接本地艺术家、多元文化社区、家庭和合作伙伴的项目。',
        icon: 'users',
      },
    ],
    sections: {
      whatWeDo: '我们做什么',
    },
    cta: {
      title: '加入我们的音乐社区。',
      text: '无论您是音乐家、教师、学生、家长、志愿者、赞助者、社区支持者，还是艺术爱好者，都可以通过不同方式参与协会的发展。',
      primaryAction: '加入 SAIMA',
      secondaryAction: '联系我们',
    },
  },
}
