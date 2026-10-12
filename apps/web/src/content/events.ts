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

export function eventAssetUrl(eventId: string, file: string, version?: string) {
  const encodedFile = file
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  const query = version ? `?v=${encodeURIComponent(version)}` : ''
  return `${r2PublicBaseUrl ?? ''}/events/${eventId}/${encodedFile}${query}`
}

const silkRoadImages = [
  { file: 'web_Audience.jpg', height: 400 },
  { file: 'web_Choir.jpg', height: 520 },
  { file: 'web_Dance.jpg', height: 640 },
  { file: 'web_Flute.jpg', height: 430 },
  { file: 'web_Guqin.jpg', height: 520 },
  { file: 'web_Guzheng.jpg', height: 520 },
  { file: 'web_Huqin.jpg', height: 520 },
  { file: 'web_MC.jpg', height: 450 },
  { file: 'web_MC2.jpg', height: 520 }
].map(({ file, height }, index) => {
  const url = eventAssetUrl('20250413', file)

  return {
    id: `20250413-image-${index + 1}`,
    img: url,
    url,
    height,
  }
})

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

const charityConcertPerformersEn = {
  eyebrow: 'Young Performer Spotlight',
  title: 'Meet Our Young Performers',
  subtitle:
    'Prize-winning young singers. Major scholarship recipients. State Opera experience. A programme of musical-theatre favourites, performed in support of children and families affected by cancer.',
  note: 'All competition results below are from the Adelaide Eisteddfod Vocal Division.',
  quote: {
    heading: 'Young Voices. Real Achievement. A Meaningful Cause.',
    subheading: 'No child. No family. No one should face the journey alone.',
    footer: 'An Evening of Musical Theatre | Children, dreams, courage, dignity and community',
  },
  list: [
    {
      name: 'Isabelle Duong',
      achievements: [
        '2026 – 1st Prize, 10 & Under Character Solo',
        'Highly Commended, Contemporary Solo',
        '2026 – 3rd Prize, Sydney Eisteddfod 8&u Musical Theatre vocal section'
      ],
      songs: ['“Naughty” – Matilda'],
    },
    {
      name: 'Clara Cutri',
      achievements: [
        '2026 – 1st Prize, Classical English Solo',
        '2026 – 1st Prize, Classical LOTE Solo',
        '2025 – 1st Prize, LOTE Solo',
      ],
      songs: [
        '“Can You Feel the Love Tonight” – The Lion King',
        '“Heart of Stone” – SIX',
        '“When We’re Together” – Frozen',
        '“A Million Dreams” – The Greatest Showman',
      ],
    },
    {
      name: 'Heather Fa',
      achievements: ['2026 – 3rd Prize, 10 & Under Character Solo'],
      songs: ['“When I Grow Up” – Matilda', '“Castle on a Cloud” – Les Misérables'],
    },
    {
      name: 'Analia Wang',
      achievements: ['2026 – 1st Prize, 10 & Under Contemporary Solo'],
      songs: ['“Once Upon a December” – Anastasia'],
    },
    {
      name: 'Aimee Chloe Cui',
      achievements: ['2026 – 1st Prize, 10 & Under Contemporary Solo'],
      songs: ['“Electricity” – Billy Elliot'],
    },
    {
      name: 'Phillip Yufu Cheng',
      achievements: [
        '2025 Young Virtuoso Vocal Section Winner',
        'Grace Barbara Turner Award for Excellence in Performance',
        '2024 & 2025 – 1st Prize, Open Art Song Solo',
        'Selected by State Opera South Australia as one of the Three Boys in Mozart’s The Magic Flute',
      ],
      songs: ['“Think of Me” – The Phantom of the Opera'],
    },
    {
      name: 'Chloe Evelyn Mu',
      achievements: [
        '2025 – 1st Prize, Duet',
        '2026 – 2nd Prize, Contemporary Solo',
        '2026 – 3rd Prize, Jazz / Blues / Gospel Solo',
      ],
      songs: [
        '“Part of Your World” – The Little Mermaid',
        '“I’ll Give My Life for You” – Miss Saigon',
        '“This Is Me” – The Greatest Showman',
      ],
    },
    {
      name: 'Anya Wu',
      achievements: ['2025 – Highly Commended, 10 & Under Classical Voice Solo'],
      songs: ['“Do You Want to Build a Snowman?” – Frozen'],
    },
    {
      name: 'Scarlett Ng',
      achievements: ['Featured young performer in this concert programme'],
      songs: ['“How Far I’ll Go” – Moana'],
    },
    {
      name: 'Celine Yuan',
      achievements: [
        '2026 Lady Anne Miller Award',
        'Four 1st Prizes at the 2026 Adelaide Eisteddfod',
        'Selected by State Opera South Australia as one of the Three Boys in Mozart’s The Magic Flute',
      ],
      songs: [
        '“On My Own” – Les Misérables',
        '“The Next Right Thing” – Frozen',
        '“When We’re Together” – Frozen',
        '“A Million Dreams” – The Greatest Showman',
      ],
    },
    {
      name: 'Owen Wu',
      achievements: [
        '2025 – 1st Prize, 12 & Under LOTE Solo',
        '2025 – 3rd Prize, Duet',
        '2024 – 3rd Prize, Character Solo & Contemporary Solo',
      ],
      songs: ['“Can You Feel the Love Tonight” – The Lion King'],
    },
  ],
}

