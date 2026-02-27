export type ProfileLocationDistrict = {
  name: string;
  postalCode: string;
};

export type ProfileLocationCity = {
  name: string;
  districts: ProfileLocationDistrict[];
};

export type ProfileLocationCountry = {
  code: "TW";
  label: string;
  cities: ProfileLocationCity[];
};

export const profileLocationCountries: ProfileLocationCountry[] = [
  {
    code: "TW",
    label: "台灣",
    cities: [
      {
        name: "台北市",
        districts: [
          { name: "中正區", postalCode: "100" },
          { name: "大同區", postalCode: "103" },
          { name: "中山區", postalCode: "104" },
          { name: "松山區", postalCode: "105" },
          { name: "大安區", postalCode: "106" },
          { name: "信義區", postalCode: "110" },
        ],
      },
      {
        name: "新北市",
        districts: [
          { name: "板橋區", postalCode: "220" },
          { name: "新莊區", postalCode: "242" },
          { name: "中和區", postalCode: "235" },
          { name: "永和區", postalCode: "234" },
          { name: "三重區", postalCode: "241" },
          { name: "新店區", postalCode: "231" },
        ],
      },
      {
        name: "桃園市",
        districts: [
          { name: "桃園區", postalCode: "330" },
          { name: "中壢區", postalCode: "320" },
          { name: "平鎮區", postalCode: "324" },
          { name: "八德區", postalCode: "334" },
          { name: "龜山區", postalCode: "333" },
          { name: "蘆竹區", postalCode: "338" },
        ],
      },
      {
        name: "台中市",
        districts: [
          { name: "中區", postalCode: "400" },
          { name: "西屯區", postalCode: "407" },
          { name: "北屯區", postalCode: "406" },
          { name: "南屯區", postalCode: "408" },
        ],
      },
      {
        name: "高雄市",
        districts: [
          { name: "新興區", postalCode: "800" },
          { name: "前金區", postalCode: "801" },
          { name: "苓雅區", postalCode: "802" },
          { name: "左營區", postalCode: "813" },
        ],
      },
    ],
  },
];
