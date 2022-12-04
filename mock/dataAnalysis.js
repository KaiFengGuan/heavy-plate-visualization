module.exports = [
  // 单块钢板指标数据
  {
    url: '/pidasApi/v1.0/getPlateDataByUpid',
    type: 'get',
    response: {
      "code": 0,
      "msg": "ok",
      "data": {
        "slabid": "44261430212",
        "upid": "18A01003000",
        "platetype": "X80M",
        "steelspec": "Q345R(N)",
        "slabthickness": 30.5,
        "tgtplatethickness": 0.292,
        "tgtplatelength2": 5,
        "tgtwidth": 1.885,
        "tgtdischargetemp": 1260,
        "tgttmplatetemp": 950,
        "cooling_start_temp": 900,
        "cooling_stop_temp": 800,
        "cooling_rate1": 36,
        "heatingDuration": 3600,
        "rollingDuration": 12,
        "coolingDuration": 120,
        "fault": [
          1,
          1,
          0,
          0,
          1
        ]
      }
    }
  },

  // 
]
