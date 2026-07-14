import type { EventArticle, Localized } from './types'

type EventsContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  upcoming: {
    title: string
    paragraphs: string[]
    events: EventArticle[]
  }
  past: {
    title: string
    paragraphs: string[]
    sections: Array<{
      title: string
      paragraphs: string[]
      events?: EventArticle[]
    }>
  }
  labels: {
    upcoming: string
    past: string
    highlights: string
    enquire: string
    details: string
  }
}

export const eventsContent: Localized<EventsContent> = {
  en: {
    hero: {
      eyebrow: 'Events',
      title: 'Concerts, workshops, welcomes, and member showcases.',
      paragraphs: [
        'South Australian International Musicians Association is currently developing new music, cultural, educational, and charity-based projects for the South Australian community.',
        'Our past and upcoming events reflect our commitment to multicultural exchange, music education, community service, youth performance, artistic participation, and charitable giving.',
      ],
    },
    upcoming: {
      title: 'Upcoming Events',
      paragraphs: [
        'South Australian International Musicians Association is currently developing new music, cultural, educational, and charity-based projects for the South Australian community.',
        'Gather around music that travels across cultures.',
      ],
      events: [
        {
          title: 'A Dream for Every Child',
          subtitle:
            'Elsa and Her Students: A Charity Musical Theatre Concert Supporting Children with Cancer and Their Families',
          date: '16 Oct 2026',
          location: 'To be announced',
          paragraphs: [
            'South Australian International Musicians Association is preparing its next charity concert, A Dream for Every Child, planned for 16 October 2026. This musical theatre concert will be led by Elsa Tian and performed by her students, raising funds for children with cancer and their families.',
            'This concert is built around the voices, stories, and dreams of children. Through musical theatre songs from beloved stage and screen works, young performers will use music to express courage, imagination, love, hope, and resilience.',
            'The program will include songs from well-known musicals and films such as The Lion King, Matilda, The Little Mermaid, Frozen, The Phantom of the Opera, Les Misérables, The Greatest Showman, and Miss Saigon.',
            'At the heart of this concert is a simple belief: every child deserves the chance to dream, to be loved, and to be supported.',
            'Further details, including venue, ticketing, sponsorship opportunities, and donation information, will be announced soon.',
          ],
        },
        {
          title: 'Voices Beyond Borders',
          subtitle: 'An Anti-War Film Music Concert for Peace, Memory and Human Dignity',
          date: 'To be announced',
          location: 'To be announced',
          paragraphs: [
            'South Australian International Musicians Association is preparing Voices Beyond Borders, an anti-war film music concert exploring peace, memory, human dignity, and the human cost of conflict through live music performance.',
            'This concert uses film music from different cultural and historical contexts to create a shared space for listening, remembering, and reflection. Rather than focusing on military history, political positions, or national narratives, the project places human lives, emotional memory, and the longing for peace at the centre.',
            'The curatorial principles of the concert are: not celebration, but remembrance; not victory, but reflection; not nations, but human lives.',
            'Presented as a chamber concert featuring solo and small ensemble works, Voices Beyond Borders is designed for the general public, students, cultural communities, and audiences interested in music, film, peace, memory, and cross-cultural understanding.',
          ],
          highlights: [
            'An anti-war film music concert centred on peace, memory, and human dignity.',
            'Uses film music and classical repertoire to engage broad audiences.',
            'Focuses on ordinary people affected by war and conflict, including children, families, civilians, artists, and survivors.',
            'Avoids glorifying war or presenting a single national narrative.',
            'Creates a reflective musical space for listening, empathy, and cross-cultural understanding.',
            'Designed as a chamber concert featuring solo and small ensemble works.',
            'Connects music, film, history, education, public memory, and peace-building.',
          ],
        },
      ],
    },
    past: {
      title: 'Past Events',
      paragraphs: [
        'South Australian International Musicians Association has organised and supported a range of music, cultural, charitable, and community-based activities in South Australia. Our past events reflect our commitment to multicultural exchange, music education, community service, youth performance, and artistic participation.',
      ],
      sections: [
        {
          title: 'Multicultural Music Concerts',
          paragraphs: [
            'Our multicultural music concerts celebrate the richness of different musical traditions and cultural expressions. These events bring together performers, students, families, artists, and audiences from diverse backgrounds, using music as a bridge for cultural understanding and community connection.',
          ],
          events: [
            {
              title: 'Impressions of China: A Musical Journey Through History and Diversity',
              date: '30 Sep 2024',
              location: 'Ukaria Cultural Centre',
              paragraphs: [
                'Impressions of China was a multicultural concert held on 30 September 2024 at Ukaria Cultural Centre. The concert was organised by Yiyin Elsa Tian, President of South Australian International Musicians Association and a PhD candidate at Griffith University Queensland Conservatorium.',
                'The concert was designed as a musical journey through Chinese history, culture, ethnic diversity, and landscape. With the themes of “Glorious History and Splendid Culture” and “Colorful Ethnicities and Magnificent Landscapes,” the program brought together Chinese and Western musical elements and presented a rich cultural experience for South Australian audiences.',
                'Performers from China, Australia, Italy, and Malaysia participated in the concert, presenting a program that included traditional Chinese costume, poetry recitation, tea ceremony, classical dance, guqin, guzheng, pipa, piano, flute, violin, vocal performance, and ensemble music.',
                'The concert attracted distinguished guests from political, educational, artistic, and business communities. All 200 tickets were sold out, and the audience included guests from Australia, France, Italy, China, Brazil, and the United Kingdom.',
                'Impressions of China was more than a concert. It was a cultural exchange event that used music, performance, and storytelling to build understanding between communities and to celebrate the richness of multicultural life in South Australia.',
              ],
              highlights: [
                'Sold-out concert with 200 tickets sold.',
                'Held at Ukaria Cultural Centre, one of South Australia’s distinctive cultural venues.',
                'Performers from China, Australia, Italy, and Malaysia.',
                'Audience members from Australia, France, Italy, China, Brazil, and the United Kingdom.',
                'Program included Hanfu, poetry recitation, tea ceremony, classical dance, guqin, guzheng, pipa, piano, flute, violin, vocal performance, and ensemble music.',
                'Attended by representatives from multicultural, diplomatic, educational, artistic, business, and community sectors.',
              ],
            },
            {
              title: 'A Journey of Brilliance: From the Silk Road to the Renaissance',
              date: '13 Apr 2025',
              location: 'Elder Hall, Adelaide',
              paragraphs: [
                'A Journey of Brilliance: From the Silk Road to the Renaissance was a multicultural concert presented at Elder Hall, Adelaide, on 13 April 2025. Organised by South Australian International Musicians Association, the concert was designed as an immersive musical journey across history, geography, and culture.',
                'The concert followed the spirit of the ancient Silk Road, beginning from the eastern city of Chang’an and travelling through Dunhuang, the Taklamakan Desert, Kashgar, Samarkand, Constantinople, and into the cultural landscapes of Europe.',
                'The concert brought together young performers, professional musicians, dancers, and community artists. It combined Eastern and Western musical traditions, presenting works inspired by Chinese history, Central Asian cultural routes, European poetry, courtly music, and the Italian Renaissance.',
                'Young performers played an important role in the concert, sharing the stage with musicians and artists from conservatorium and professional backgrounds.',
                'A Journey of Brilliance was more than a concert. It was a cross-cultural artistic project that invited audiences to experience the Silk Road as a living symbol of cultural exchange, artistic connection, and shared human creativity.',
              ],
              highlights: [
                'Presented at Elder Hall, Adelaide, on 13 April 2025.',
                'Designed as an immersive musical journey from the Silk Road to the European Renaissance.',
                'Explored cultural routes including Chang’an, Dunhuang, the Taklamakan Desert, Kashgar, Samarkand, Constantinople, and Europe.',
                'Brought together young performers, professional musicians, dancers, and community artists.',
                'Combined Eastern and Western musical traditions through music, dance, storytelling, and cultural imagery.',
                'Supported by community partners and cultural organisations.',
              ],
            },
          ],
        },
        {
          title: 'Charity Fundraising Concerts',
          paragraphs: [
            'Our charity fundraising concerts use music to support meaningful causes. Through live performance, community participation, and artistic collaboration, these concerts raise awareness and funds for individuals, families, or organisations in need.',
          ],
        },
        {
          title: 'Community Charity Activities',
          paragraphs: [
            'Beyond formal concerts, our association also supports community-based charitable activities. These may include performances, volunteer participation, cultural activities, and collaborative projects that contribute to community wellbeing and social connection.',
          ],
          events: [
            {
              title: 'Panda and Koala Children’s Charity Concert',
              date: '2021',
              location: 'Adelaide',
              paragraphs: [
                'In 2021, the Panda and Koala Children’s Charity Concert was held to raise funds for the giant pandas at Adelaide Zoo. The name of the event reflected its cultural meaning: the panda symbolised China, while the koala symbolised Australia.',
                'The event combined children’s musical performances with a handmade craft charity sale, encouraging young participants to contribute to wildlife protection through music, creativity, and community action.',
                'A special feature of this event was that all performers, including the hosts, were children.',
                'A total of $1,575 was raised through the concert and children’s handmade craft sale. The funds were donated to support the giant pandas at Adelaide Zoo and were presented with the assistance of Ms Lyn Write, former President of the Australia China Friendship Society.',
              ],
            },
            {
              title: 'Aged Care Community Performance',
              date: '20 Apr 2026',
              location: 'Southern Cross Care Carmelite Health & Fitness Centre',
              paragraphs: [
                'On 20 April 2026, South Australian International Musicians Association presented an aged care community performance at Southern Cross Care Carmelite Health & Fitness Centre.',
                'This performance brought live music into an aged care community, creating a warm and meaningful space for elderly residents, young performers, families, and community members to connect through music.',
                'For the young performers, this was also a powerful experience. They felt respected, seen, and valued by the elderly audience.',
              ],
              highlights: [
                'Brought live music to elderly residents in an aged care setting.',
                'Created meaningful intergenerational connection between young performers and elderly audience members.',
                'Encouraged children to understand music as an act of care, kindness, service, and human connection.',
              ],
            },
            {
              title: 'Aged Care Community Performance at Helping Hand Lightsview',
              date: '5 Jul 2026',
              location: 'Helping Hand Lightsview',
              paragraphs: [
                'On 5 July 2026, South Australian International Musicians Association presented an aged care community performance at Helping Hand Lightsview.',
                'Following our earlier performance at Southern Cross Care Carmelite Health & Fitness Centre, this event continued our commitment to bringing live music into aged care communities and creating meaningful connections between young performers and elderly residents.',
                'The program included piano, violin, and vocal performances, offering residents a varied and engaging musical experience.',
                'This activity forms part of our ongoing community charity work, using music to bring comfort, dignity, and shared moments of beauty to people in the wider community.',
              ],
            },
          ],
        },
      ],
    },
    labels: {
      upcoming: 'Upcoming',
      past: 'Past',
      highlights: 'Event Highlights',
      enquire: 'Enquire',
      details: 'View event details',
    },
  },
  zh: {
    hero: {
      eyebrow: '活动',
      title: '即将举办与已举办活动。',
      paragraphs: [
        '南澳国际音乐协会正在为南澳社区筹备新的音乐、文化、教育及慈善项目。',
        '我们的活动体现了协会对多元文化交流、音乐教育、社区服务、青少年表演、艺术参与和公益慈善的持续承诺。',
      ],
    },
    upcoming: {
      title: '即将举办活动',
      paragraphs: [
        '南澳国际音乐协会正在为南澳社区筹备新的音乐、文化、教育及慈善项目。',
        '我们的即将举办活动将继续体现协会对音乐教育、青少年表演机会、多元文化交流、社区参与和公益慈善的承诺。',
      ],
      events: [
        {
          title: '《每个孩子都应有梦想》',
          subtitle: 'Elsa 和她的孩子们：支持儿童癌症家庭慈善音乐剧音乐会',
          date: '2026年10月16日',
          location: '待公布',
          paragraphs: [
            '南澳国际音乐协会正在筹备下一场慈善音乐会《每个孩子都应有梦想》，计划于 2026年10月16日 举办。这是一场由 Elsa Tian 带领学生共同呈现的音乐剧慈善音乐会，旨在为患癌儿童及其家庭筹集善款。',
            '本场音乐会围绕孩子们的声音、故事与梦想展开。年轻表演者将通过大家熟悉和喜爱的音乐剧及电影歌曲，表达勇气、想象、爱、希望与坚韧。',
            '节目将包括来自《狮子王》《Matilda》《小美人鱼》《冰雪奇缘》《歌剧魅影》《悲惨世界》《马戏之王》和《西贡小姐》等经典音乐剧与电影作品中的歌曲。',
            '本场音乐会的核心信念很简单：每一个孩子都应该拥有梦想、被爱和被支持的机会。',
            '具体场地、票务、赞助机会及捐款信息将陆续公布。',
          ],
        },
        {
          title: '《跨越国界的声音》',
          subtitle: '一场关于和平、记忆与人类尊严的反战电影音乐会',
          date: '待公布',
          location: '待公布',
          paragraphs: [
            '南澳国际音乐协会正在筹备《跨越国界的声音》。这是一场以电影音乐现场演奏为核心的反战音乐会，旨在通过音乐探索和平、记忆、人类尊严，以及战争与冲突对普通生命造成的代价。',
            '本场音乐会通过来自不同文化与历史背景的电影音乐，为观众创造一个共同聆听、记忆与反思的空间。它不以军事历史、政治立场或国家叙事为中心，而是将人的生命经验、情感记忆与对和平的渴望放在核心位置。',
            '本场音乐会的策展原则是：不是庆祝，而是纪念；不是胜利，而是反思；不是国家叙事，而是人的生命经验。',
            '本项目将以室内音乐会形式呈现，以独奏与小型重奏为主，面向普通公众、青年学生、文化社群，以及关注音乐、电影、和平、记忆与跨文化理解的观众。',
          ],
          highlights: [
            '一场以和平、记忆与人类尊严为核心的反战电影音乐会。',
            '通过电影音乐与古典音乐曲目连接更广泛观众。',
            '关注在战争与冲突中受到影响的普通人，包括儿童、家庭、平民、艺术家与幸存者。',
            '避免美化战争，也不呈现单一国家叙事。',
            '创造一个关于聆听、同理心与跨文化理解的音乐反思空间。',
            '以室内音乐会形式呈现，包含独奏与小型重奏作品。',
            '连接音乐、电影、历史、教育、公共记忆与和平理念。',
          ],
        },
      ],
    },
    past: {
      title: '已举办活动',
      paragraphs: [
        '南澳国际音乐协会曾在南澳大利亚组织并支持多项音乐、文化、慈善及社区活动。这些已举办活动体现了我们对多元文化交流、音乐教育、社区服务、青少年表演和艺术参与的持续承诺。',
      ],
      sections: [
        {
          title: '过往多元文化音乐会',
          paragraphs: [
            '我们的多元文化音乐会旨在展示不同音乐传统与文化表达的丰富性。这些活动汇聚来自不同背景的表演者、学生、家庭、艺术家和观众，以音乐作为促进文化理解与社区连接的桥梁。',
          ],
          events: [
            {
              title: '《中国印象：穿越历史与多元文化的音乐之旅》',
              date: '2024年9月30日',
              location: 'Ukaria Cultural Centre',
              paragraphs: [
                '《中国印象》是一场于2024年9月30日在 Ukaria Cultural Centre 举办的多元文化音乐会。本场音乐会由南澳国际音乐协会会长、Griffith University Queensland Conservatorium 博士候选人 Elsa Tian 策划并组织。',
                '本场音乐会以音乐作为线索，带领观众穿越中国历史、文化、民族多样性与自然景观。音乐会分为“辉煌历史与灿烂文化”和“多彩民族与壮丽山河”两个主题部分。',
                '来自中国、澳大利亚、意大利和马来西亚的表演者共同参与演出。节目内容包括中国传统服饰展示、诗歌朗诵、茶艺、古典舞、古琴、古筝、琵琶、钢琴、长笛、小提琴、声乐及合奏作品。',
                '全部200张门票售罄，观众来自澳大利亚、法国、意大利、中国、巴西和英国等不同国家。',
                '《中国印象》不仅是一场音乐会，也是一场文化交流活动。',
              ],
              highlights: [
                '200张门票全部售罄。',
                '活动于南澳特色文化场地 Ukaria Cultural Centre 举办。',
                '表演者来自中国、澳大利亚、意大利和马来西亚。',
                '观众来自澳大利亚、法国、意大利、中国、巴西和英国等不同国家。',
                '节目涵盖汉服、诗歌朗诵、茶艺、古典舞、古琴、古筝、琵琶、钢琴、长笛、小提琴、声乐及合奏。',
              ],
            },
            {
              title: '《辉煌之旅：从丝绸之路到文艺复兴》',
              date: '2025年4月13日',
              location: 'Elder Hall, Adelaide',
              paragraphs: [
                '《辉煌之旅：从丝绸之路到文艺复兴》是一场于2025年4月13日在阿德莱德 Elder Hall 举办的多元文化音乐会。本场音乐会由南澳国际音乐家协会主办，以沉浸式音乐旅程的形式，带领观众穿越历史、地域与文化。',
                '音乐会以古代丝绸之路为灵感，从东方古都长安出发，途经敦煌、塔克拉玛干沙漠、喀什、撒马尔罕、君士坦丁堡，并最终抵达欧洲文明与文艺复兴的文化景观。',
                '本场音乐会汇聚了年轻表演者、专业音乐家、舞蹈家及社区艺术工作者，融合东方与西方音乐传统。',
                '年轻表演者在本场音乐会中扮演了重要角色。他们与来自音乐学院及专业艺术团体背景的音乐家和舞蹈家同台演出。',
                '《辉煌之旅》不仅是一场音乐会，也是一项跨文化艺术项目。',
              ],
              highlights: [
                '于2025年4月13日在阿德莱德 Elder Hall 举办。',
                '以“从丝绸之路到欧洲文艺复兴”为主题，打造沉浸式音乐旅程。',
                '内容涵盖长安、敦煌、塔克拉玛干沙漠、喀什、撒马尔罕、君士坦丁堡及欧洲等文化路线。',
                '汇聚年轻表演者、专业音乐家、舞蹈家及社区艺术工作者。',
                '通过音乐、舞蹈、叙事与文化意象融合东方与西方音乐传统。',
              ],
            },
          ],
        },
        {
          title: '慈善筹款音乐会',
          paragraphs: [
            '我们的慈善筹款音乐会通过音乐支持有意义的公益目标。通过现场演出、社区参与和艺术合作，这些音乐会为需要帮助的个人、家庭或组织筹集善款，并提升公众关注。',
          ],
        },
        {
          title: '社区慈善活动',
          paragraphs: [
            '除了正式音乐会之外，本协会也支持社区层面的慈善活动。这些活动包括演出、志愿参与、文化活动及合作项目，旨在促进社区福祉与社会连接。',
          ],
          events: [
            {
              title: '《熊猫与考拉》儿童慈善音乐会',
              date: '2021年',
              location: '阿德莱德',
              paragraphs: [
                '2021年，《熊猫与考拉》儿童慈善音乐会举办，旨在为阿德莱德动物园的大熊猫筹集善款。本次活动名称具有特别的文化意义：熊猫象征中国，考拉象征澳大利亚。',
                '本次活动结合儿童音乐表演与儿童手工艺品义卖，鼓励孩子们通过音乐、创造力和社区行动参与野生动物保护。',
                '本次活动的一个重要特色是，所有演员，包括主持人，全部由孩子担任。',
                '本次音乐会及儿童手工艺品义卖共筹得 1,575澳元。善款用于支持阿德莱德动物园的大熊猫项目。',
              ],
            },
            {
              title: '养老院公益演出',
              date: '2026年4月20日',
              location: 'Southern Cross Care Carmelite Health & Fitness Centre',
              paragraphs: [
                '2026年4月20日，南澳国际音乐协会在 Southern Cross Care Carmelite Health & Fitness Centre 举办了一场养老院公益演出。',
                '本次演出将现场音乐带入养老社区，为长者、年轻表演者、家庭和社区成员创造了一个温暖而有意义的音乐连接空间。',
                '对于年轻表演者而言，这也是一次非常重要的经历。他们感受到自己被尊重、被看见、被珍视。',
              ],
              highlights: [
                '将现场音乐带给养老社区的长者。',
                '在年轻表演者与长者观众之间建立了有意义的代际连接。',
                '鼓励孩子们理解音乐不仅是表演，也是一种关怀、善意、服务与人与人之间的连接。',
              ],
            },
            {
              title: 'Helping Hand Lightsview 养老院公益演出',
              date: '2026年7月5日',
              location: 'Helping Hand Lightsview',
              paragraphs: [
                '2026年7月5日，南澳国际音乐协会在 Helping Hand Lightsview 举办了一场养老院公益演出。',
                '继 Southern Cross Care Carmelite Health & Fitness Centre 养老院公益演出之后，本次活动延续了我们将现场音乐带入养老社区、在年轻表演者与长者居民之间建立有意义连接的承诺。',
                '本次节目包括钢琴、小提琴和声乐表演，为养老院居民带来丰富而多样的现场音乐体验。',
                '本次活动是协会持续开展的社区慈善工作之一。',
              ],
            },
          ],
        },
      ],
    },
    labels: {
      upcoming: '即将举办',
      past: '已举办',
      highlights: '活动亮点',
      enquire: '咨询',
      details: '查看活动详情',
    },
  },
} 
