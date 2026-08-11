import { siteImages } from './shared'
import type { Localized } from './types'

type GalleryContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  groups: Array<{
    title: string
    summary: string
    image: string
  }>
  stats: Array<{
    title: string
    summary: string
  }>
  detailsAction: string
}

export const galleryContent: Localized<GalleryContent> = {
  en: {
    hero: {
      eyebrow: 'Gallery / Media',
      title: 'Gallery & Videos',
      paragraphs: [
        'This page presents selected photo and video highlights from South Australian International Musicians Association’s concerts, student showcases, charity projects, community performances, and cultural activities.',
        'For visitors who would like to quickly see our work, this page offers a visual overview of our artistic quality, community engagement, youth development, and multicultural projects.',
        'More detailed information about each event can be found on the relevant project pages.',
      ],
    },
    groups: [
      {
        title: 'Featured Videos',
        summary: 'Selected performances by outstanding young vocalists and instrumentalists.',
        image: siteImages.youthPiano,
      },
      {
        title: 'Concert Highlights',
        summary: 'Selected moments from our multicultural concerts and major public performances.',
        image: siteImages.performersElderHall,
      },
      {
        title: 'Charity & Community Moments',
        summary: 'Selected photos from charity concerts, aged care performances, and community outreach activities.',
        image: siteImages.galleryPerformance,
      },
      {
        title: 'Young Artist Showcase',
        summary:
          'Selected videos and photos of young performers across vocal music, musical theatre, piano, violin, flute, pipa, and other instruments.',
        image: siteImages.mandateLesson,
      },
      {
        title: 'Behind the Scenes',
        summary: 'Rehearsals, preparation, families, volunteers, teachers, and moments behind the stage.',
        image: siteImages.choirHall,
      },
    ],
    stats: [
      { title: 'Concerts', summary: 'Public performances and seasonal showcases' },
      { title: 'Workshops', summary: 'Teaching rooms, rehearsals, and member-led sessions' },
      { title: 'Community', summary: 'Families, collaborators, and cultural exchange' },
    ],
    detailsAction: 'View media categories',
  },
  zh: {
    hero: {
      eyebrow: '照片与媒体',
      title: '照片与视频',
      paragraphs: [
        '本页面展示南澳国际音乐协会在音乐会、优秀学员展演、慈善项目、社区公益演出及文化活动中的精选照片与视频。',
        '对于希望快速了解协会工作的人，本页面提供一个直观入口，展示我们的艺术质量、社区参与、青少年培养及多元文化项目。',
        '每个活动的详细介绍，可在相应项目页面中查看。',
      ],
    },
    groups: [
      {
        title: '精选视频',
        summary: '优秀年轻歌者和器乐演奏者的精选表演。',
        image: siteImages.youthPiano,
      },
      {
        title: '音乐会精彩瞬间',
        summary: '多元文化音乐会和重要公共演出的精选瞬间。',
        image: siteImages.performersElderHall,
      },
      {
        title: '慈善与社区瞬间',
        summary: '慈善音乐会、养老院公益演出和社区活动中的精选照片。',
        image: siteImages.galleryPerformance,
      },
      {
        title: '优秀青年艺术学员展演',
        summary: '涵盖声乐、音乐剧、钢琴、小提琴、长笛、琵琶及其他器乐方向的年轻表演者照片与视频。',
        image: siteImages.mandateLesson,
      },
      {
        title: '幕后与排练花絮',
        summary: '排练、准备、家庭、志愿者、教师和舞台背后的瞬间。',
        image: siteImages.choirHall,
      },
    ],
    stats: [
      { title: '音乐会', summary: '公共演出与季节性展演' },
      { title: '工作坊', summary: '教学空间、排练与会员主导课程' },
      { title: '社区', summary: '家庭、合作伙伴与文化交流' },
    ],
    detailsAction: '查看媒体分类',
  },
} 
