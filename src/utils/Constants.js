/* Design tokens and constants for 戈壁守望者 */

export const COLORS = {
  gobiSand:    0xC4A46C,
  gobiEarth:   0x8B7355,
  gravelBlack: 0x2C2416,
  spaceBlue:   0x1A3A5C,
  skyWhite:    0xF5F0E8,
  signalGreen: 0x00FF88,
  warningAmber:0xFF8C00,
  confirmGold: 0xFFD700,
  errorRed:    0xFF4444,
  dataCyan:    0x00D4FF,
};

export const COLORS_HEX = {
  gobiSand:    '#C4A46C',
  gobiEarth:   '#8B7355',
  gravelBlack: '#2C2416',
  spaceBlue:   '#1A3A5C',
  skyWhite:    '#F5F0E8',
  signalGreen: '#00FF88',
  warningAmber:'#FF8C00',
  confirmGold: '#FFD700',
  errorRed:    '#FF4444',
  dataCyan:    '#00D4FF',
};

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;
export const SAFE_TOP = 44;
export const SAFE_BOTTOM = 34;
export const PAGE_MARGIN = 20;

export const SCENES = {
  BOOT:     'boot',
  SCENE_1:  'scene1_satellite',
  SCENE_2:  'scene2_journey',
  SCENE_3:  'scene3_stone',
  SCENE_4:  'scene4_restoration',
  SCENE_5:  'scene5_confirm',
  SCENE_6:  'scene6_gratitude',
  FINALE:   'finale_poster',
};

export const TRANSITIONS = {
  PIXEL_DISSOLVE:  'pixel_dissolve',
  SANDSTORM_WIPE:  'sandstorm_wipe',
  GRAVEL_SHATTER:  'gravel_shatter',
  SATELLITE_SCAN:  'satellite_scan',
  GLOW_EXPAND:     'glow_expand',
};

// Timing constants (ms)
export const TIMING = {
  TRANSITION_DURATION: 1200,
  FAST_FADE: 300,
  MEDIUM_FADE: 600,
  SLOW_FADE: 1000,
  TYPEWRITER_CHAR: 80,
  TYPEWRITER_PUNCT: 120,
  BREATHING_CYCLE: 2000,
};

// Scene 4: Restoration
export const RESTORATION = {
  TOTAL_TRIPS: 24,
  MILESTONE_TRIPS: [4, 8, 12, 16, 20, 24],
  TRUCK_SPEED_MAX: 8,
  UNLOAD_DURATION: 800,
  AUTO_RETURN_DURATION: 500,
};

// Scene 5: Satellite confirmation
export const SATELLITE = {
  COUNTDOWN_SECONDS: 23,
  PROCESSING_DURATION: 1500,
};

// Map nodes for Scene 2
export const MAP_NODES = [
  { progress: 0,   name: '成都',   event: '出发',      icon: 'location' },
  { progress: 0.15,name: '秦岭',   event: '穿山',      icon: 'mountain' },
  { progress: 0.30,name: '兰州',   event: '过黄河',    icon: 'city' },
  { progress: 0.50,name: '河西走廊',event: '戈壁初现', icon: 'desert' },
  { progress: 0.70,name: '嘉峪关', event: '出关',      icon: 'gate' },
  { progress: 0.85,name: '星星峡', event: '入疆',      icon: 'border' },
  { progress: 0.95,name: '哈密',   event: '抵达',      icon: 'star' },
  { progress: 1.0, name: '戈壁深处',event: '进入地标区',icon: 'target' },
];

// Timeline events for Scene 6
export const TIMELINE_EVENTS = [
  {
    date: '2025年11月',
    title: '哈密市相关部门',
    content: '对地标破坏事件立案调查',
  },
  {
    date: '2025年12月',
    title: '"为人民服务"等戈壁标语',
    content: '被纳入哈密市不可移动文物普查范围',
  },
  {
    date: '2026年1月',
    title: '多家媒体跟进报道',
    content: '守护精神地标引发社会广泛关注',
  },
  {
    date: '2026年3月',
    title: '当地越野爱好者群体',
    content: '自发组织保护巡逻队——"再不会让任何车轮碾过这些字"',
  },
  {
    date: '未来',
    title: '每一个你',
    content: '守护，不止一人之力',
    isSpecial: true,
  },
];
