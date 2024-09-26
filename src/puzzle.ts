const configuration1 =
{
    "name": "Syllablast configuration 1",
    "board" : [
        ['ter','ate','ble','der'],
        ['fil','in','im','i'],
        ['i','late','mac','un'],
        ['u','vis','af','wa']
    ],
    "solution" : [ // “in,vis,i,ble”, “im,mac,u,late”, “af,fil,i,ate”, “un,der,wa,ter”
        ["in","vis","i","ble"],
        ["im","mac","u","late"],
        ["af","fil","i","ate"],
        ["un","der","wa","ter"]
    ]
};
const configuration2 =
{
    "name": "Syllablast configuration 2",
    "board" : [
        ['force','ment','al','in'],
        ['for','ma','am','in'],
        ['tive','ma','ing','in'],
        ['ri','re','te','ex']
    ],
    "solution" : [ //“ex,am,in,ing”, “re,in,force,ment”, “in,for,ma,tive”, “ma,te,ri,al”
        ["ex","am","in","ing"],
        ["re","in","force","ment"],
        ["in","for","ma","tive"],
        ["ma","te","ri","al"]
    ]
};
const configuration3 =
{
    "name": "Syllablast configuration 3",
    "board" : [
        ['al','di','me','di'],
        ['cu','cal','cal','me'],
        ['lat','im','ing','i'],
        ['on','ate','ag','chan']
    ],
    "solution" : [ //"me,chan,i,cal”, “cal,cu,lat,ing”, “im,me,di,ate”, “di,ag,on,al"
        ["me","chan","i","cal"],
        ["cal","cu","lat","ing"],
        ["im","me","di","ate"],
        ["di","ag","on","al"]
    ]
};

export { configuration1, configuration2, configuration3 };