const charityConcertScheduleEn = {
  eyebrow: 'Concert Programme',
  title: 'Charity Concert Programme',
  subtitle: 'Concert & Artistic Director, Music Director & Vocal Coach: Yiyin Elsa Tian',
  sections: [
    {
      part: 'Part I',
      theme: 'Children, Dreams & Possibility',
      items: [
        { number: 1, work: 'Matilda', song: 'Naughty', performer: 'Isabelle Duong' },
        { number: 2, work: 'Matilda', song: 'When I Grow Up', performer: 'Heather Fa' },
        { number: 3, work: 'Billy Elliot', song: 'Electricity', performer: 'Aimee Chloe Cui', notes: 'The Dream of Growing Up' },
        { number: 4, work: 'The Little Mermaid', song: 'Part of Your World', performer: 'Chloe Mu' },
        { number: 5, work: 'Moana', song: 'How Far I’ll Go', performer: 'Scarlett Ng', notes: 'Bravely Finding Your Own World' },
        { work: 'Special Message', song: 'Why We Are Here', performer: 'SAIMA Community' },
        { number: 7, work: 'Coco', song: 'Everyone Knows Juanita', performer: 'Performer TBC', notes: 'Special version with additional lyrics written for this concert' },
      ],
    },
    {
      part: 'Part II',
      theme: 'When the World Changes',
      items: [
        { number: 8, work: 'Anastasia', song: 'Once Upon a December', performer: 'Analia Wang', notes: 'Memory' },
        { number: 9, work: 'The Phantom of the Opera', song: 'Think of Me', performer: 'Phillip Cheng', notes: 'Longing' },
        { number: 10, work: 'Les Misérables', song: 'Castle on a Cloud', performer: 'Heather Fa', notes: 'A Child’s Safe World' },
        { number: 11, work: 'Frozen', song: 'Do You Want to Build a Snowman?', performer: 'Anya Wu', notes: 'Loneliness' },
        { number: 12, work: 'Les Misérables', song: 'On My Own', performer: 'Celine Yuan' },
        { number: 13, work: 'Frozen', song: 'The Next Right Thing', performer: 'Celine Yuan', notes: 'Keep Walking Through the Dark' },
        { number: 14, work: 'SIX', song: 'Heart of Stone', performer: 'Clara Cutri', notes: 'Love Does Not Change' },
        { number: 15, work: 'Miss Saigon', song: 'I’ll Give My Life for You', performer: 'Chloe Mu', notes: 'A Parent’s Love' },
      ],
    },
    {
      part: 'Part III',
      theme: 'Together',
      items: [
        { number: 16, work: 'Frozen / Olaf’s Frozen Adventure', song: 'When We’re Together', performer: 'Clara Cutri & Celine Yuan' },
        { number: 17, work: 'The Greatest Showman', song: 'A Million Dreams', performer: 'Celine Yuan & Clara Cutri', notes: 'Dreaming Still' },
        { number: 18, work: 'The Greatest Showman', song: 'This Is Me', performer: 'Chloe Mu', notes: 'Courage, Dignity & Strength' },
        { number: 19, work: 'Finale: We Stand Together', song: 'We Are Australian', performer: 'Full Cast' },
      ],
    },
  ],
}

