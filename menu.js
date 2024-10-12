let a = [
  {
    path: "project",
    name: "Project",
    meta: {
      title: "客户项目",
      icon: "uv",
      hidden: false,
      roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
      keepAlive: true,
    },
    children: [
      {
        path: "cooperate",
        name: "Cooperate",
        meta: {
          title: "合作客户",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
          keepAlive: true,
        },
      },
      {
        path: "info",
        name: "Info",
        meta: {
          title: "项目信息",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "createInfo",
        name: "CreateInfo",
        meta: {
          title: "项目信息详情",
          icon: "",
          hidden: true,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "provision",
    name: "Provision",
    meta: { title: "计提", icon: "monitor", hidden: false, roles: ["ADMIN"], keepAlive: true },
    children: [
      {
        path: "newlyOverview",
        name: "NewlyOverview",
        meta: { title: "总览", icon: "", hidden: false, roles: ["ADMIN"], keepAlive: true },
      },
      {
        path: "provisionRecords",
        name: "ProvisionRecords",
        meta: { title: "记录", icon: "", hidden: false, roles: ["ADMIN"], keepAlive: true },
      },
    ],
  },
  {
    path: "locationRoute",
    name: "LocationRoute",
    meta: {
      title: "地点路线",
      icon: "link",
      hidden: false,
      roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
      keepAlive: true,
    },
    children: [
      {
        path: "lineInfo",
        name: "LineInfo",
        meta: {
          title: "线路信息",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
          keepAlive: true,
        },
      },
      {
        path: "manager",
        name: "Manager",
        meta: {
          title: "地点管理",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "price",
        name: "Price",
        meta: {
          title: "单价标准",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "dispatch",
    name: "Dispatch",
    meta: {
      title: "调度中心",
      icon: "multi_level",
      hidden: false,
      roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "VMS_ADMIN", "GUEST"],
      keepAlive: true,
    },
    children: [
      {
        path: "proprietary",
        name: "Proprietary",
        meta: {
          title: "自营业务",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "VMS_ADMIN", "GUEST"],
          keepAlive: true,
        },
      },
      {
        path: "platform",
        name: "Platform",
        meta: {
          title: "平台业务",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
          keepAlive: true,
        },
      },
      {
        path: "unmanned",
        name: "Unmanned",
        meta: { title: "无人化调度", icon: "", hidden: false, roles: ["ADMIN", "TMS_ADMIN"], keepAlive: true },
      },
      {
        path: "report",
        name: "Report",
        meta: { title: "延误报备", icon: "", hidden: false, roles: ["ADMIN"], keepAlive: true },
      },
    ],
  },
  {
    path: "proprietaryLedger",
    name: "ProprietaryLedger",
    meta: {
      title: "自营业务台账",
      icon: "dict_item",
      hidden: false,
      roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
      keepAlive: true,
    },
    children: [
      {
        path: "overview",
        name: "Overview",
        meta: { title: "总览", icon: "", hidden: false, roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"], keepAlive: true },
      },
      {
        path: "orderRevenue",
        name: "OrderRevenue",
        meta: {
          title: "订单收入",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
          keepAlive: true,
        },
      },
      {
        path: "driverCommission",
        name: "DriverCommission",
        meta: {
          title: "司机提成",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "oilFee",
        name: "OilFee",
        meta: { title: "油费", icon: "", hidden: false, roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"], keepAlive: true },
      },
      {
        path: "ureaCost",
        name: "UreaCost",
        meta: {
          title: "尿素费用",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "highSpeedExpenses",
        name: "HighSpeedExpenses",
        meta: {
          title: "高速费用",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "weighingFee",
        name: "WeighingFee",
        meta: {
          title: "司机补扣款",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "collection",
        name: "Collection",
        meta: { title: "回款", icon: "", hidden: false, roles: ["ADMIN"], keepAlive: true },
      },
    ],
  },
  {
    path: "platformLedger",
    name: "PlatformLedger",
    meta: {
      title: "平台业务台账",
      icon: "document",
      hidden: false,
      roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
      keepAlive: true,
    },
    children: [
      {
        path: "platformInfo",
        name: "PlatformInfo",
        meta: {
          title: "平台业务信息",
          icon: "",
          hidden: false,
          roles: ["ADMIN", "FMS_ADMIN", "TMS_ADMIN", "GUEST"],
          keepAlive: true,
        },
      },
    ],
  },
];
