her_company_rules
├── plugin.yaml
└── dashboard
     ├──  __init__.py     # 空文件
     ├──  manifest.json
     ├──  plugin_api.py
     ├──  config/         # 配置目录 
     │    ├──  constants.json
     │    ├──  defaults.json
     │    └──  ui.json
     ├──  src/   
     │    ├──  App.jsx
     │    ├──  index.jsx
     │    ├──  components/
     │    │      ├──  DynamicIcon.jsx
     │    │      ├──  MainNavBar.jsx
     │    │      ├──  SettingsPanel.jsx
     │    │      ├──  settings/
     │    │      │      ├──  AddNavItem.jsx
     │    │      │      ├──  AdjustNavItems.jsx
     │    │      │      ├──  DeleteNavItems.jsx
     │    │      │      ├──  InstallPlugin.jsx
     │    │             └──  GeneralSettings.jsx
     │    ├──  config/
     │    │      └──  loader.js
     │    ├──  hooks/
     │    │      └──  useNavConfig.js
     │    ├──  registry/
     │    │      ├──  componentRegistry.js
     │    │      └──  navRegistry.js
     │    ├──  styles/
     │    │      ├──  base.css
     │    │      ├──  index.css
     │    │      ├──  mainnav.css
     │    │      ├──  settings.css
     │    │      └──  subnav.css     
     └──  dist             # npx esbuild 输出目录