const charityConcertPerformersZh = {
  eyebrow: '青年演员特写',
  title: '走近青年小歌者',
  subtitle:
    '获奖年轻声乐人才、重要奖学金获得者、南澳州歌剧院演出经历。精选经典音乐剧唱段，为患癌儿童及家庭送去温暖与支持。',
  note: '以下所有赛事获奖成绩均来自阿德莱德音乐节（Adelaide Eisteddfod）声乐组比赛。',
  quote: {
    heading: '年轻的声音 · 卓越的才华 · 深刻的意义',
    subheading: '每一个孩子，每一个家庭，都不应独自面对艰难旅程。',
    footer: '音乐剧慈善之夜 | 纯真童年 · 梦想力量 · 勇敢坚韧 · 社区温暖',
  },
  list: [
    {
      name: 'Isabelle Duong',
      achievements: [
        '2026年 10岁及以下角色独唱 第一名',
        '当代独唱 优秀奖（Highly Commended）',
      ],
      songs: ['《Naughty》– 音乐剧《Matilda》'],
    },
    {
      name: 'Clara Cutri',
      achievements: [
        '2026年 古典英语独唱 第一名',
        '2026年 外语古典独唱（LOTE）第一名',
        '2025年 外语独唱（LOTE）第一名',
      ],
      songs: [
        '《Can You Feel the Love Tonight》– 《狮子王》',
        '《Heart of Stone》– 《SIX》',
        '《When We’re Together》– 《冰雪奇缘》',
        '《A Million Dreams》– 《马戏之王》',
      ],
    },
    {
      name: 'Heather Fa',
      achievements: ['2026年 10岁及以下角色独唱 第三名'],
      songs: ['《When I Grow Up》– 《Matilda》', '《Castle on a Cloud》– 《悲惨世界》'],
    },
    {
      name: 'Analia Wang',
      achievements: ['2026年 10岁及以下当代独唱 第一名'],
      songs: ['《Once Upon a December》– 《真假公主/安娜斯塔西娅》'],
    },
    {
      name: 'Aimee Chloe Cui',
      achievements: ['2026年 10岁及以下当代独唱 第一名'],
      songs: ['《Electricity》– 《跳出我天地/比利·艾略特》'],
    },
    {
      name: 'Phillip Yufu Cheng',
      achievements: [
        '2025年 青年大师声乐组（Young Virtuoso）优胜者',
        'Grace Barbara Turner 杰出表演奖',
        '2024 & 2025年 公开组艺术歌曲独唱 第一名',
        '入选南澳州歌剧院在莫扎特《魔笛》中饰演“三神童”之一',
      ],
      songs: ['《Think of Me》– 《歌剧魅影》'],
    },
    {
      name: 'Chloe Evelyn Mu',
      achievements: [
        '圣彼得女子学校奖学金（至少50%）',
        '2025年 重唱/二重唱 第一名',
        '2026年 当代独唱 第二名',
        '2026年 爵士/蓝调/福音独唱 第三名',
      ],
      songs: [
        '《Part of Your World》– 《小美人鱼》',
        '《I’ll Give My Life for You》– 《西贡小姐》',
        '《This Is Me》– 《马戏之王》',
      ],
    },
    {
      name: 'Anya Wu',
      achievements: ['2025年 10岁及以下古典独唱 优秀奖（Highly Commended）'],
      songs: ['《Do You Want to Build a Snowman?》– 《冰雪奇缘》'],
    },
    {
      name: 'Scarlett Ng',
      achievements: ['本次慈善音乐会特邀青年演出者'],
      songs: ['《How Far I’ll Go》– 《海洋奇缘》'],
    },
    {
      name: 'Celine Yuan',
      achievements: [
        '圣伊格内修斯学院 100% 校长全额奖学金',
        '2026年 Lady Anne Miller 奖获得者',
        '2026年 阿德莱德音乐节 四项第一名',
        '入选南澳州歌剧院在莫扎特《魔笛》中饰演“三神童”之一',
      ],
      songs: [
        '《On My Own》– 《悲惨世界》',
        '《The Next Right Thing》– 《冰雪奇缘》',
        '《When We’re Together》– 《冰雪奇缘》',
        '《A Million Dreams》– 《马戏之王》',
      ],
    },
    {
      name: 'Owen Wu',
      achievements: [
        '2025年 12岁及以下外语独唱（LOTE）第一名',
        '2025年 二重唱 第三名',
        '2024年 角色独唱与当代独唱 第三名',
      ],
      songs: ['《Can You Feel the Love Tonight》– 《狮子王》'],
    },
  ],
}

