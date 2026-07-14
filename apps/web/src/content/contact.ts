import type { Localized } from './types'

type ContactContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  partner: {
    title: string
    paragraphs: string[]
  }
  labels: {
    partnership: string
  }
  form: {
    eyebrow: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    message: string
    messagePlaceholder: string
    action: string
  }
  contact: {
    eyebrow: string
    title: string
    paragraphs: string[]
    methods: Array<{ label: string; value: string }>
    response: string
  }
  detailsAction: string
}

export const contactContent: Localized<ContactContent> = {
  en: {
    hero: {
      eyebrow: 'Contact',
      title: 'Contact us',
      paragraphs: [
        'South Australian International Musicians Association welcomes enquiries from students, families, musicians, artists, educators, sponsors, venues, community organisations, cultural groups, and charity partners.',
        'Please contact us if you would like to discuss performances, concerts, sponsorship, donations, community projects, student showcases, workshops, collaborations, or volunteer opportunities.',
      ],
    },
    partner: {
      title: 'Why Partner With Us',
      paragraphs: [
        'By supporting South Australian International Musicians Association sponsors and partners contribute to music education, youth development, multicultural exchange, community wellbeing, and charitable action in South Australia.',
        'Your support is not only financial or practical. It helps create real opportunities for young people, brings comfort to community members, supports artists, and strengthens cultural life in South Australia.',
        'Together, we can use music to connect people, support meaningful causes, and create lasting community impact.',
      ],
    },
    labels: {
      partnership: 'Partnership',
    },
    form: {
      eyebrow: 'Send us a message',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      message: 'Message',
      messagePlaceholder: 'How can SAIMA help?',
      action: 'Prepare enquiry',
    },
    contact: {
      eyebrow: 'Contact information',
      title: 'South Australian International Musicians Association',
      paragraphs: ['Based in Adelaide, South Australia'],
      methods: [
        { label: 'Email', value: 'info@saima.com.au' },
        { label: 'Phone', value: '0424882911 (SMS)' },
        { label: 'Website', value: 'Website to be confirmed' },
        { label: 'Social Media', value: 'ins/fb' },
      ],
      response: 'We aim to respond to enquiries as soon as possible.',
    },
    detailsAction: 'Read partnership details',
  },
  zh: {
    hero: {
      eyebrow: '联系我们',
      title: '联系我们',
      paragraphs: [
        '南澳国际音乐协会欢迎学生、家庭、音乐家、艺术家、教育工作者、赞助商、演出场地、社区组织、文化团体及慈善合作伙伴与我们联系。',
        '如果您希望咨询演出、音乐会、赞助、捐款、社区项目、学生展演、工作坊、合作机会或志愿者参与，欢迎联系我们。',
      ],
    },
    partner: {
      title: '为什么与我们合作',
      paragraphs: [
        '通过支持南澳国际音乐协会，赞助方与合作伙伴将共同推动南澳的音乐教育、青少年发展、多元文化交流、社区福祉和公益行动。',
        '您的支持不仅是资金或资源上的帮助，也将为年轻人创造真实机会，为社区成员带来温暖，支持艺术家，并丰富南澳的文化艺术生活。',
        '让我们共同通过音乐连接人与人，支持有意义的公益目标，并创造持久的社区影响。',
      ],
    },
    labels: {
      partnership: '合作',
    },
    form: {
      eyebrow: '发送留言',
      name: '姓名',
      namePlaceholder: '您的姓名',
      email: '邮箱',
      emailPlaceholder: 'you@example.com',
      message: '留言',
      messagePlaceholder: '请写下您希望咨询的内容',
      action: '准备咨询',
    },
    contact: {
      eyebrow: '联系信息',
      title: '南澳国际音乐协会',
      paragraphs: ['位于南澳大利亚阿德莱德'],
      methods: [
        { label: '邮箱', value: 'info@saima.com.au' },
        { label: '电话', value: '0424882911 (SMS)' },
        { label: '网站', value: '网站待确认' },
        { label: '社交媒体', value: 'ins/fb' },
      ],
      response: '我们会尽快回复您的咨询。',
    },
    detailsAction: '阅读合作详情',
  },
} 
