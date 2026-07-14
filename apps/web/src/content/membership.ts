import type { Localized } from './types'

type MembershipContent = {
  hero: {
    eyebrow: string
    title: string
    paragraphs: string[]
    signedOutAction: string
  }
  pathsHeading: {
    eyebrow: string
    title: string
  }
  paths: Array<{
    title: string
    summary: string
    action: string
    to: string
  }>
  expression: {
    title: string
    fields: string[]
    interestsTitle: string
    interests: string[]
    skillsTitle: string
    skills: string[]
    consentTitle: string
    consent: string
    pendingValue: string
  }
  sponsorship: {
    eyebrow: string
    title: string
    itemLabel: string
    paragraphs: string[]
    items: string[]
  }
  detailsAction: string
  application: {
    eyebrow: string
    title: string
    alreadyMember: string
    statusPrefix: string
    submitPrompt: string
  }
  applicationForm: {
    fullName: string
    fullNamePlaceholder: string
    instruments: string
    instrumentsPlaceholder: string
    experience: string
    motivation: string
    submit: string
    signInRequired: string
    completeRequired: string
    submitted: string
    failed: string
  }
}

export const membershipContent: Localized<MembershipContent> = {
  en: {
    hero: {
      eyebrow: 'Join SAIMA',
      title: 'Join Us',
      paragraphs: [
        'South Australian International Musicians Association welcomes people who share our passion for music, education, cultural exchange, charity, and community engagement.',
        'Whether you are a musician, teacher, student, parent, volunteer, sponsor, community supporter, or arts enthusiast, there are many ways to become involved in our association.',
        'By joining us, you can support concerts, student showcases, charity projects, community performances, multicultural music events, workshops, and youth arts opportunities across South Australia.',
      ],
      signedOutAction: 'Apply after sign-in',
    },
    pathsHeading: {
      eyebrow: 'Ways to Get Involved',
      title: 'Choose the path that fits your practice.',
    },
    paths: [
      {
        title: 'Member',
        summary: 'Join our association as a member and support our ongoing music, education, cultural, and community projects.',
        action: 'Start membership',
        to: '/membership',
      },
      {
        title: 'Volunteer',
        summary:
          'Assist with concerts, front-of-house, event preparation, photography, translation, fundraising, promotion, community outreach, and backstage support.',
        action: 'Volunteer',
        to: '/membership',
      },
      {
        title: 'Perform',
        summary: 'Musicians, singers, instrumentalists, dancers, and young performers may register their interest in future concerts and community events.',
        action: 'Register interest',
        to: '/membership',
      },
      {
        title: 'Partner',
        summary: 'Schools, venues, community groups, businesses, cultural organisations, and charities are welcome to contact us for collaboration.',
        action: 'Discuss partnership',
        to: '/contact',
      },
    ],
    expression: {
      title: 'Membership / Volunteer Expression of Interest Form',
      fields: ['Full Name', 'Email Address', 'Phone Number', 'Suburb / Area', 'Message'],
      interestsTitle: 'I am interested in:',
      interests: [
        'Becoming a member',
        'Volunteering',
        'Performing',
        'Parent-Child Choir',
        'Sponsorship / donation',
        'Community project collaboration',
        'Student showcase',
        'Workshop / masterclass',
        'General support',
      ],
      skillsTitle: 'Your background / skills',
      skills: [
        'Musician / performer',
        'Music teacher',
        'Student',
        'Parent',
        'Photographer / videographer',
        'Event support',
        'Translation / interpretation',
        'Marketing / social media',
        'Fundraising',
        'Administration',
        'Community worker',
        'Other',
      ],
      consentTitle: 'Consent',
      consent:
        'South Australian International Musicians Association to contact me regarding membership, volunteering, events, and related opportunities.',
      pendingValue: 'To be completed',
    },
    sponsorship: {
      eyebrow: 'Sponsorship',
      title: 'Support Us / Sponsorship',
      itemLabel: 'Sponsors may support',
      paragraphs: [
        'We welcome sponsorship for individual events, annual programs, charity concerts, student showcases, multicultural music projects, community performances, and youth arts initiatives.',
        'Depending on the nature of the sponsorship, we may acknowledge sponsors through event programs, website recognition, social media posts, signage, verbal acknowledgements, and other agreed promotional opportunities.',
        'We are happy to discuss sponsorship packages that align with your business, community values, and areas of interest.',
      ],
      items: [
        'A specific concert or event.',
        'A charity fundraising project.',
        'A student showcase or youth performance program.',
        'An aged care or community outreach performance.',
        'A multicultural music project.',
        'The Parent-Child Choir Program.',
        'Photography, videography, printing, venue hire, or event production costs.',
      ],
    },
    detailsAction: 'Read membership and sponsorship details',
    application: {
      eyebrow: 'Application',
      title: 'Membership application',
      alreadyMember: 'Your account already has SAIMA member access.',
      statusPrefix: 'Your latest application status is',
      submitPrompt: 'Submit your application for admin review.',
    },
    applicationForm: {
      fullName: 'Full name',
      fullNamePlaceholder: 'Your full name',
      instruments: 'Instruments',
      instrumentsPlaceholder: 'Piano, violin, voice',
      experience: 'Experience',
      motivation: 'Why join SAIMA?',
      submit: 'Submit application',
      signInRequired: 'Sign in before submitting a membership application.',
      completeRequired: 'Complete all application fields before submitting.',
      submitted: 'Application submitted for admin review.',
      failed: 'Application submission failed.',
    },
  },
  zh: {
    hero: {
      eyebrow: '加入 SAIMA',
      title: '加入我们',
      paragraphs: [
        '南澳国际音乐协会欢迎热爱音乐、教育、文化交流、公益慈善和社区参与的人士加入我们。',
        '无论您是音乐家、教师、学生、家长、志愿者、赞助者、社区支持者，还是艺术爱好者，都可以通过不同方式参与协会的发展。',
        '加入我们，您将有机会支持南澳的音乐会、学生展演、慈善项目、社区公益演出、多元文化音乐活动、工作坊及青少年艺术机会。',
      ],
      signedOutAction: '登录后申请',
    },
    pathsHeading: {
      eyebrow: '参与方式',
      title: '选择适合您的参与方式。',
    },
    paths: [
      {
        title: '成为会员',
        summary: '加入协会成为会员，支持我们的音乐、教育、文化和社区项目持续发展。',
        action: '开始申请会员',
        to: '/membership',
      },
      {
        title: '成为志愿者',
        summary: '协助音乐会、前台接待、活动准备、摄影、翻译、筹款、宣传、社区联络及后台支持等工作。',
        action: '成为志愿者',
        to: '/membership',
      },
      {
        title: '参与演出',
        summary: '音乐家、歌者、器乐演奏者、舞者及年轻表演者可以登记意向，参与未来音乐会及社区活动。',
        action: '登记演出意向',
        to: '/membership',
      },
      {
        title: '合作伙伴',
        summary: '学校、演出场地、社区团体、企业、文化组织及慈善机构都欢迎与我们联系合作。',
        action: '洽谈合作',
        to: '/contact',
      },
    ],
    expression: {
      title: '会员 / 志愿者意向登记表',
      fields: ['姓名', '邮箱', '电话', '所在区域', '留言'],
      interestsTitle: '我希望参与：',
      interests: [
        '成为会员',
        '成为志愿者',
        '参与演出',
        '亲子合唱团',
        '赞助 / 捐款',
        '社区项目合作',
        '学生展演',
        '工作坊 / 大师班',
        '一般支持',
      ],
      skillsTitle: '您的背景 / 技能',
      skills: [
        '音乐家 / 表演者',
        '音乐教师',
        '学生',
        '家长',
        '摄影 / 摄像',
        '活动支持',
        '翻译 / 口译',
        '宣传 / 社交媒体',
        '筹款',
        '行政',
        '社区工作者',
        '其他',
      ],
      consentTitle: '同意声明',
      consent: '我同意南澳国际音乐协会就会员、志愿服务、活动及相关机会与我联系。',
      pendingValue: '待填写',
    },
    sponsorship: {
      eyebrow: '赞助合作',
      title: '支持我们 / 赞助合作',
      itemLabel: '可支持',
      paragraphs: [
        '我们欢迎对单场活动、年度项目、慈善音乐会、学生展演、多元文化音乐项目、社区公益演出及青少年艺术项目提供赞助支持。',
        '根据赞助形式，我们可以通过活动节目单、协会网站、社交媒体、现场标识、口头鸣谢及其他双方同意的方式，对赞助方表示感谢和宣传。',
        '我们欢迎与赞助方进一步沟通，根据企业形象、社区价值和关注方向，设计合适的赞助合作方案。',
      ],
      items: [
        '特定音乐会或活动。',
        '慈善筹款项目。',
        '学生展演或青少年表演项目。',
        '养老院或社区公益演出。',
        '多元文化音乐项目。',
        '亲子合唱团项目。',
        '摄影、摄像、印刷、场地租赁或活动制作成本。',
      ],
    },
    application: {
      eyebrow: '申请',
      title: '会员申请',
      alreadyMember: '您的账号已经拥有 SAIMA 会员权限。',
      statusPrefix: '您最近的申请状态是',
      submitPrompt: '提交申请后将由管理员审核。',
    },
    applicationForm: {
      fullName: '姓名',
      fullNamePlaceholder: '您的姓名',
      instruments: '乐器 / 专业方向',
      instrumentsPlaceholder: '钢琴、小提琴、声乐',
      experience: '经验',
      motivation: '为什么想加入 SAIMA？',
      submit: '提交申请',
      signInRequired: '请先登录再提交会员申请。',
      completeRequired: '请完整填写所有申请字段后再提交。',
      submitted: '申请已提交，等待管理员审核。',
      failed: '申请提交失败。',
    },
    detailsAction: '阅读会员与赞助详情',
  },
} 