const charityConcertScheduleZh = {
  eyebrow: '音乐会节目单',
  title: '慈善音乐会完整曲目单',
  subtitle: '音乐会与艺术总监、音乐指导与声乐指导：田依因（Yiyin Elsa Tian）',
  sections: [
    {
      part: '第一部分',
      theme: '纯真、梦想与可能（Children, Dreams & Possibility）',
      items: [
        { number: 1, work: '《Matilda》', song: 'Naughty', performer: 'Isabelle Duong' },
        { number: 2, work: '《Matilda》', song: 'When I Grow Up', performer: 'Heather Fa' },
        { number: 3, work: '《Billy Elliot》', song: 'Electricity', performer: 'Aimee Chloe Cui', notes: '成长的梦想' },
        { number: 4, work: '《The Little Mermaid》', song: 'Part of Your World', performer: 'Chloe Mu' },
        { number: 5, work: '《Moana》', song: 'How Far I’ll Go', performer: 'Scarlett Ng', notes: '勇敢探索自己的世界' },
        { work: '特别分享', song: 'Why We Are Here（我们为何相聚）', performer: 'SAIMA 社群' },
        { number: 7, work: '《Coco》', song: 'Everyone Knows Juanita', performer: '待定', notes: '为本场音乐会特别创作扩展歌词版本' },
      ],
    },
    {
      part: '第二部分',
      theme: '世界改变的时刻（When the World Changes）',
      items: [
        { number: 8, work: '《Anastasia》', song: 'Once Upon a December', performer: 'Analia Wang', notes: '记忆' },
        { number: 9, work: '《歌剧魅影》', song: 'Think of Me', performer: 'Phillip Cheng', notes: '渴望与怀念' },
        { number: 10, work: '《悲惨世界》', song: 'Castle on a Cloud', performer: 'Heather Fa', notes: '孩子的安全庇护所' },
        { number: 11, work: '《冰雪奇缘》', song: 'Do You Want to Build a Snowman?', performer: 'Anya Wu', notes: '孤单' },
        { number: 12, work: '《悲惨世界》', song: 'On My Own', performer: 'Celine Yuan' },
        { number: 13, work: '《冰雪奇缘》', song: 'The Next Right Thing', performer: 'Celine Yuan', notes: '在黑暗中继续前行' },
        { number: 14, work: '《SIX》', song: 'Heart of Stone', performer: 'Clara Cutri', notes: '永恒不变的爱' },
        { number: 15, work: '《西贡小姐》', song: 'I’ll Give My Life for You', performer: 'Chloe Mu', notes: '父母之爱' },
      ],
    },
    {
      part: '第三部分',
      theme: '心手相连（Together）',
      items: [
        { number: 16, work: '《冰雪奇缘》', song: 'When We’re Together', performer: 'Clara Cutri & Celine Yuan' },
        { number: 17, work: '《马戏之王》', song: 'A Million Dreams', performer: 'Celine Yuan & Clara Cutri', notes: '依然怀揣梦想' },
        { number: 18, work: '《马戏之王》', song: 'This Is Me', performer: 'Chloe Mu', notes: '勇气、尊严与力量' },
        { number: 19, work: '终曲：并肩前行', song: 'We Are Australian', performer: '全体演职人员' },
      ],
    },
  ],
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
        seoTitle: 'A Dream for Every Child | Adelaide Charity Concert | 16 October 2026',
        seoDescription:
          'An award-winning cast of young vocalists performs musical theatre favourites at Adelaide’s Royalty Theatre, raising funds for children and families affected by cancer. Tickets from $25.',
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
          { label: 'Project Name', value: 'Elsa & Her Children – A Dream for Every Child' },
          { label: 'Date', value: '16 October 2026' },
          { label: 'Venue', value: 'Royalty Theatre' },
          { label: 'Presenter', value: 'South Australia International Musicians Association' },
          { label: 'Performers', value: 'Approximately 18–20 award-winning young vocalists aged 8–15' },
          {
            label: 'Artistic Standard',
            value:
              'All invited performers have previously achieved top-three placings in vocal competitions, with more than half being First Prize winners at the Adelaide Eisteddfod.',
          },
          { label: 'Audience Capacity', value: 'Approximately 500 seats' },
          {
            label: 'Purpose',
            value:
              'To inspire young people to serve the community through music while raising funds to support families affected by childhood cancer.',
          },
        ],
        performers: charityConcertPerformersEn,
        programSchedule: charityConcertScheduleEn,
        posterImage: {
          label: 'Concert Poster',
          url: eventAssetUrl('20261016', 'poster-v2.jpg', '20260906'),
        },
        programImage: {
          label: 'Concert Program',
          url: eventAssetUrl('20261016', 'program-v2.jpg', '20260906'),
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
        subtitle: 'An International Concert of Peace, Memory and Humanity',
        date: '24 October 2026',
        location: 'Adelaide, South Australia · Elder Hall',
        leadQuote:
          'When music transcends borders and history finds its voice through melody, we come together to remember the past, honour humanity, and envision a more peaceful world.',
        paragraphs: [
          'Presented by the South Australian International Musicians Association (SAIMA), Voices Beyond Borders is a major multicultural concert dedicated to peace, remembrance, human dignity, and the shared experiences of humanity in times of war and conflict.',
          'Bringing together powerful film music from different countries, cultures, and historical contexts, the concert explores the human stories behind conflict through live vocal and instrumental performances.',
          'From Asia to Europe, from historical tragedies to contemporary reflections, music from diverse cultural traditions will come together on one stage. While languages, histories, and national identities may differ, our shared longing for love, family, dignity, and peace remains universal.',
        ],
        overviewSections: [
          {
            heading: 'A Musical Journey Across Cultures and History',
            paragraphs: [
              'Featuring musicians and performers from diverse cultural backgrounds, Voices Beyond Borders presents a rich and compelling program of solo performances, duets, ensemble works, choral music, and instrumental compositions.',
              'Inspired by films and stories from around the world, the selected works explore the experiences of children, families, civilians, soldiers, and survivors whose lives have been shaped by war and conflict.',
              'Rather than presenting war through the lens of military triumph or national rivalry, the concert turns its attention to the individuals whose lives and stories are so often overshadowed by history.',
              'Through music, audiences are invited to experience the emotions of separation and loss, courage and resilience, compassion and hope — and to discover the humanity that connects us beyond cultural and national boundaries.',
            ],
          },
          {
            heading: 'Remembering History. Celebrating Humanity. Connecting the World.',
            paragraphs: [
              'Voices Beyond Borders is more than a concert. It is a celebration of cultural dialogue, artistic collaboration, and the extraordinary ability of music to connect people across languages, generations, and borders.',
              "By bringing film music to life through powerful performances, the concert creates a shared space for reflection on historical memory, the human cost of war, and the enduring importance of peace in today's world.",
            ],
            callouts: [
              'We remember not the glory of war, but the value of human life.',
              'We seek not victory over others, but understanding between people.',
              'We believe that while borders may divide nations, music has the power to unite humanity.',
            ],
            closingParagraphs: [
              'On 24 October 2026, join us in Adelaide for an unforgettable evening of music, remembrance, and cultural connection.',
              'Together, let us honour the past, celebrate our shared humanity, and give voice to the hope for a world beyond conflict.',
            ],
            footer: 'Presented by South Australian International Musicians Association (SAIMA)',
          },
        ],
        featuredArtists: {
          eyebrow: 'Featured Artists',
          title: 'Meet the Artists',
          subtitle:
            'Acclaimed vocalists and instrumentalists bringing stories of memory, peace, and humanity to the stage.',
          list: [
            {
              name: 'Phillip Yufu Cheng',
              role: 'Vocalist',
              image: '/events/20261024/phillip.jpg',
              bio: [
                'Born in 2014, Phillip Yufu Cheng began his vocal training at age 6 from Elsa Tian, and currently studies with Jessica Dean.',
                "Since age of 7, he was a chorister and soloist of St Peter's Cathedral. He's won numerous top awards in 2024/2025 Adelaide Eisteddfod vocal, 2025 the Grace Barbara Turner Awards for Excellence in Performance (Vocal), Winner of 5mbs Young Virtuoso Award (YVA) vocal section, and he is the youngest performer and winner in the history of YVA.",
                'He performed with State Opera South Australia in 2026 Hansel and Gretel as child chorus, 2025 Magic Flute as 1st spirit, performed with ASO in 2023 Christmas Unwrapped as soloist singing "Walking in the Air”.',
              ],
            },
            {
              name: 'Alexandra Shepherd',
              role: 'Classical Guitarist',
              image: '/events/20261024/alexandra.jpeg',
              bio: [
                'Alexandra Shepherd is an Australian classical guitarist, and has performed both nationally and internationally. In 2017 she travelled to South Korea with the Elder Conservatorium Classical Guitar Ensemble where she performed at the 2017 Korean International Guitar Festival as an ensemble member and a soloist. In 2019 Alex performed at multiple venues across Ontario, Canada. Alex has also performed at the 2014, 2016, and 2018 Adelaide International Guitar Festival as a part of the Adelaide Guitar Festival orchestra and the Elder Conservatorium Guitar Ensemble.',
                'In 2016 Alex completed her Bachelor of Music in Classical Performance at the Elder Conservatorium of Music and completed her Honours degree the following year. In 2021 she completed her Master of Philosophy at the Elder Conservatorium, focusing on extended techniques and descriptive score annotations in contemporary classical guitar compositions. Alex studied under Dr Oliver Fartach-Naini from 2013-2021, and has also received masterclasses from many prominent classical guitarists including Richard Charlton, Raffael Agostino. Timothy Kain, Paul Svoboda, Noyoung Lee, Yongtae Kim, and Martha Masters.',
                'Alex is currently collaborating with British composer, Matthew Sear. Due to their shared love for the music of Ozzy Osbourne and Black Sabbath, Matthew is in the process of writing a sonata for Alex titled ‘Homage to Black Sabbath’. This will be a part of a large concert programme featuring all of Matthew’s solo guitar repertoire, including premieres of Black Sabbath and Ozzy-inspired classical guitar repertoire.',
              ],
            },
            {
              name: 'Yueqi Li (Queenie)',
              role: 'Classical Guitarist & Educator',
              image: '/events/20261024/yueqi.jpeg',
              bio: [
                'Yueqi Li (Queenie) holds a Bachelor of Music (Classical Performance) and a Master of Performance and Pedagogy from the Elder Conservatorium of Music, where she studied under Dr. Oliver Fartach-Naini following earlier training in China with prominent classical guitarists Bozhong Du and Danny Yeh. Throughout her studies, she received multiple academic scholarships and competition prizes. Queenie also had the privilege of participating in masterclasses with internationally acclaimed guitar virtuosos, including Song-ou Lee (South Korea), Raffaele Agostino (Australia), Leonardo Bravo (Argentina), Ken Murray (Australia), Richard Charlton (Australia), José María Gallardo del Rey (Spain), Kyuhee Park (South Korea), and Andrea González Caballero (Spain). Her performances on international stages, including the second and third South Korea International Guitar Festival, the Adelaide Guitar Festival with the Conservatorium Guitar Ensemble, and the Guitarissimo and Guitarathon concert series, collectively have demonstrated her profound connection to the music and her ability to interpret its narratives through expressive playing.',
                'Alongside her performance career, Queenie’s primary professional focus has been classical guitar education. For nearly ten years, Queenie’s dedicated teaching style has found success with students age from 7 to 71, working with beginners through to advanced learners. Her teaching philosophy centres on a holistic approach that emphasises healthy technical development, anatomical awareness, and deep musical understanding. She aims to nurture each student with confidence, artistic expression, and a lifelong appreciation for music. Many of her students take the student leader role in their school ensembles or bands, and all who participated in the Australian Music Examination Board (AMEB) exams received A or A+ results. Serval of her students have also won the first prize and other awards at the Adelaide Eisteddfod Competition.',
                'In recent years, Queenie founded and has directed the ERA (Exceptional Rising Artists) concert series to expand performance opportunities for her students. The series provides young musicians with valuable formal stage experience while fostering a supportive community for emerging artists.',
              ],
            },
          ],
        },
        posterImage: {
          label: 'Concert Poster',
          url: '/events/20261024/concert-poster.png',
        },
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
        posterImage: {
          label: 'Concert Poster',
          url: eventAssetUrl('20250413', 'web_Poster.jpg'),
        },
        galleryImages: silkRoadImages,
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
        seoTitle: 'A Dream for Every Child | Adelaide Charity Concert | 16 October 2026',
        seoDescription:
          'An award-winning cast of young vocalists performs musical theatre favourites at Adelaide’s Royalty Theatre, raising funds for children and families affected by cancer. Tickets from $25.',
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
          { label: '项目名称', value: 'Elsa & Her Children – A Dream for Every Child' },
          { label: '日期', value: '2026年10月16日' },
          { label: '地点', value: 'Royalty Theatre' },
          { label: '主办', value: '南澳国际音乐协会' },
          { label: '表演者', value: '约18–20名8–15岁获奖青少年声乐表演者' },
          {
            label: '艺术水准',
            value: '所有受邀表演者均曾在声乐比赛中获得前三名，其中超过半数曾获得 Adelaide Eisteddfod 第一名。',
          },
          { label: '观众容量', value: '约500席' },
          { label: '宗旨', value: '鼓励青少年通过音乐服务社区，同时为受儿童癌症影响的家庭筹集善款。' },
        ],
        performers: charityConcertPerformersZh,
        programSchedule: charityConcertScheduleZh,
        posterImage: {
          label: '音乐会海报',
          url: eventAssetUrl('20261016', 'poster-v2.jpg', '20260906'),
        },
        programImage: {
          label: '音乐会节目单',
          url: eventAssetUrl('20261016', 'program-v2.jpg', '20260906'),
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
        title: '跨越国界的声音',
        subtitle: '一场关于和平、记忆与人性的国际音乐会',
        date: '2026年10月24日',
        location: '南澳大利亚阿德莱德 · Elder Hall',
        leadQuote:
          '当音乐跨越国界、历史借由旋律发声，我们相聚于此——铭记过往，致敬人性，共同展望一个更加和平的世界。',
        paragraphs: [
          '由南澳国际音乐家协会（SAIMA）主办，《跨越国界的声音》（Voices Beyond Borders）是一场致力于和平、纪念、人类尊严以及战争与冲突中人类共同经历的大型多元文化音乐会。',
          '音乐会汇集来自不同国家、文化与历史背景的经典电影音乐，通过现场声乐与器乐演绎，倾听冲突背后鲜活的人性故事。',
          '从亚洲到欧洲，从历史悲剧到当代反思，多元文化传统的音乐将在同一舞台交汇。尽管语言、历史与民族身份各不相同，但我们对爱、家庭、尊严与和平的向往始终相通。',
        ],
        overviewSections: [
          {
            heading: '跨越文化与历史的音乐旅程',
            paragraphs: [
              '《跨越国界的声音》汇聚来自不同文化背景的音乐家与表演者，呈现涵盖独唱、重唱、室内乐重奏、合唱及器乐作品的丰富曲目。',
              '精选作品灵感源自世界各地的电影与真实故事，关注那些生命被战争与冲突深刻改变的儿童、家庭、平民、士兵与幸存者。',
              '音乐会不以军事胜利或国家对抗的视角呈现战争，而是将目光投向那些往往被宏大历史掩盖的个体生命与故事。',
              '通过音乐，观众将共同体会分离与失去、勇气与坚韧、悲悯与希望——并发现那种超越文化与国界、将我们彼此相连的人性光辉。',
            ],
          },
          {
            heading: '铭记历史 · 礼赞人性 · 连接世界',
            paragraphs: [
              '《跨越国界的声音》不仅是一场音乐会，更是一场文化对话与艺术合作的庆典，展现音乐跨越语言、世代与国界连接人心的非凡力量。',
              '通过动人的现场演绎赋予电影音乐新的生命，音乐会为公众创造一个共同反思历史记忆、战争代价以及和平在当今世界持久价值的公共空间。',
            ],
            callouts: [
              '我们铭记的不是战争的荣耀，而是生命的价值。',
              '我们追求的不是胜过他人，而是人与人之间的理解。',
              '我们相信，国界或许会分隔国家，但音乐拥有团结人类的力量。',
            ],
            closingParagraphs: [
              '2026年10月24日，诚邀您相聚阿德莱德，共度一个充满音乐、纪念与文化连接的难忘夜晚。',
              '让我们携手致敬过往，礼赞共同的人性，为超越冲突的和平世界发出声音。',
            ],
            footer: '南澳国际音乐家协会（SAIMA）荣誉呈献',
          },
        ],
        featuredArtists: {
          eyebrow: '特邀艺术家',
          title: '参演艺术家介绍',
          subtitle: '杰出声乐与器乐艺术家联袂登台，用音乐传递记忆、和平与人性光辉。',
          list: [
            {
              name: 'Phillip Yufu Cheng',
              role: '青年声乐歌者',
              image: '/events/20261024/phillip.jpg',
              bio: [
                'Phillip Yufu Cheng 出生于2014年，6岁起师从田依因（Elsa Tian）老师开启声乐训练，目前师从 Jessica Dean。',
                '自7岁起，他担任圣彼得大教堂合唱团（St Peter’s Cathedral Choir）团员及独唱。他在2024/2025年阿德莱德音乐节（Adelaide Eisteddfod）声乐比赛中屡获最高奖项，并荣获2025年 Grace Barbara Turner 杰出声乐表演奖，以及 5MBS 青年大师奖（Young Virtuoso Award, YVA）声乐组冠军——他也是 YVA 历史上最年轻的参赛者与获奖者。',
                '他曾参演南澳州歌剧院（State Opera South Australia）2026年《汉泽尔与格蕾太尔》儿童合唱团，并在2025年莫扎特歌剧《魔笛》中饰演第一仙童（1st Spirit）；2023年与阿德莱德交响乐团（ASO）合作，在《Christmas Unwrapped》音乐会中担任独唱，献唱《Walking in the Air》。',
              ],
            },
            {
              name: 'Alexandra Shepherd',
              role: '古典吉他演奏家',
              image: '/events/20261024/alexandra.jpeg',
              bio: [
                'Alexandra Shepherd 是澳大利亚知名古典吉他演奏家，演出足迹遍布澳洲及国际舞台。2017年，她随阿德莱德大学埃尔德音乐学院（Elder Conservatorium）古典吉他合奏团赴韩国参加2017韩国国际吉他艺术节，担任合奏团成员及独奏。2019年，Alex 在加拿大安大略省多个音乐厅举办演出。此外，她还曾于2014、2016及2018年作为阿德莱德吉他节乐团与埃尔德音乐学院吉他合奏团成员参演阿德莱德国际吉他节。',
                '2016年，Alex 在埃尔德音乐学院获得古典表演音乐学士学位，并于次年获得荣誉学士学位。2021年，她在埃尔德音乐学院完成哲学硕士（Master of Philosophy）学位，专注于当代古典吉他作品中的扩展技法与描述性乐谱注释研究。2013年至2021年间，Alex 师从 Oliver Fartach-Naini 博士，并曾受教于 Richard Charlton、Raffael Agostino、Timothy Kain、Paul Svoboda、Noyoung Lee、Yongtae Kim 及 Martha Masters 等多位国际著名古典吉他大师的大师班。',
                'Alex 目前正与英国作曲家 Matthew Sear 展开合作。源于双方对 Ozzy Osbourne 与 Black Sabbath 音乐的共同热爱，Matthew 正在为 Alex 创作奏鸣曲《向黑色安息日致敬》（Homage to Black Sabbath），并将在包含多首受其启发的古典吉他新作首演专场音乐会中呈现。',
              ],
            },
            {
              name: 'Yueqi Li (Queenie)',
              role: '古典吉他演奏家、教育家',
              image: '/events/20261024/yueqi.jpeg',
              bio: [
                '李玥琪（Queenie）拥有阿德莱德大学埃尔德音乐学院古典表演学士学位及表演与教学法硕士学位，师从 Oliver Fartach-Naini 博士；赴澳前曾在中国师从著名古典吉他演奏家杜伯仲与叶登民（Danny Yeh）。求学期间，她多次获得学术奖学金与比赛奖项，并曾参加李成雨（韩国）、Raffaele Agostino（澳大利亚）、Leonardo Bravo（阿根廷）、Ken Murray（澳大利亚）、Richard Charlton（澳大利亚）、José María Gallardo del Rey（西班牙）、朴葵姬 Kyuhee Park（韩国）及 Andrea González Caballero（西班牙）等国际吉他大师班。她曾登台第二届及第三届韩国国际吉他艺术节、阿德莱德国际吉他节以及 Guitarissimo 与 Guitarathon 系列音乐会，以细腻而富有叙事感染力的演奏广受赞誉。',
                '除舞台演奏外，Queenie 深耕古典吉他教育近十年，学生年龄涵盖7岁至71岁，从初学者到高阶演奏者皆硕果累累。她倡导整体性的教学理念，注重科学的演奏技术发展、身体机能感知与深刻的音乐理解，致力于培养每位学生的自信心、艺术表现力与终身音乐热忱。她的众多学生在学校乐团中担任首席或声部领奏，所有参加澳大利亚音乐考试局（AMEB）考级的学生均取得 A 或 A+ 的优异成绩，多位学生更在阿德莱德音乐节（Adelaide Eisteddfod）比赛中斩获一等奖及其他重要奖项。',
                '近年来，Queenie 创立并执导了 ERA（Exceptional Rising Artists）新星音乐会系列，为青少年音乐学子提供宝贵的正式舞台演出机会，并构建起支持青年艺术人才成长的温暖社群。',
              ],
            },
          ],
        },
        posterImage: {
          label: '音乐会海报',
          url: '/events/20261024/concert-poster.png',
        },
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
        posterImage: {
          label: '音乐会海报',
          url: eventAssetUrl('20250413', 'web_Poster.jpg'),
        },
        galleryImages: silkRoadImages,
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
