export default defineAppConfig({
  pages: [
    'pages/lobby/index',
    'pages/team/index',
    'pages/battle/index',
    'pages/record/index',
    'pages/settings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0F172A',
    navigationBarTitleText: '团建夺旗战',
    navigationBarTextStyle: 'white',
    backgroundColor: '#0F172A'
  },
  tabBar: {
    color: '#64748B',
    selectedColor: '#4080FF',
    backgroundColor: '#1E293B',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/lobby/index',
        text: '大厅'
      },
      {
        pagePath: 'pages/record/index',
        text: '战绩'
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置'
      }
    ]
  }
})
