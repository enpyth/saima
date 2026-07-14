import type { Localized } from './types'

type ChoirContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
    action: string
  }
  program: {
    title: string
    paragraphs: string[]
    items: string[]
  }
  participation: {
    title: string
    text: string
  }
  labels: {
    aboutProgram: string
  }
  upcoming: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }
  cta: {
    title: string
    text: string
    action: string
  }
  detailsAction: string
}

export const choirContent: Localized<ChoirContent> = {
  en: {
    hero: {
      eyebrow: 'Family program',
      title: 'Parent-Child Choir Performances',
      paragraphs: [
        'Our parent-child choir performances encourage families to experience music together. Through rehearsals and performances, children and parents share the joy of singing, teamwork, learning, and community participation.',
      ],
      action: 'Register interest',
    },
    program: {
      title: 'Parent-Child Choir Program',
      paragraphs: [
        'The Parent-Child Choir is a newly established community music program of South Australian International Musicians Association. It brings children and parents together through singing, rehearsal, performance, and shared musical experience.',
        'The choir was created to encourage families to enjoy music together. Rather than focusing only on individual performance, this program values participation, connection, confidence, teamwork, and the joy of making music as a family.',
        'Through the Parent-Child Choir, children sing alongside their parents and other families in a supportive community environment.',
        'Although the choir is still in its early stage, it has already participated in a community event hosted by the Jiangsu Chamber of Commerce to welcome a visiting Malaysian business delegation.',
        'The Parent-Child Choir is also preparing to participate in an upcoming Mid-Autumn Festival community celebration.',
      ],
      items: [
        'Shared singing for children and parents',
        'Supportive rehearsal and performance experience',
        'Family connection, cultural participation, and community friendship',
      ],
    },
    participation: {
      title: 'Participation',
      text: 'Families can register interest and discuss the next rehearsal or community performance opportunity with SAIMA.',
    },
    labels: {
      aboutProgram: 'About the program',
    },
    upcoming: {
      eyebrow: 'Looking forward',
      title: 'Mid-Autumn Festival community celebration',
      rows: [
        { label: 'Timing', value: 'To be announced' },
        { label: 'Place', value: 'To be announced' },
      ],
    },
    cta: {
      title: 'Your family’s musical journey starts here.',
      text: 'Send SAIMA a note and we will follow up with the next rehearsal opportunity.',
      action: 'Register interest',
    },
    detailsAction: 'Read choir details',
  },
  zh: {
    hero: {
      eyebrow: '家庭项目',
      title: '亲子合唱团演出',
      paragraphs: [
        '我们的亲子合唱团演出鼓励家庭共同参与音乐。通过排练与演出，孩子和家长一起体验歌唱、合作、学习和社区参与的快乐。',
      ],
      action: '登记意向',
    },
    program: {
      title: '亲子合唱团项目',
      paragraphs: [
        '亲子合唱团是南澳国际音乐协会新近成立的社区音乐项目。该项目通过歌唱、排练、演出和共同的音乐体验，将孩子与家长连接在一起。',
        '亲子合唱团的成立，是希望鼓励家庭共同参与音乐。这个项目并不只关注个人表演能力，而是重视参与、连接、自信、合作，以及一家人共同创造音乐的快乐。',
        '在亲子合唱团中，孩子们与父母以及其他家庭一起，在支持性的社区环境中共同歌唱。',
        '虽然亲子合唱团目前仍处于成立初期，但已经参加了由江苏商会举办的迎接马来西亚商团的社区活动。',
        '亲子合唱团也正在准备参加即将举办的中秋节社区联欢会。',
      ],
      items: [
        '孩子与家长共同歌唱',
        '支持性的排练与演出体验',
        '家庭连接、文化参与与社区友谊',
      ],
    },
    participation: {
      title: '参与方式',
      text: '家庭可以登记意向，并与 SAIMA 沟通下一次排练或社区演出机会。',
    },
    labels: {
      aboutProgram: '关于项目',
    },
    upcoming: {
      eyebrow: '即将准备',
      title: '中秋节社区联欢会',
      rows: [
        { label: '时间', value: '待公布' },
        { label: '地点', value: '待公布' },
      ],
    },
    cta: {
      title: '您家庭的音乐旅程从这里开始。',
      text: '请给 SAIMA 留言，我们会跟进下一次排练机会。',
      action: '登记意向',
    },
    detailsAction: '阅读合唱团详情',
  },
} 
