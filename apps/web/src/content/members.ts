import type { Localized } from './types'

export type MemberProfile = {
  order: number
  slug: string
  href: string
  name: string
  role: string
  specialty?: string
  email?: string
  website?: string
  image: string
  summary: string
  bio: string[]
}

type MemberContent = {
  labels: {
    eyebrow: string
    title: string
    summary: string
    viewProfile: string
    backToAbout: string
    contact: string
    website: string
    notFoundTitle: string
    notFoundSummary: string
  }
  members: MemberProfile[]
}

const memberImages = {
  elsa: '/images/saima/members/Elsa.jpg',
  callum: '/images/saima/members/Callum.jpg',
  queenie: '/images/saima/members/Queenie.jpg',
  tina: '/images/saima/members/Tina.jpg',
  yifei: '/images/saima/members/Yifei.jpg',
  baoshan: '/images/saima/members/Baoshan.jpg',
  sonya: '/images/saima/members/Sonya.jpg',
  suraj: '/images/saima/members/Suraj.jpg',
} as const

export const memberContent: Localized<MemberContent> = {
  en: {
    labels: {
      eyebrow: 'Members',
      title: 'Artists, educators and cultural leaders',
      summary:
        'Meet the musicians and educators who support SAIMA through performance, teaching, community projects and cultural exchange.',
      viewProfile: 'View profile',
      backToAbout: 'Back to About',
      contact: 'Contact',
      website: 'Website',
      notFoundTitle: 'Member profile not found',
      notFoundSummary: 'This member profile is not available yet.',
    },
    members: [
      {
        order: 1,
        slug: 'elsa-yiyin-tian',
        href: '/members/elsa-yiyin-tian',
        name: 'Elsa Tian',
        role: 'Founder and President',
        specialty: 'Classical vocalist / Music educator / Cultural project director / Researcher',
        image: memberImages.elsa,
        summary:
          'A classical vocalist, educator, researcher and cultural project director dedicated to music, cultural exchange, community engagement and charitable practice.',
        bio: [
          'Elsa Yiyin Tian is a classical vocalist, music educator, cultural project director, and academic researcher. She is the Founder and President of the South Australia International Musicians Association and serves as Vice President of the Australia China Friendship Society South Australia Branch. Her work is dedicated to strengthening the connections between music, cultural exchange, community engagement, and charitable practice.',
          'Elsa received extensive classical vocal training in Germany before completing postgraduate studies in music performance and research at the University of Adelaide. She was awarded a Master of Philosophy in 2019. She is currently a PhD candidate at the Queensland Conservatorium, Griffith University, where her research focuses on Chinese traditional opera, intangible cultural heritage transmission, children’s arts training, and institutional change.',
          'As a performer, Elsa has been actively involved in classical vocal performance, opera, art song, and cross-cultural music projects. She places particular emphasis on the historical, cultural, and human dimensions of musical works and continues to explore ways of connecting classical music with broader community audiences through narrative, visual media, literature, and interdisciplinary artistic presentation.',
          'Elsa has extensive and diverse experience as a vocal educator. She previously served as a vocal tutor for the St Peter’s Cathedral Choir in Adelaide. Her teaching encompasses classical singing, musical theatre, contemporary and popular vocal styles, and stage performance.',
          'Elsa regularly prepares students for South Australian Eisteddfod competitions and other vocal and performance events. Each year, her students collectively receive more than 25 awards across a range of age groups and categories, including classical voice, musical theatre, and popular singing.',
          'Elsa is also an experienced cultural event organiser. She has conceived, directed, and delivered major concerts, community performances, cross-cultural initiatives, and charitable projects, including Impressions of China in 2024 and A Journey of Brilliance: From the Silk Road to the Renaissance in 2025.',
          'Under her leadership, SAIMA has developed a strong commitment to high-quality performance, community service and charitable engagement. Elsa founded the Association to create an arts platform centred on musicians, music students and the wider community.',
        ],
      },
      {
        order: 2,
        slug: 'callum-mcging',
        href: '/members/callum-mcging',
        name: 'Callum McGing',
        role: 'Vice President',
        specialty: 'Opera / Vocal coaching / Mandarin language education',
        image: memberImages.callum,
        summary:
          'An Adelaide tenor and vocal coach who works across opera, contemporary performance, language and youth music education.',
        bio: [
          'Callum McGing is a tenor and vocal coach from Adelaide, South Australia. A graduate of the Elder Conservatorium of Music, he has worked regularly with State Opera South Australia since 2018, appearing in main-stage and festival productions and taking on the title role in their schools production of The Frog Prince.',
          "Callum works across languages and styles, working as an Australian Contemporary Opera Company Rising Artist in Melbourne, and recently appearing in Shandong Satellite Television's Spring Festival programme in 2025.",
          'He also represented South Australia in the 2016 9th Youth Chinese Bridge competition in Kunming, Yunnan.',
          'Callum is passionate about expanding the operatic form in Australia and bringing young people of all backgrounds together through his music and Mandarin language education.',
        ],
      },
      {
        order: 4,
        slug: 'yueqi-queenie-li',
        href: '/members/yueqi-queenie-li',
        name: 'Queenie Li',
        role: 'Classical Guitarist and Educator',
        specialty: 'Classical guitar / Performance pedagogy / Young artist development',
        email: 'yueqi1206@hotmail.com',
        website: 'https://www.yueqili-classicalguitarist.com/',
        image: memberImages.queenie,
        summary:
          'A classical guitarist and educator whose teaching supports healthy technique, musical understanding and formal stage experience for emerging artists.',
        bio: [
          'Queenie holds a Bachelor of Music in Classical Performance and a Master of Performance and Pedagogy from the Elder Conservatorium of Music, where she studied under Dr. Oliver Fartach-Naini following earlier training in China with prominent classical guitarists Bozhong Du and Danny Yeh.',
          'Throughout her studies, she received multiple academic scholarships and competition prizes. Queenie has participated in masterclasses with internationally acclaimed guitar virtuosos and has been praised for her musical sensitivity.',
          'Her performance experience includes appearances at the 2nd and 3rd South Korea International Guitar Festival, Guitarissimo in Tongyeong, the Adelaide Guitar Festival in 2016, 2018 and 2024, and various local concert series.',
          'Alongside her performance career, Queenie’s primary professional focus has been classical guitar education. For nearly ten years, she has taught students ranging in age from 7 to 71, working with beginners through to advanced learners.',
          'Her teaching philosophy centres on a holistic approach that emphasises healthy technical development, anatomical awareness and deep musical understanding. Many of her AMEB students have achieved A and A+ results, and several students have won prizes at the Adelaide Eisteddfod Competition.',
          'In recent years, Queenie founded and has directed the ERA (Exceptional Rising Artists) concert series to expand performance opportunities for her students and foster a supportive community for emerging artists.',
        ],
      },
      {
        order: 3,
        slug: 'tina-zhao',
        href: '/members/tina-zhao',
        name: 'Tina Zhao',
        role: 'Committee Member',
        specialty: 'Pianist / Composer / Music educator / Arts administrator',
        image: memberImages.tina,
        summary:
          'A pianist, composer, educator and arts administrator who supports SAIMA programs, community projects and international collaboration.',
        bio: [
          'Tina Zhao is a pianist, composer, music educator and arts administrator based in Adelaide, South Australia. She is a Board Member of the South Australia International Musicians Association and the Founder and Director of FLY Music Academy.',
          'Tina began learning piano at the age of five and received extensive musical training from an early age. She studied Music at Shandong University, majoring in Piano Performance while also undertaking studies in composition, voice, and a range of Western and Chinese instruments.',
          'She later completed a Master of Music at the Elder Conservatorium of Music, The University of Adelaide.',
          'As a composer, Tina’s original works have been presented over several years at OZAsia Festival and Adelaide Fringe. Her creative practice draws on both Chinese and Western musical traditions, with a particular interest in cross-cultural collaboration and contemporary music.',
          'With more than 15 years of teaching experience, Tina specialises in piano performance, music theory, aural training and composition. Her students have achieved outstanding results in AMEB examinations and music competitions, including High Distinctions and AMEB Awards.',
          'As a Board Member of SAIMA, Tina actively supports the association’s concerts, educational programs, community projects and international collaborations.',
        ],
      },
      {
        order: 5,
        slug: 'yifei-chong',
        href: '/members/yifei-chong',
        name: 'Evelyn Chong',
        role: 'Committee Member',
        specialty: 'Piano performance / Collaborative piano / Music education',
        image: memberImages.yifei,
        summary:
          'An accomplished pianist and collaborative pianist whose teaching is tailored to each student’s needs and musical goals.',
        bio: [
          'Evelyn is an accomplished pianist, collaborative pianist and sought-after teacher. She graduated with a Master of Music in Piano Performance from the Elder Conservatorium of Music, under the guidance of Vivian Choi Milton.',
          'She holds a Bachelor and Masters degree in Piano Performance from the Xinghai Conservatory of Music in Guangzhou, China, and has participated in masterclasses with internationally renowned pianists including Brendan Kinsella, Natasha Vlassenko and Hsing-Chwen Hsin.',
          'The winner of many prizes and awards, Evelyn was awarded the Lunch Hour Award by Recital Australia in the 2023 Spring Season and received the prestigious National Scholarship in China in recognition of her academic and musical excellence.',
          'As a collaborative pianist, Evelyn has worked for the Adelaide Eisteddfod in the Vocal and String Divisions and at the Xinghai Conservatory of Music in China as a staff accompanist.',
          'Dedicated to music education, Evelyn teaches students of all ages. Her students have achieved excellent results in both AMEB and ABRSM piano examinations, competitions and eisteddfods.',
        ],
      },
      {
        order: 6,
        slug: 'baoshan-wu',
        href: '/members/baoshan-wu',
        name: 'Baoshan Wu',
        role: 'Instrumental Instructor',
        specialty: 'Flute / Piano / Ensemble coaching',
        email: 'Happyflutesa@gmail.com',
        image: memberImages.baoshan,
        summary:
          'A professional instrumental instructor offering flute and piano tuition for students, individuals and ensembles across age groups.',
        bio: [
          'Baoshan Wu is a professional instrumental instructor and a well-qualified music educator with two master degrees in music performance and music education from Zurich University of the Arts in Switzerland.',
          'Baoshan offers flute and piano tuition to all age groups, individual learners and flute ensembles.',
          'She previously served as President of Flute Society SA and as an adjudicator for the Adelaide Eisteddfod.',
          'Baoshan teaches with passion and inspires her students to enjoy music performance.',
          'Her teaching languages include English, Chinese and German. Her music studio is based in Rostrevor.',
          'Contact details: 0413036988 (not available during teaching time; please send a message) / Happyflutesa@gmail.com.',
        ],
      },
      {
        order: 7,
        slug: 'sonya-chong',
        href: '/members/sonya-chong',
        name: 'Sonya Chong',
        role: 'Committee Member',
        specialty: 'Singer / Multicultural performer / Cultural exchange',
        image: memberImages.sonya,
        summary:
          'A Russian-Chinese singer recognised for her warm vocal style and contribution to cultural exchange between China and Australia.',
        bio: [
          'Sonya Chong is a Russian-Chinese singer born in Ili, Xinjiang, China. Known for her warm and distinctive vocal style, she has been widely recognised as the Teresa Teng of the Western Regions.',
          'She is a Committee Member of the South Australian International Musicians Association, a member of the Xinjiang Musicians Association and the Xinjiang Popular Music Association, and serves as Vice President of the Ili Prefecture Recitation Association.',
          'Sonya has appeared on major Chinese television programs including CCTV-3 Very 6+1, Golden 100 Seconds and The Happiness Bill. She was also a featured guest on Shanxi Television Songs from the Yellow River.',
          'Her achievements include placing among the top three performers in the China Farmers Song Competition and receiving the National Most Beautiful Ethnic Voice Award.',
          'Internationally, Sonya has held four solo concerts in Australia and a solo concert in Shanghai. She has also participated in major Chinese New Year galas in Sydney and Melbourne.',
          'In recognition of her contribution to cultural exchange, Sonya was awarded the honorary title of China-Australia Cultural Ambassador.',
          'A distinctive multicultural performer, Sonya is highly regarded by audiences from diverse cultural and ethnic backgrounds. She sings in several languages and has recorded and performed nearly one hundred original songs.',
        ],
      },
      {
        order: 8,
        slug: 'suraj-landge',
        href: '/members/suraj-landge',
        name: 'Suraj Landge',
        role: 'Jazz Guitarist, Vocalist and Educator',
        specialty: 'Jazz guitar / Voice / Contemporary music',
        image: memberImages.suraj,
        summary:
          'A jazz guitarist and vocalist from Mumbai, now based in Adelaide, whose work connects performance, improvisation and music education.',
        bio: [
          'Suraj Landge is a jazz guitarist and vocalist based in Adelaide, South Australia. Originally from Mumbai, India, he holds a Master of Music in Performance and Pedagogy from the Elder Conservatorium of Music, the University of Adelaide.',
          'An active performer, Suraj specialises in jazz and contemporary music, bringing together technical excellence, musical sensitivity and an expressive performance style.',
          'His artistic interests span live performance, improvisation, collaboration and the exploration of diverse musical traditions.',
          'Alongside his performing career, Suraj is also an experienced music educator, sharing his passion for music with students of all ages while continuing to develop his own artistic practice.',
          'Dedicated to artistic growth and cultural exchange, Suraj believes music is a powerful means of connecting people and enriching communities through performance.',
        ],
      },
    ],
  },
  zh: {
    labels: {
      eyebrow: '成员',
      title: '艺术家、教育工作者与文化项目推动者',
      summary: '了解通过演出、教学、社区项目与文化交流支持 SAIMA 的音乐家和教育工作者。',
      viewProfile: '查看介绍',
      backToAbout: '返回关于我们',
      contact: '联系',
      website: '网站',
      notFoundTitle: '未找到成员介绍',
      notFoundSummary: '该成员介绍暂未开放。',
    },
    members: [
      {
        order: 1,
        slug: 'elsa-yiyin-tian',
        href: '/members/elsa-yiyin-tian',
        name: 'Elsa Yiyin Tian',
        role: '创始人及主席',
        specialty: '古典声乐 / 音乐教育 / 文化项目策划 / 学术研究',
        image: memberImages.elsa,
        summary: '古典声乐演唱者、音乐教育者、研究者与文化项目策划者，致力于音乐、文化交流、社区参与和公益实践。',
        bio: [
          'Elsa Yiyin Tian 是古典声乐演唱者、音乐教育工作者、文化项目策划者和学术研究者。她是南澳国际音乐协会创始人及主席，并担任澳中友好协会南澳分会副主席。',
          'Elsa 曾在德国接受系统的古典声乐训练，之后在阿德莱德大学完成音乐表演与研究方向的研究生学习，并于 2019 年获得哲学硕士学位。她目前是 Griffith University Queensland Conservatorium 的博士候选人。',
          '她的研究关注中国传统戏曲、非物质文化遗产传承、儿童艺术训练和机构变迁，并结合民族志、口述历史和表演研究方法，探讨传统表演艺术如何在不断变化的教育、社会和文化环境中延续与发展。',
          '作为表演者，Elsa 长期参与古典声乐、歌剧、艺术歌曲和跨文化音乐项目。她重视作品中的历史、文化和人文维度，并持续探索如何通过叙事、视觉媒体、文学和跨学科艺术呈现连接古典音乐与社区观众。',
          'Elsa 拥有丰富的声乐教学经验，曾担任阿德莱德 St Peter’s Cathedral Choir 声乐导师。她的教学涵盖古典声乐、音乐剧、当代及流行演唱风格和舞台表演。',
          '她经常指导学生参加 South Australian Eisteddfod 等声乐与表演活动。每年，她的学生在古典声乐、音乐剧和流行演唱等不同组别中共获得超过 25 个奖项。',
          'Elsa 也是经验丰富的文化活动组织者，曾策划并执行大型音乐会、社区演出、跨文化项目和慈善活动，包括 2024 年的 Impressions of China 和 2025 年在 Elder Hall 呈现的 A Journey of Brilliance: From the Silk Road to the Renaissance。',
        ],
      },
      {
        order: 2,
        slug: 'callum-mcging',
        href: '/members/callum-mcging',
        name: 'Callum McGing',
        role: '副主席',
        specialty: '歌剧 / 声乐指导 / 中文语言教育',
        image: memberImages.callum,
        summary: '来自阿德莱德的男高音和声乐指导，活跃于歌剧、当代表演、语言教育和青少年音乐教育领域。',
        bio: [
          'Callum McGing 是来自南澳阿德莱德的男高音和声乐指导。他毕业于 Elder Conservatorium of Music，自 2018 年起长期与 State Opera South Australia 合作，参与主舞台和艺术节制作，并在学校制作 The Frog Prince 中担任标题角色。',
          'Callum 的艺术实践跨越多种语言和风格。他曾在墨尔本担任 Australian Contemporary Opera Company Rising Artist，并于 2025 年登上山东卫视春节节目。',
          '他也曾代表南澳参加 2016 年在云南昆明举行的第九届青年汉语桥比赛。',
          'Callum 致力于拓展澳大利亚歌剧形式，并通过音乐和中文语言教育，让不同背景的年轻人建立连接。',
        ],
      },
      {
        order: 3,
        slug: 'yueqi-queenie-li',
        href: '/members/yueqi-queenie-li',
        name: 'Yueqi Li',
        role: '古典吉他演奏者及教育工作者',
        specialty: '古典吉他 / 表演教学法 / 青年艺术家发展',
        email: 'yueqi1206@hotmail.com',
        website: 'https://www.yueqili-classicalguitarist.com/',
        image: memberImages.queenie,
        summary: '古典吉他演奏者和教育者，重视健康技术、音乐理解和年轻艺术家的正式舞台经验。',
        bio: [
          'Queenie 拥有 Elder Conservatorium of Music 古典表演音乐学士学位，以及表演与教学法硕士学位。她曾师从 Dr. Oliver Fartach-Naini，并早年在中国随杜薄中、Danny Yeh 等古典吉他演奏家学习。',
          '在学习期间，她获得多项学术奖学金和比赛奖项，并参加过多位国际知名吉他演奏家的大师班，因细腻的音乐感受力而受到认可。',
          '她的演出经历包括第二届和第三届韩国国际吉他艺术节、统营 Guitarissimo、2016、2018 和 2024 年 Adelaide Guitar Festival，以及多个本地音乐会系列。',
          '除演出外，Queenie 的主要专业方向是古典吉他教育。近十年来，她教授过 7 岁至 71 岁的学生，涵盖初学者到高级学习者。',
          '她的教学理念强调整体性方法，重视健康技术发展、身体结构意识和深入的音乐理解。多位 AMEB 学生取得 A 和 A+ 成绩，也有学生在 Adelaide Eisteddfod 比赛中获奖。',
          '近年来，Queenie 创立并指导 ERA (Exceptional Rising Artists) 音乐会系列，为学生拓展演出机会，并支持新兴艺术家的成长。',
        ],
      },
      {
        order: 4,
        slug: 'tina-zhao',
        href: '/members/tina-zhao',
        name: 'Tina Zhao',
        role: '委员会成员',
        specialty: '钢琴家 / 作曲家 / 音乐教育者 / 艺术行政',
        image: memberImages.tina,
        summary: '钢琴家、作曲家、教育者和艺术行政工作者，支持 SAIMA 的项目、社区活动和国际合作。',
        bio: [
          'Tina Zhao 是常驻南澳阿德莱德的钢琴家、作曲家、音乐教育工作者和艺术行政工作者。她是南澳国际音乐协会委员会成员，也是 FLY Music Academy 创始人及总监。',
          'Tina 五岁开始学习钢琴，并从小接受系统音乐训练。她曾在山东大学学习音乐，主修钢琴表演，同时学习作曲、声乐及多种中西乐器。',
          '之后，她在阿德莱德大学 Elder Conservatorium of Music 完成音乐硕士学位。',
          '作为作曲家，Tina 的原创作品多年在 OZAsia Festival 和 Adelaide Fringe 呈现。她的创作实践融合中西音乐传统，并关注跨文化合作和当代音乐。',
          'Tina 拥有超过 15 年教学经验，专攻钢琴表演、音乐理论、听觉训练和作曲。她的学生在 AMEB 考试和音乐比赛中取得优异成绩，包括 High Distinction 和 AMEB Awards。',
          '作为 SAIMA 委员会成员，Tina 积极支持协会的音乐会、教育项目、社区项目和国际合作。',
        ],
      },
      {
        order: 5,
        slug: 'yifei-chong',
        href: '/members/yifei-chong',
        name: 'Yifei Chong',
        role: '钢琴家、合作钢琴家及教师',
        specialty: '钢琴表演 / 合作钢琴 / 音乐教育',
        image: memberImages.yifei,
        summary: '优秀的钢琴家和合作钢琴家，教学方法根据每位学生的需求和音乐目标量身定制。',
        bio: [
          'Yifei Chong 是优秀的钢琴家、合作钢琴家和备受欢迎的教师。她在 Vivian Choi Milton 指导下，于 Elder Conservatorium of Music 获得钢琴表演音乐硕士学位。',
          '她还拥有中国广州星海音乐学院钢琴表演学士和硕士学位，并参加过 Brendan Kinsella、Natasha Vlassenko、Hsing-Chwen Hsin 等国际知名钢琴家的大师班。',
          'Yifei 曾获得多项奖项，包括 Recital Australia 2023 Spring Season 的 Lunch Hour Award，以及中国国家奖学金，以表彰其学术和音乐方面的卓越表现。',
          '作为合作钢琴家，Yifei 曾在 Adelaide Eisteddfod 声乐和弦乐组工作，也曾在中国星海音乐学院担任艺术指导。',
          'Yifei 致力于音乐教育，教授不同年龄段的学生。她的学生在 AMEB、ABRSM 钢琴考试、比赛和 Eisteddfod 中取得优异成绩。',
        ],
      },
      {
        order: 6,
        slug: 'baoshan-wu',
        href: '/members/baoshan-wu',
        name: 'Baoshan Wu',
        role: '器乐教师',
        specialty: '长笛 / 钢琴 / 重奏指导',
        email: 'Happyflutesa@gmail.com',
        image: memberImages.baoshan,
        summary: '专业器乐教师，为不同年龄段学生、个人学习者和长笛重奏提供长笛与钢琴教学。',
        bio: [
          'Baoshan Wu 是专业器乐教师，也是一位资深音乐教育工作者。她拥有音乐表演和音乐教育两个硕士学位，毕业于瑞士苏黎世艺术大学。',
          'Baoshan 为不同年龄段学生、个人学习者和长笛重奏提供高质量的长笛与钢琴教学。',
          '她曾担任南澳长笛协会主席，也曾担任 Adelaide Eisteddfod 评委。',
          'Baoshan 始终以热情投入教学，并鼓励学生享受音乐表演。',
          '她可使用英语、中文和德语教学。她的音乐工作室位于 Rostrevor。',
          '联系方式：0413036988（教学期间不便接听，请发短信）/ Happyflutesa@gmail.com。',
        ],
      },
      {
        order: 7,
        slug: 'sonya-chong',
        href: '/members/sonya-chong',
        name: 'Sonya Chong',
        role: '委员会成员',
        specialty: '歌唱 / 多元文化表演 / 文化交流',
        image: memberImages.sonya,
        summary: '俄罗斯族华人歌手，以温暖而具有辨识度的声音，以及推动中澳文化交流的贡献受到认可。',
        bio: [
          'Sonya Chong 是出生于中国新疆伊犁的俄罗斯族华人歌手。她以温暖而独特的演唱风格受到观众喜爱，并被称为“西域邓丽君”。',
          '她是南澳国际音乐协会委员会成员，同时也是新疆音乐家协会、新疆流行音乐学会会员，并担任伊犁州朗诵协会副主席。',
          'Sonya 曾登上多个中国重要电视节目，包括 CCTV-3《非常 6+1》《黄金 100 秒》和《幸福账单》，也曾作为嘉宾参加山西卫视《歌从黄河来》。',
          '她曾在中国农民歌会比赛中获得前三名，并获“全国最美民族声音奖”。',
          '在国际舞台上，Sonya 曾在澳大利亚举办四场个人演唱会，并在上海举办个人演唱会。她也参与过悉尼首届国际华人春晚和墨尔本华星春晚。',
          '因其在文化交流方面的贡献，Sonya 获授“中澳文化大使”荣誉称号。',
          '作为具有鲜明多元文化特色的表演者，Sonya 深受不同文化和族群背景观众的喜爱。她能够使用多种语言演唱，并录制和演唱了近百首原创歌曲。',
        ],
      },
      {
        order: 8,
        slug: 'suraj-landge',
        href: '/members/suraj-landge',
        name: 'Suraj Landge',
        role: '爵士吉他手、歌手及教育工作者',
        specialty: '爵士吉他 / 声乐 / 当代音乐',
        image: memberImages.suraj,
        summary: '来自印度孟买、现居阿德莱德的爵士吉他手和歌手，艺术实践连接表演、即兴与音乐教育。',
        bio: [
          'Suraj Landge 是现居南澳阿德莱德的爵士吉他手和歌手，来自印度孟买。他拥有阿德莱德大学 Elder Conservatorium of Music 表演与教学法音乐硕士学位。',
          '作为活跃的表演者，Suraj 专攻爵士和当代音乐，结合扎实技巧、细腻音乐感和富有表现力的舞台风格。',
          '他的艺术兴趣涵盖现场表演、即兴、合作以及多元音乐传统的探索。',
          '除表演之外，Suraj 也是经验丰富的音乐教育工作者，向不同年龄段学生分享他对音乐的热情，同时持续发展自己的艺术实践。',
          'Suraj 致力于艺术成长与文化交流，并相信音乐能够通过表演连接人与人、丰富社区生活。',
        ],
      },
    ],
  },
}
