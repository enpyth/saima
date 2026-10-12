import type { Localized } from './types'

type ChoirContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
    action: string
  }
  sectionsNav: Array<{
    id: string
    label: string
  }>
  program: {
    eyebrow: string
    title: string
    paragraphs: string[]
    items: string[]
  }
  participation: {
    title: string
    text: string
  }
  childrensChoir: {
    eyebrow: string
    title: string
    paragraphs: string[]
    items: string[]
    highlight: {
      eyebrow: string
      title: string
      text: string
    }
    galleryTitle: string
    gallery: Array<{
      url: string
      caption: string
    }>
  }
  labels: {
    aboutProgram: string
    jumpToSection: string
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
      eyebrow: 'Choir programs',
      title: 'SAIMA Choirs: Parent-Child & Children’s Choir',
      paragraphs: [
        'Through our Parent-Child Choir and Children’s Choir programs, SAIMA brings families and young vocalists together to share the joy of choral singing, vocal artistry, teamwork, and multicultural community performance.',
      ],
      action: 'Register interest',
    },
    sectionsNav: [
      { id: 'parent-child-choir', label: 'Parent-Child Choir' },
      { id: 'childrens-choir', label: 'Children’s Choir' },
    ],
    program: {
      eyebrow: 'Family program',
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
      title: 'Parent-Child Participation',
      text: 'Families can register interest and discuss the next rehearsal or community performance opportunity with SAIMA.',
    },
    childrensChoir: {
      eyebrow: 'Youth vocal ensemble',
      title: 'SAIMA Children’s Choir Program',
      paragraphs: [
        'The SAIMA Children’s Choir offers dedicated choral training and formal stage performance experience for young singers across South Australia. Guided by experienced vocal educators, choristers develop healthy vocal technique, ensemble harmony, active listening, and expressive stage presence.',
        'Our repertoire bridges diverse cultural traditions, helping young performers connect with both classical and multicultural music while building confidence, discipline, and camaraderie.',
        'The Children’s Choir regularly represents SAIMA at major cultural, diplomatic, and community celebrations — including their featured performance at the Consulate-General of the People’s Republic of China in Adelaide’s reception celebrating the 77th Anniversary of the founding of the People’s Republic of China.',
      ],
      items: [
        'Structured vocal coaching, ensemble harmony, and stagecraft for children',
        'Featured performances at major cultural, diplomatic, and concert events',
        'Building musical confidence, cross-cultural understanding, and lasting friendships',
      ],
      highlight: {
        eyebrow: 'Performance Spotlight',
        title: '77th Anniversary National Day Reception',
        text: 'Invited to perform for the Consulate-General of the People’s Republic of China in Adelaide on 29 September 2026, our young choristers shared music of friendship, cultural dialogue, and celebration on stage.',
      },
      galleryTitle: 'Children’s Choir Moments',
      gallery: [
        {
          url: '/images/saima/choir.jpg',
          caption: 'SAIMA Children’s Choir performing on stage in full concert attire',
        },
        {
          url: '/images/saima/choir1.jpg',
          caption: 'Featured performance at the 77th Anniversary Reception hosted by the Consulate-General of China in Adelaide',
        },
        {
          url: '/images/saima/choir2.jpeg',
          caption: 'Young choristers celebrating together at a community cultural event',
        },
      ],
    },
    labels: {
      aboutProgram: 'About the program',
      jumpToSection: 'Explore our choirs',
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
      text: 'Whether joining as a family in our Parent-Child Choir or enrolling a young singer in our Children’s Choir, send SAIMA a note and we will follow up with the next rehearsal opportunity.',
      action: 'Register interest',
    },
    detailsAction: 'Read choir details',
  },
  zh: {
    hero: {
      eyebrow: '合唱团项目',
      title: 'SAIMA 合唱团：亲子合唱团与儿童合唱团',
      paragraphs: [
        '通过亲子合唱团与儿童合唱团两大项目，南澳国际音乐协会将家庭与青少年歌者紧密相连，在排练与舞台演出中共同体验合唱艺术、团队协作、跨文化交流与社区参与的快乐。',
      ],
      action: '登记意向',
    },
    sectionsNav: [
      { id: 'parent-child-choir', label: '亲子合唱团' },
      { id: 'childrens-choir', label: '儿童合唱团' },
    ],
    program: {
      eyebrow: '家庭音乐项目',
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
      title: '亲子合唱团参与方式',
      text: '家庭可以登记意向，并与 SAIMA 沟通下一次排练或社区演出机会。',
    },
    childrensChoir: {
      eyebrow: '少儿声乐合唱',
      title: 'SAIMA 儿童合唱团项目',
      paragraphs: [
        'SAIMA 儿童合唱团为南澳热爱歌唱的少年儿童提供系统的合唱训练与正式舞台演出机会。在专业声乐导师的指导下，小团员们学习科学的发声方法、多声部合唱配合、敏锐的音乐聆听以及自信的舞台表现力。',
        '合唱团曲目融合中西多元文化传统，帮助孩子们在音乐学习中拓宽文化视野，培养专注力、团队精神与艺术感染力。',
        '儿童合唱团多次代表 SAIMA 亮相重要文化与外交盛会——包括受邀参加中国驻阿德莱德总领事馆举办的庆祝中华人民共和国成立77周年招待会演出，展现南澳华裔及多元文化青少年的艺术风采。',
      ],
      items: [
        '专业系统的少儿声乐指导、和声训练与舞台表演培养',
        '受邀参演重要外交庆典、多元文化活动及专场音乐会',
        '在音乐中培养自信心、跨文化理解与深厚的同龄友谊',
      ],
      highlight: {
        eyebrow: '演出特写',
        title: '庆祝中华人民共和国成立77周年招待会演出',
        text: '2026年9月29日，SAIMA 儿童合唱团受邀在中国驻阿德莱德总领事馆举办的国庆77周年招待会上倾情献唱，用纯真动人的歌声传递友谊与文化共鸣。',
      },
      galleryTitle: '儿童合唱团演出掠影',
      gallery: [
        {
          url: '/images/saima/choir.jpg',
          caption: 'SAIMA 儿童合唱团在舞台上倾情献唱',
        },
        {
          url: '/images/saima/choir1.jpg',
          caption: '受邀参演中国驻阿德莱德总领事馆庆祝中华人民共和国成立77周年招待会',
        },
        {
          url: '/images/saima/choir2.jpeg',
          caption: '小团员们在演出活动现场留念',
        },
      ],
    },
    labels: {
      aboutProgram: '关于项目',
      jumpToSection: '合唱团分团导航',
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
      title: '您与孩子的音乐旅程从这里开始。',
      text: '无论是家庭共同加入亲子合唱团，还是为孩子报名儿童合唱团，欢迎给 SAIMA 留言，我们会为您安排下一次排练与试唱机会。',
      action: '登记意向',
    },
    detailsAction: '阅读合唱团详情',
  },
}
