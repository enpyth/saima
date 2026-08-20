import type { EventArticle, Language, Localized } from './types'

type EventStatus = 'upcoming' | 'past'

type EventsContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  sections: {
    upcomingTitle: string
    upcomingSummary: string
    pastTitle: string
    pastSummary: string
  }
  labels: {
    upcoming: string
    past: string
    highlights: string
    details: string
    backToEvents: string
    videos: string
    eventDetails: string
    notFoundTitle: string
    notFoundSummary: string
    noEvents: string
    gallery: string
    resources: string
    openResource: string
  }
  events: EventArticle[]
}

const eventHref = (id: string) => `/events/${id}`
const r2PublicBaseUrl = (import.meta.env.VITE_R2_PUBLIC_BASE_URL as string | undefined)?.replace(/\/$/, '')

export function eventAssetUrl(eventId: string, file: string) {
  const encodedFile = file
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${r2PublicBaseUrl ?? ''}/events/${eventId}/${encodedFile}`
}

const impressionsOfChinaImages = [
  { file: 'web_1.jpg', height: 520 },
  { file: 'web_2.jpg', height: 440 },
  { file: 'web_Audiens.jpg', height: 360 },
  { file: 'web_Dance.jpg', height: 560 },
  { file: 'web_Elsa.jpg', height: 500 },
  { file: 'web_flute_solo.jpg', height: 430 },
  { file: 'web_Guzheng.jpg', height: 560 },
  { file: 'web_Hosts.jpg', height: 380 },
  { file: 'web_Irene.jpg', height: 520 },
  { file: 'web_poster.jpg', height: 640 },
  { file: 'web_Program.jpg', height: 600 },
  { file: 'web_view_1.jpg', height: 420 },
].map(({ file, height }, index) => {
  const url = eventAssetUrl('20240930', file)

  return {
    id: `20240930-image-${index + 1}`,
    img: url,
    url,
    height,
  }
})

export function getEventStatus(event: Pick<EventArticle, 'startDate'>, today = new Date()): EventStatus {
  return event.startDate < toDateKey(today) ? 'past' : 'upcoming'
}

export function getEventsByStatus(language: Language, today = new Date()) {
  const events = eventsContent[language].events
  const upcoming = events
    .filter((event) => getEventStatus(event, today) === 'upcoming')
    .sort((left, right) => left.startDate.localeCompare(right.startDate))
  const past = events
    .filter((event) => getEventStatus(event, today) === 'past')
    .sort((left, right) => right.startDate.localeCompare(left.startDate))

  return { upcoming, past }
}

export function findEvent(language: Language, eventId: string) {
  return eventsContent[language].events.find((event) => event.id === eventId)
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const eventsContent: Localized<EventsContent> = {
  en: {
    hero: {
      eyebrow: 'Events',
      title: 'Signature projects across culture, community, and care.',
      paragraphs: [
        'South Australian International Musicians Association presents focused projects that connect music with multicultural exchange, youth performance, and charitable community service.',
        'Event status is based on the event date, so the same event will move from upcoming to past once its date has passed.',
      ],
    },
    sections: {
      upcomingTitle: 'Upcoming Events',
      upcomingSummary: 'Events still ahead on the calendar.',
      pastTitle: 'Past Events',
      pastSummary: 'Events that have already taken place.',
    },
    labels: {
      upcoming: 'Upcoming',
      past: 'Past',
      highlights: 'Event Highlights',
      details: 'View event details',
      backToEvents: 'Back to events',
      eventDetails: 'Event Details',
      notFoundTitle: 'Event not found',
      notFoundSummary: 'This event page is not available.',
      noEvents: 'No events in this section.',
      gallery: 'Event Gallery',
      videos: 'Videos',
      resources: 'Event Resources',
      openResource: 'Open resource',
    },
    events: [
      {
        id: '20261016',
        href: eventHref('20261016'),
        startDate: '2026-10-16',
        title: 'A Dream for Every Child',
        subtitle:
          'Elsa and Her Students: A Charity Musical Theatre Concert Supporting Children with Cancer and Their Families',
        date: '16 Oct 2026',
        location: 'Royalty Theatre',
        paragraphs: [
          'South Australian International Musicians Association is preparing its next charity concert, A Dream for Every Child, planned for 16 October 2026. This musical theatre concert will be led by Elsa Tian and performed by her students, raising funds for children with cancer and their families.',
          'This concert is built around the voices, stories, and dreams of children. Through musical theatre songs from beloved stage and screen works, young performers will use music to express courage, imagination, love, hope, and resilience.',
          'The program will include songs from well-known musicals and films such as The Lion King, Matilda, The Little Mermaid, Frozen, The Phantom of the Opera, Les Misérables, The Greatest Showman, and Miss Saigon. These works speak to childhood, identity, bravery, family love, loss, dreams, and the strength to keep going.',
          'At the heart of this concert is a simple belief: every child deserves the chance to dream, to be loved, and to be supported. Through performance and community giving, SAIMA hopes to offer care and practical support to families facing the challenges of childhood cancer.',
          'This event will also give young singers a meaningful opportunity to use their talents for a charitable cause. By standing on stage for other children, students will learn that music is not only about performance, but also about empathy, responsibility, and bringing hope to others.',
        ],
        details: [
          { label: 'Project Name', value: 'Elsa & Her Children - A Dream for Every Child' },
          { label: 'Date', value: '16 October 2026' },
          { label: 'Venue', value: 'Royalty Theatre' },
          { label: 'Presenter', value: 'South Australia International Musicians Association' },
          { label: 'Performers', value: 'Approximately 18-20 award-winning young vocalists aged 8-15' },
          {
            label: 'Artistic Standard',
            value:
              'All invited performers have previously achieved top-three placings in vocal competitions, with more than half being First Prize winners at the Adelaide Eisteddfod.',
          },
          { label: 'Audience', value: 'Approximately 500 people' },
          {
            label: 'Volunteers',
            value: 'Approximately 20-25 people, including teachers, parents, committee members, front of house and helpers',
          },
          {
            label: 'Purpose',
            value:
              'To inspire young people to serve the community through music while raising funds to support families affected by childhood cancer.',
          },
          { label: 'Funding Requested', value: '$3,300' },
        ],
        posterImage: {
          label: 'Concert Poster',
          url: eventAssetUrl('20261016', 'poster.jpg'),
        },
        resources: [
          {
            label: 'Authority to Fundraise',
            type: 'pdf',
            url: eventAssetUrl('20261016', 'Authority.pdf'),
          },
        ],
      },
      {
        id: '20261024',
        href: eventHref('20261024'),
        startDate: '2026-10-24',
        title: 'Voices Beyond Borders',
        subtitle: 'A Film Music Concert in Remembrance of World War II',
        date: '24 Oct 2026',
        location: 'Elder Hall',
        paragraphs: [
          'Not celebration, but remembrance.',
          'Not victory, but reflection.',
          'Not nations, but human lives.'
        ]
      },
      {
        id: '20250413',
        href: eventHref('20250413'),
        startDate: '2025-04-13',
        title: 'A Journey of Brilliance: From the Silk Road to the Renaissance',
        subtitle: 'A Musical Odyssey Across Time and Cultures',
        date: '13 Apr 2025',
        location: 'Elder Hall',
        paragraphs: [
          'A Journey of Brilliance: From the Silk Road to the Renaissance was a multicultural concert presented at Elder Hall, Adelaide, on 13 April 2025. Organised by South Australian International Musicians Association, the concert was designed as an immersive musical journey across history, geography, and culture.',
          'The concert followed the spirit of the ancient Silk Road, beginning from the eastern city of Chang’an and travelling through Dunhuang, the Taklamakan Desert, Kashgar, Samarkand, Constantinople, and into the cultural landscapes of Europe. Through music, dance, and storytelling, the program explored the movement of people, ideas, art, and cultural memory across civilizations.',
          'The concert brought together young performers, professional musicians, dancers, and community artists. It combined Eastern and Western musical traditions, presenting works inspired by Chinese history, Central Asian cultural routes, European poetry, courtly music, and the Italian Renaissance. The event highlighted how music can carry history, connect cultures, and create dialogue between different artistic traditions.',
          'Young performers played an important role in the concert, sharing the stage with musicians and artists from conservatorium and professional backgrounds. This reflected the association’s commitment to creating meaningful performance opportunities for young people while also presenting high-quality artistic programs for the wider community.',
          'The event was supported by community partners and cultural organisations, with special sponsorship from the Consulate-General of the People’s Republic of China in Adelaide. The concert was also promoted through local Chinese-language and community media platforms.',
          'A Journey of Brilliance was more than a concert. It was a cross-cultural artistic project that invited audiences to experience the Silk Road not only as a historical route, but also as a living symbol of cultural exchange, artistic connection, and shared human creativity.'
        ],
        highlights: [
          'Presented at Elder Hall, Adelaide, on 13 April 2025.',
          'Designed as an immersive musical journey from the Silk Road to the European Renaissance.',
          'Explored cultural routes including Chang’an, Dunhuang, the Taklamakan Desert, Kashgar, Samarkand, Constantinople, and Europe.',
          'Brought together young performers, professional musicians, dancers, and community artists.',
          'Combined Eastern and Western musical traditions through music, dance, storytelling, and cultural imagery.',
          'Supported by community partners and cultural organisations.',
          'Promoted through local Chinese-language and community media platforms.'
        ],
        videos: [ { embedId: '30Lyqw0Ezrw'}, { embedId: 'Pd2HLYB1sA0'}, { embedId: 'HBbTgeLTQDw' }, { embedId: 'bsuz1ki2CD0' }, { embedId: 'FYeHWYvIblE' }]
      },
      {
        id: '20240930',
        href: eventHref('20240930'),
        startDate: '2024-09-30',
        title: 'Impressions of China: A Musical Journey Through History and Diversity',
        subtitle: 'A multicultural concert celebrating Chinese history, cultural diversity, and artistic exchange.',
        date: '30 Sep 2024',
        location: 'Ukaria Cultural Centre',
        paragraphs: [
          'Impressions of China was a multicultural concert held on 30 September 2024 at Ukaria Cultural Centre. The concert was organised by Yiyin Elsa Tian, President of South Australian International Musicians Association and a PhD candidate at Griffith University Queensland Conservatorium.',
          'The concert was designed as a musical journey through Chinese history, culture, ethnic diversity, and landscape. With the themes of “Glorious History and Splendid Culture” and “Colorful Ethnicities and Magnificent Landscapes,” the program brought together Chinese and Western musical elements and presented a rich cultural experience for South Australian audiences.',
          'Performers from China, Australia, Italy, and Malaysia participated in the concert, presenting a program that included traditional Chinese costume, poetry recitation, tea ceremony, classical dance, guqin, guzheng, pipa, piano, flute, violin, vocal performance, and ensemble music.',
          'The concert attracted distinguished guests from political, educational, artistic, and business communities, including representatives from South Australia’s multicultural sector, the Consulate-General of China in Adelaide, the Elder Conservatorium of Music at the University of Adelaide, arts institutions, media, and community organisations.',
          'All 200 tickets were sold out, and the audience included guests from Australia, France, Italy, China, Brazil, and the United Kingdom. Impressions of China was more than a concert; it was a cultural exchange event that used music, performance, and storytelling to build understanding between communities.',
        ],
        highlights: [
          'Sold-out concert with 200 tickets sold.',
          'Held at Ukaria Cultural Centre, one of South Australia’s distinctive cultural venues.',
          'Performers from China, Australia, Italy, and Malaysia.',
          'Audience members from Australia, France, Italy, China, Brazil, and the United Kingdom.',
          'Program included Hanfu, poetry recitation, tea ceremony, classical dance, guqin, guzheng, pipa, piano, flute, violin, vocal performance, and ensemble music.',
          'Attended by representatives from multicultural, diplomatic, educational, artistic, business, and community sectors.',
          'Presented Chinese cultural heritage through a multicultural and community-focused artistic platform.',
        ],
        galleryImages: impressionsOfChinaImages,
        videos: [ { embedId: 'v9QqS4z8tIo' } ]
      },
    ],
  },
  zh: {
    hero: {
      eyebrow: '活动',
      title: '文化、社区与公益关怀的重点项目。',
      paragraphs: [
        '南澳国际音乐协会通过音乐项目连接多元文化交流、青少年表演机会与社区公益服务。',
        '活动状态会根据活动日期自动判断；日期尚未到来的活动显示为即将举办，日期已过去的活动显示为已举办。',
      ],
    },
    sections: {
      upcomingTitle: '即将举办活动',
      upcomingSummary: '日期尚未到来的活动。',
      pastTitle: '已举办活动',
      pastSummary: '已经完成的活动。',
    },
    labels: {
      upcoming: '即将举办',
      past: '已举办',
      highlights: '活动亮点',
      details: '查看活动页面',
      backToEvents: '返回活动列表',
      eventDetails: '活动详情',
      notFoundTitle: '未找到活动',
      notFoundSummary: '该活动页面暂不可用。',
      noEvents: '此分类下暂无活动。',
      gallery: '活动图片',
      videos: '视频',
      resources: '活动资料',
      openResource: '打开资料',
    },
    events: [
      {
        id: '20261016',
        href: eventHref('20261016'),
        startDate: '2026-10-16',
        title: '《每个孩子都应有梦想》',
        subtitle: 'Elsa 和她的孩子们：支持儿童癌症家庭慈善音乐剧音乐会',
        date: '2026年10月16日',
        location: 'Royalty Theatre',
        paragraphs: [
          '南澳国际音乐协会正在筹备下一场慈善音乐会《每个孩子都应有梦想》，计划于 2026年10月16日 举办。这是一场由 Elsa Tian 带领学生共同呈现的音乐剧慈善音乐会，旨在为患癌儿童及其家庭筹集善款。',
          '本场音乐会围绕孩子们的声音、故事与梦想展开。年轻表演者将通过大家熟悉和喜爱的音乐剧及电影歌曲，表达勇气、想象、爱、希望与坚韧。',
          '节目将包括来自《狮子王》《Matilda》《小美人鱼》《冰雪奇缘》《歌剧魅影》《悲惨世界》《马戏之王》和《西贡小姐》等经典音乐剧与电影作品中的歌曲。这些作品共同讲述童年、身份、勇敢、亲情、失去、梦想，以及继续前行的力量。',
          '本场音乐会的核心信念很简单：每一个孩子都应该拥有梦想、被爱和被支持的机会。我们希望通过音乐表演与社区捐助，为正在面对儿童癌症挑战的家庭送去关怀与实际支持。',
          '这场活动也将为年轻歌者提供一个有意义的舞台，让他们能够用自己的才华支持公益事业。当孩子们为了其他孩子站上舞台时，他们将学习到：音乐不仅是表演，也是同理心、责任感，以及为他人带去希望的方式。',
        ],
        details: [
          { label: '项目名称', value: 'Elsa & Her Children - A Dream for Every Child' },
          { label: '日期', value: '2026年10月16日' },
          { label: '地点', value: 'Royalty Theatre' },
          { label: '主办', value: '南澳国际音乐协会' },
          { label: '表演者', value: '约18-20名8-15岁获奖青少年声乐表演者' },
          {
            label: '艺术水准',
            value: '所有受邀表演者均曾在声乐比赛中获得前三名，其中超过半数曾获得 Adelaide Eisteddfod 第一名。',
          },
          { label: '预计观众', value: '约500人' },
          { label: '志愿者', value: '约20-25人，包括教师、家长、委员会成员、前台及协助人员' },
          { label: '宗旨', value: '鼓励青少年通过音乐服务社区，同时为受儿童癌症影响的家庭筹集善款。' },
          { label: '申请资助', value: '$3,300' },
        ],
        posterImage: {
          label: '音乐会海报',
          url: eventAssetUrl('20261016', 'poster.jpg'),
        },
        resources: [
          {
            label: '募捐授权文件',
            type: 'pdf',
            url: eventAssetUrl('20261016', 'Authority.pdf'),
          },
        ],
      },
      {
        id: '20261024',
        href: eventHref('20261024'),
        startDate: '2026-10-24',
        title: 'Voices Beyond Borders',
        subtitle: 'A Film Music Concert in Remembrance of World War II',
        date: '24 Oct 2026',
        location: 'Elder Hall',
        paragraphs: [
          'Not celebration, but remembrance.',
          'Not victory, but reflection.',
          'Not nations, but human lives.'
        ]
      },
      {
        id: '20250413',
        href: eventHref('20250413'),
        startDate: '2025-04-13',
        title: '《辉煌之旅：从丝绸之路到文艺复兴》',
        subtitle: '一场跨越时空与文化的音乐之旅',
        date: '2025年4月13日',
        location: 'Elder Hall',
        paragraphs: [
          '《辉煌之旅：从丝绸之路到文艺复兴》是一场于2025年4月13日在阿德莱德 Elder Hall 举办的多元文化音乐会。本场音乐会由南澳国际音乐家协会主办，以沉浸式音乐旅程的形式，带领观众穿越历史、地域与文化。',
          '音乐会以古代丝绸之路为灵感，从东方古都长安出发，途经敦煌、塔克拉玛干沙漠、喀什、撒马尔罕、君士坦丁堡，并最终抵达欧洲文明与文艺复兴的文化景观。通过音乐、舞蹈与叙事，节目展现了人类文明中人员、思想、艺术与文化记忆的流动。',
          '本场音乐会汇聚了年轻表演者、专业音乐家、舞蹈家及社区艺术工作者，融合东方与西方音乐传统，呈现了受中国历史、中亚文化路线、欧洲诗意、宫廷音乐及意大利文艺复兴启发的艺术内容。活动展现了音乐如何承载历史、连接文化，并在不同艺术传统之间建立对话。',
          '年轻表演者在本场音乐会中扮演了重要角色。他们与来自音乐学院及专业艺术团体背景的音乐家和舞蹈家同台演出。这体现了协会致力于为年轻人创造有意义的舞台机会，同时也为更广泛社区呈现高质量艺术项目的宗旨。',
          '本场活动获得了社区伙伴及文化组织的支持，并得到中华人民共和国驻阿德莱德总领事馆的特别赞助。音乐会也通过本地中文媒体与社区媒体平台进行了宣传。',
          '《辉煌之旅》不仅是一场音乐会，也是一项跨文化艺术项目。它邀请观众将丝绸之路视为一条历史路线，也视为文化交流、艺术连接与人类共同创造力的鲜活象征。'
        ],
        highlights: [
          '于2025年4月13日在阿德莱德 Elder Hall 举办。',
          '以“从丝绸之路到欧洲文艺复兴”为主题，打造沉浸式音乐旅程。',
          '内容涵盖长安、敦煌、塔克拉玛干沙漠、喀什、撒马尔罕、君士坦丁堡及欧洲等文化路线。',
          '汇聚年轻表演者、专业音乐家、舞蹈家及社区艺术工作者。',
          '通过音乐、舞蹈、叙事与文化意象融合东方与西方音乐传统。',
          '获得社区伙伴与文化组织支持。',
          '通过本地中文媒体与社区媒体平台进行宣传。'
        ],
        videos: [ { embedId: '30Lyqw0Ezrw'}, { embedId: 'Pd2HLYB1sA0'}, { embedId: 'HBbTgeLTQDw' }, { embedId: 'bsuz1ki2CD0' }, { embedId: 'FYeHWYvIblE' }]
      },
      {
        id: '20240930',
        href: eventHref('20240930'),
        startDate: '2024-09-30',
        title: '《中国印象：穿越历史与多元文化的音乐之旅》',
        subtitle: '一场展现中国历史、文化多样性与艺术交流的多元文化音乐会。',
        date: '2024年9月30日',
        location: 'Ukaria Cultural Centre',
        paragraphs: [
          '《中国印象》是一场于2024年9月30日在 Ukaria Cultural Centre 举办的多元文化音乐会。本场音乐会由南澳国际音乐协会会长、Griffith University Queensland Conservatorium 博士候选人 Elsa Tian 策划并组织。',
          '本场音乐会以音乐作为线索，带领观众穿越中国历史、文化、民族多样性与自然景观。音乐会分为“辉煌历史与灿烂文化”和“多彩民族与壮丽山河”两个主题部分，融合中国与西方音乐元素，为南澳观众呈现了一场丰富的文化体验。',
          '来自中国、澳大利亚、意大利和马来西亚的表演者共同参与演出。节目内容包括中国传统服饰展示、诗歌朗诵、茶艺、古典舞、古琴、古筝、琵琶、钢琴、长笛、小提琴、声乐及合奏作品。',
          '本场音乐会吸引了来自政治、教育、艺术及商业领域的嘉宾，包括南澳多元文化领域代表、中国驻阿德莱德总领馆代表、阿德莱德大学 Elder Conservatorium of Music 的学者、艺术机构、媒体及社区组织代表。',
          '全部200张门票售罄，观众来自澳大利亚、法国、意大利、中国、巴西和英国等不同国家。《中国印象》不仅是一场音乐会，也是一场通过音乐、表演与故事讲述促进社区理解的文化交流活动。',
        ],
        highlights: [
          '200张门票全部售罄。',
          '活动于南澳特色文化场地 Ukaria Cultural Centre 举办。',
          '表演者来自中国、澳大利亚、意大利和马来西亚。',
          '观众来自澳大利亚、法国、意大利、中国、巴西和英国等不同国家。',
          '节目涵盖汉服、诗歌朗诵、茶艺、古典舞、古琴、古筝、琵琶、钢琴、长笛、小提琴、声乐及合奏。',
          '活动嘉宾来自多元文化、外交、教育、艺术、商业及社区领域。',
          '通过多元文化与社区艺术平台，展示中华文化遗产。',
        ],
        galleryImages: impressionsOfChinaImages,
        videos: [ { embedId: 'v9QqS4z8tIo' } ]
      },
    ],
  },
}
