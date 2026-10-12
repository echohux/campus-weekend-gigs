// 周末兼职 mock 数据。distanceKm 为距学校直线距离（公里），用于“附近优先”排序与“3 公里内”筛选；
// day 用于“本周末/周六/周日”筛选。image 为相对路径，渲染时由 asset() 拼上部署基路径。
export const seedJobs = [
  {
    id: 1, title: '咖啡店周末店员', merchant: '青禾咖啡·大学城店', type: '餐饮服务',
    day: '周六', time: '周六 10:00–18:00', distanceKm: 1.2, distance: '距学校 1.2 km',
    pay: 22, slots: 2, image: 'assets/job-coffee.webp', address: '大学城文汇路 88 号（近东门）',
    description: '负责咖啡制作、顾客接待、门店日常整理等工作。无需经验，有培训，工作轻松友好。',
    requirements: ['在校大学生，年满 18 周岁', '周末时间可到岗', '有服务意识，认真负责']
  },
  {
    id: 2, title: '展会活动协助', merchant: '星桥会展', type: '活动协助',
    day: '周六', time: '周六 09:00–17:00', distanceKm: 2.8, distance: '距学校 2.8 km',
    pay: 20, slots: 5, image: 'assets/job-event.webp', address: '大学城文化中心 A 馆',
    description: '协助参展商布置展位、观众签到与现场引导，结束后完成物料清点。',
    requirements: ['普通话流利', '可连续站立工作', '服从现场安排']
  },
  {
    id: 3, title: '书店整理员', merchant: '页间书店', type: '门店整理',
    day: '周日', time: '周日 10:00–18:00', distanceKm: 2.5, distance: '距学校 2.5 km',
    pay: 18, slots: 3, image: 'assets/job-bookstore.webp', address: '文景路 16 号',
    description: '完成图书上架、分类整理和阅读区维护，为顾客提供简单指引。',
    requirements: ['做事细致有耐心', '能够搬运少量图书', '喜欢阅读优先']
  },
  {
    id: 4, title: '奶茶店周末兼职', merchant: '鹿见茶饮·南门店', type: '餐饮服务',
    day: '周日', time: '周日 12:00–20:00', distanceKm: 0.8, distance: '距学校 0.8 km',
    pay: 23, slots: 3, image: 'assets/job-coffee.webp', address: '大学城南门美食街 3 号',
    description: '负责制作茶饮、打包出餐与收银，节奏较快，氛围年轻。',
    requirements: ['手脚麻利', '周末可排班', '接受站立工作']
  },
  {
    id: 5, title: '校园招聘会引导', merchant: '弘毅人力', type: '活动协助',
    day: '周六', time: '周六 08:30–16:30', distanceKm: 1.9, distance: '距学校 1.9 km',
    pay: 25, slots: 8, image: 'assets/job-event.webp', address: '海城大学体育馆',
    description: '负责招聘会入场引导、企业展位指引与问卷回收，工作内容简单。',
    requirements: ['形象气质佳', '沟通表达清晰', '有活动经验优先']
  },
  {
    id: 6, title: '超市周末理货', merchant: '惠民生活超市', type: '门店整理',
    day: '周六', time: '周六 09:00–18:00', distanceKm: 3.6, distance: '距学校 3.6 km',
    pay: 19, slots: 4, image: 'assets/job-bookstore.webp', address: '学苑路 220 号',
    description: '完成商品补货、理货上架与价签核对，保持货架整洁。',
    requirements: ['能搬运一定重量', '做事踏实', '周末全天可到岗']
  },
  {
    id: 7, title: '咖啡市集派单', merchant: '青禾咖啡·大学城店', type: '促销派单',
    day: '周日', time: '周日 13:00–18:00', distanceKm: 1.5, distance: '距学校 1.5 km',
    pay: 21, slots: 6, image: 'assets/job-coffee.webp', address: '大学城中心广场',
    description: '在市集现场派发优惠券、引导扫码与简单介绍活动，轻松不枯燥。',
    requirements: ['性格开朗主动', '不怯场', '能坚持户外工作']
  },
  {
    id: 8, title: '文创快闪店店员', merchant: '拾光文创', type: '餐饮服务',
    day: '周六', time: '周六 11:00–19:00', distanceKm: 4.2, distance: '距学校 4.2 km',
    pay: 24, slots: 2, image: 'assets/job-event.webp', address: '滨河商业街 L1-08',
    description: '负责快闪店商品介绍、收银打包与简单陈列，接触各类文创产品。',
    requirements: ['审美在线', '细心负责', '对文创感兴趣优先']
  }
];
