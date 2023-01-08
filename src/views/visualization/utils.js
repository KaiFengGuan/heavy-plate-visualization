import textTrans from './text';

// 可视分析视图 配置
export const visualColor = {
  // // 故障颜色
  // good: '#94A7B7',
  // bad: '#C65B24',
  // noflag: '#71797E',
  good: '#6AA1FF',
  bad: '#F98981',
  noflag: '#86909C',

  // 工序颜色
  heating: '#FCD8A9',
  rolling: '#CCE9C7',
  cooling: '#C1C9EE',
};

export function getLabelColor(label) {
  if (label === '1') return visualColor.good;
  else if (label === '0') return visualColor.bad;
  else return visualColor.noflag;
}

export const processName = ['heating', 'rolling', 'cooling'];

export const keysName = [
  [
    "charging_temp_act",
    "tgtplatelength2",
    "tgtwidth",
    "slab_length",
    "slab_thickness",
    "slab_weight_act",
    "slab_width",
    "ave_temp_1",
    "ave_temp_2",
    "ave_temp_dis",
    "ave_temp_pre",
    "ave_temp_soak",
    "ave_temp_entry_1",
    "ave_temp_entry_2",
    "ave_temp_entry_pre",
    "ave_temp_entry_soak",
    "center_temp_dis",
    "center_temp_entry_1",
    "center_temp_entry_2",
    "center_temp_entry_pre",
    "center_temp_entry_soak",
    "temp_uniformity_dis",
    "temp_uniformity_entry_1",
    "temp_uniformity_entry_2",
    "temp_uniformity_entry_pre",
    "temp_uniformity_entry_soak",
    "skid_temp_dis",
    "skid_temp_entry_1",
    "skid_temp_entry_2",
    "skid_temp_entry_pre",
    "skid_temp_entry_soak",
    "staying_time_1",
    "staying_time_2",
    "staying_time_pre",
    "staying_time_soak",
    "sur_temp_dis",
    "sur_temp_entry_1",
    "sur_temp_entry_2",
    "sur_temp_entry_pre",
    "sur_temp_entry_soak",
  ],
  [
    "meas_temp_0",
    "meas_temp_1",
    "meas_temp_10",
    "meas_temp_11",
    "meas_temp_12",
    "meas_temp_13",
    "meas_temp_14",
    "meas_temp_15",
    "meas_temp_16",
    "meas_temp_17",
    "meas_temp_18",
    "meas_temp_19",
    "meas_temp_2",
    "meas_temp_3",
    "meas_temp_4",
    "meas_temp_5",
    "meas_temp_6",
    "meas_temp_7",
    "meas_temp_8",
    "meas_temp_9",
    "t_0",
    "t_1",
    "t_2",
    "t_3",
    "t_4",
    "t_5",
    "t_6",
    "pass",
    "botbrplatecountfm",
    "botbrplatecountrm",
    "botwrplatecountfm",
    "botwrplatecountrm",
    "crownbody",
    "crownhead",
    "crowntail",
    "crowntotal",
    "devcrownbody",
    "devcrownhead",
    "devcrowntail",
    "devcrowntotal",
    "devfinishtempbody",
    "devfinishtemphead",
    "devfinishtemptail",
    "devfinishtemptotal",
    "wedgebody",
    "wedgehead",
    "wedgetail",
    "wedgetotal",
    "devwedgebody",
    "devwedgehead",
    "devwedgetail",
    "devwedgetotal",
    "finishtempbody",
    "finishtemphead",
    "finishtemptail",
    "finishtemptotal",
  ],
  [
    "avg_fct",
    "avg_p1",
    "avg_p2",
    "avg_p5",
    "avg_sct",
    "max_fct",
    "max_p1",
    "max_p2",
    "max_p5",
    "max_sct",
    "min_fct",
    "min_p1",
    "min_p2",
    "min_p5",
    "min_sct",
    "std_fct",
    "std_p1",
    "std_p2",
    "std_p5",
    "std_sct"
  ]
]

/**
 * 
 * @param {string} key 
 * @param {string} type (full | abbr | zh)
 */
export function formatText(key, type='abbr') {
  const obj = textTrans[key];
  if (obj && obj[type]) return obj[type];
  else return '';
}

export default {
  visualColor,
}