import type { Localized } from './types'

type YouthContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  areas: Array<{
    title: string
    summary: string
  }>
  cta: {
    eyebrow: string
    title: string
    text: string
    action: string
  }
  detailsAction: string
}

export const youthContent: Localized<YouthContent> = {
  en: {
    hero: {
      eyebrow: 'Youth & Showcase',
      title: 'Student Showcase: Young Voices and Performers',
      paragraphs: [
        'South Australian International Musicians Association is committed to supporting young musicians across different instruments, voices, styles, and cultural traditions.',
        'Our Young Artist Showcase presents selected performances by outstanding young students who demonstrate strong musical ability, artistic curiosity, discipline, stage confidence, and creative potential.',
        'The showcase includes a wide range of performance areas, including vocal performance, musical theatre, classical voice, contemporary popular songs, piano, violin, flute, pipa, and other instrumental performances.',
        'By presenting both vocal and instrumental students, this section reflects our belief in well-rounded music education and diverse artistic development.',
        'Through concerts, competitions, examinations, community performances, and public showcases, these young musicians continue to build confidence, musical understanding, expressive ability, and stage experience.',
      ],
    },
    areas: [
      {
        title: 'Vocal Performance',
        summary: 'Classical voice, musical theatre, contemporary popular songs, and stage performance.',
      },
      {
        title: 'Instrumental Performance',
        summary: 'Piano, violin, flute, pipa, and other instrumental performances by young musicians.',
      },
      {
        title: 'Public Showcase',
        summary: 'Concerts, competitions, examinations, community performances, and public showcases.',
      },
    ],
    cta: {
      eyebrow: 'Next generation',
      title: 'Young performers should be heard, seen, encouraged, and celebrated.',
      text: 'SAIMA supports young musicians as they build confidence, musical understanding, expressive ability, and stage experience.',
      action: 'View upcoming recitals',
    },
    detailsAction: 'Read showcase details',
  },
  zh: {
    hero: {
      eyebrow: '青少年与展演',
      title: '优秀学员作品展演：年轻的声音与舞台',
      paragraphs: [
        '南澳国际音乐协会致力于支持不同乐器、不同声音、不同风格及不同文化传统中的年轻音乐人。',
        '优秀青年艺术学员展演板块将展示部分优秀年轻学员的精选作品。他们在音乐能力、艺术好奇心、学习纪律、舞台自信和创造潜力方面展现出良好的发展。',
        '本板块涵盖多种表演方向，包括声乐表演、音乐剧、古典唱法、当代流行歌曲、钢琴、小提琴、长笛、琵琶及其他器乐表演。',
        '通过同时展示声乐与器乐学员，本板块体现了我们对全面音乐教育和多元艺术发展的重视。',
        '通过音乐会、比赛、考级、社区演出和公开展演，这些年轻音乐人不断建立自信、音乐理解力、表达能力和舞台经验。',
      ],
    },
    areas: [
      {
        title: '声乐表演',
        summary: '古典唱法、音乐剧、当代流行歌曲及舞台表演。',
      },
      {
        title: '器乐表演',
        summary: '钢琴、小提琴、长笛、琵琶及其他器乐方向的年轻表演者。',
      },
      {
        title: '公开展演',
        summary: '音乐会、比赛、考级、社区演出和公开展演。',
      },
    ],
    cta: {
      eyebrow: '下一代',
      title: '年轻表演者应该被听见、被看见、被鼓励和被庆祝。',
      text: 'SAIMA 支持年轻音乐人在舞台经验、音乐理解、表达能力和自信心上持续成长。',
      action: '查看即将举办的展演',
    },
    detailsAction: '阅读展演详情',
  },
} 
