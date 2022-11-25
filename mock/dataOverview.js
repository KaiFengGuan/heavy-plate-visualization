function generateData(data) {
  const newData = data.map((item, index) => {
    const { slabid } = item;
    const pre = slabid.slice(0, -3);
    const end = slabid.slice(-3);
    const newId = pre + (parseInt(end) + index).toString().padStart(3, '0');
    item.slabid = newId;
    return item
  })
  return newData;
}
function generateRhythmData(data) {
  const newData = data.map((item, index) => {
    const { slabid } = item;

    return {
      slabid: slabid,
      discharge: Math.random() * 10 + 250,
      rm: Math.random() * 5 + 120,
      fm: Math.random() * 5 + 80,
      acc: Math.random() * 5 + 50
    }
  })

  return newData
}

module.exports = [
  // 关键指标数据
  {
    url: '/pidasApi/v1.0/getKeyIndicatorsList',
    type: 'post',
    response: {
      "code": 0,
      "msg": "ok",
      "data": [
        {
          "slabid": "44261430212",
          "upid": "18A01003000",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430213",
          "upid": "18A01003001",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430214",
          "upid": "18A01003002",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430215",
          "upid": "18A01003003",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430216",
          "upid": "18A01003004",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430217",
          "upid": "18A01003005",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430218",
          "upid": "18A01003006",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430219",
          "upid": "18A01003007",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430220",
          "upid": "18A01003008",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430221",
          "upid": "18A01003009",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430222",
          "upid": "18A01003010",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430223",
          "upid": "18A01003011",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430224",
          "upid": "18A01003012",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430225",
          "upid": "18A01003013",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430226",
          "upid": "18A01003014",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430227",
          "upid": "18A01003015",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430228",
          "upid": "18A01003016",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430229",
          "upid": "18A01003017",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430230",
          "upid": "18A01003018",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430231",
          "upid": "18A01003019",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430232",
          "upid": "18A01003020",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430233",
          "upid": "18A01003021",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430234",
          "upid": "18A01003022",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430235",
          "upid": "18A01003023",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430236",
          "upid": "18A01003024",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430237",
          "upid": "18A01003025",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430238",
          "upid": "18A01003026",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        },
        {
          "slabid": "44261430239",
          "upid": "18A01003027",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            1,
            0,
            0,
            1
          ]
        },
        {
          "slabid": "44261430240",
          "upid": "18A01003028",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            1,
            0,
            1,
            0,
            1
          ]
        },
        {
          "slabid": "44261430241",
          "upid": "18A01003029",
          "platetype": "X80M",
          "steelspec": "Q345R(N)",
          "slabthickness": "30.5",
          "tgtplatethickness": "0.292",
          "tgtplatelength2": "5",
          "tgtwidth": "1.885",
          "tgtdischargetemp": "1260",
          "tgttmplatetemp": "950",
          "cooling_start_temp": "900",
          "cooling_stop_temp": "800",
          "cooling_rate1": "700",
          "heatingDuration": "3600",
          "rollingDuration": "12",
          "coolingDuration": "120",
          "fault": [
            0,
            1,
            0,
            0,
            0
          ]
        }
      ]
    }
  },

  // 生产节奏数据
  {
    url: '/pidasApi/v1.0/getRhythmDataByTime',
    type: 'post',
    response: {
      "code": 0,
      "msg": "ok",
      "data": [
        {
          "slabid": "44261430212",
          "discharge": 250.35458427881494,
          "rm": 121.59666740417045,
          "fm": 82.01872304074617,
          "acc": 50.25219632790672
        },
        {
          "slabid": "44261430213",
          "discharge": 256.8686339463632,
          "rm": 120.54270906598408,
          "fm": 80.7493707962692,
          "acc": 52.97514179201797
        },
        {
          "slabid": "44261430214",
          "discharge": 255.67715666883367,
          "rm": 124.99274788110492,
          "fm": 82.490937750519,
          "acc": 51.08507735574543
        },
        {
          "slabid": "44261430215",
          "discharge": 256.19821648426176,
          "rm": 121.07825137229601,
          "fm": 84.78707871517247,
          "acc": 53.66753725781267
        },
        {
          "slabid": "44261430216",
          "discharge": 257.25901122689885,
          "rm": 122.25415315822946,
          "fm": 80.24219082402004,
          "acc": 54.57867895575212
        },
        {
          "slabid": "44261430217",
          "discharge": 257.42464821832124,
          "rm": 122.38315891120827,
          "fm": 81.37993127734994,
          "acc": 50.22129608310079
        },
        {
          "slabid": "44261430218",
          "discharge": 258.366666565934,
          "rm": 121.38303852571848,
          "fm": 83.04259302829118,
          "acc": 50.85380730858817
        },
        {
          "slabid": "44261430219",
          "discharge": 252.1474868363561,
          "rm": 122.09810880509944,
          "fm": 82.82481062506935,
          "acc": 52.684195904614356
        },
        {
          "slabid": "44261430220",
          "discharge": 252.84552015872544,
          "rm": 122.63947503308756,
          "fm": 83.30019438410486,
          "acc": 52.415986853726906
        },
        {
          "slabid": "44261430221",
          "discharge": 257.16932105253653,
          "rm": 120.08032964577572,
          "fm": 82.94269451229513,
          "acc": 50.4435083363566
        },
        {
          "slabid": "44261430222",
          "discharge": 258.9817087629056,
          "rm": 121.51502355651641,
          "fm": 80.36024315761675,
          "acc": 52.877489804991825
        },
        {
          "slabid": "44261430223",
          "discharge": 256.3071192816281,
          "rm": 122.2319526979412,
          "fm": 83.4925188913052,
          "acc": 54.471744979709214
        },
        {
          "slabid": "44261430224",
          "discharge": 255.00491718771116,
          "rm": 123.77956309668181,
          "fm": 80.23592311357044,
          "acc": 54.86400854918292
        },
        {
          "slabid": "44261430225",
          "discharge": 259.901341238962,
          "rm": 122.81657015036889,
          "fm": 84.55346555550189,
          "acc": 50.39934899050487
        },
        {
          "slabid": "44261430226",
          "discharge": 252.58794873518866,
          "rm": 123.05057989901447,
          "fm": 84.33799237890835,
          "acc": 52.08071441913724
        },
        {
          "slabid": "44261430227",
          "discharge": 253.66221178938372,
          "rm": 121.74100007493755,
          "fm": 83.5912446380474,
          "acc": 54.843579588934716
        },
        {
          "slabid": "44261430228",
          "discharge": 257.8706652362596,
          "rm": 120.24672400702194,
          "fm": 82.8577115189918,
          "acc": 53.5937012197823
        },
        {
          "slabid": "44261430229",
          "discharge": 254.7610835558938,
          "rm": 120.20063505588739,
          "fm": 82.3077702651761,
          "acc": 52.36674071581368
        },
        {
          "slabid": "44261430230",
          "discharge": 253.0013421355522,
          "rm": 123.12351802848103,
          "fm": 84.30160883588024,
          "acc": 54.50374522542702
        },
        {
          "slabid": "44261430231",
          "discharge": 250.78149817259688,
          "rm": 121.08534143545903,
          "fm": 81.11731654648437,
          "acc": 53.55342848992527
        },
        {
          "slabid": "44261430232",
          "discharge": 252.9074070170127,
          "rm": 121.81743540465982,
          "fm": 84.60554897011507,
          "acc": 52.47096525566634
        },
        {
          "slabid": "44261430233",
          "discharge": 253.3034333673934,
          "rm": 123.86480148869519,
          "fm": 80.50978096995428,
          "acc": 52.36683407528781
        },
        {
          "slabid": "44261430234",
          "discharge": 255.86511606850664,
          "rm": 121.26092534399768,
          "fm": 80.6405752673789,
          "acc": 50.56796460724664
        },
        {
          "slabid": "44261430235",
          "discharge": 255.76039157195018,
          "rm": 120.96564873837983,
          "fm": 80.93133601746423,
          "acc": 50.57505608462325
        },
        {
          "slabid": "44261430236",
          "discharge": 251.19439026482283,
          "rm": 122.602033333057,
          "fm": 81.7648451075974,
          "acc": 50.49255953720655
        },
        {
          "slabid": "44261430237",
          "discharge": 250.27039321852635,
          "rm": 124.55566165717667,
          "fm": 82.39289616547153,
          "acc": 52.156835193359434
        },
        {
          "slabid": "44261430238",
          "discharge": 250.79292178456504,
          "rm": 120.43689156995462,
          "fm": 83.83160458469804,
          "acc": 54.90793595376836
        },
        {
          "slabid": "44261430239",
          "discharge": 256.844129042318,
          "rm": 121.32900718708105,
          "fm": 82.3774448468606,
          "acc": 53.35030352284956
        },
        {
          "slabid": "44261430240",
          "discharge": 250.07437089384783,
          "rm": 122.53112087951884,
          "fm": 81.27574786807338,
          "acc": 53.60698787593213
        },
        {
          "slabid": "44261430241",
          "discharge": 257.73980766475006,
          "rm": 121.84448369078508,
          "fm": 84.53357186239134,
          "acc": 53.379213873797426
        }
      ]
    }
  }
]
