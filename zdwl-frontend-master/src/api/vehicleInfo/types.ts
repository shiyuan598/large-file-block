export interface RuleForm extends PageQuery {
  card?: string
  sanitationType?: string
  keywords?: string
  brand?: string
  business?: string
  ownership: string
  gpsSource?: string
  loadVolume?: string
  boxCard?: string
  labelWidth?: number | undefined
  partName?: string
  orderDateSort?: string
  priceDate?:string
}
export interface AssemblyForm {
  type: string;
  label: string;
  prop: string;
  placeholder: string;
  labelWidth?: number | undefined
  optionList?: { label: string; value: string }[];
  multiple?: boolean;
}
interface obj {
  value: string
  label: string
  card?: string
}
export interface State {
  total?: number
  edit?: boolean
  loading?: boolean
  business?: obj[]
  ownership?: obj[]
  gpsSource?: obj[]
  tranType?: obj[]
  gps_source?: obj[]
  sanitationType?: obj[]
  partVehicle?: obj[]
  powerType?: obj[]
  apiFn?: Function | undefined
  downFn?: Function | undefined
  options?: [string]
  partName?: string
  dialogVisible?: boolean
  useVisible?: boolean
  detailsVisible?: boolean
  button?: boolean
  optionsList?: obj[]
  cooperationWay?: obj[]
  driveCardType?: obj[]
  dialogBorder?: boolean
  dialogRelease?: boolean
  waitVisible?: boolean
  optionHideen?: boolean
  submitRecord?: boolean
  type?: string
  cooperateOptions?: obj[]
  projectOption?: obj[]
  driverOptions?: obj[]
  licenseOptions?: obj[]
  tractorOptions?: obj[]
}
interface commonForm {
  id?: number;

  brand: string;
  business?: string;
  businessCode?: number | undefined;
  ownership: string;
  ownershipCode: number | undefined;

}
interface Depreciation {
  startTime: string;
  purAmount: string | number | undefined;
  purAmountTax: string | number | undefined;
  extraAmount?: string | number;
  purTax?: string | number | undefined;
  purTime: number | undefined;
  purLocation: string;
  depreciationPeriod: string | number | undefined;
  residualRate: string | number | undefined;
}
interface Certificate {
  drivingCardFile: any;
  drivingCardTime: string | undefined;
  drivingCardFileName: string
  tradingCardFile: any;
  tradingCardTime: string | undefined;
  tradingCardFileName: string
}
export interface Form extends commonForm, Depreciation, Certificate {
  card: string | undefined;
  vin: string | number | undefined;
  fuelCode: string | number | undefined;
  etcCode: string | number | undefined;
  gpsSource: string;
  gpsSourceCode: number | undefined;
  model?: string | number;
  engineNo?: string | number;
  personNo?: string | number;
  wheelbase?: string | number;
  tireNo?: string | number;
  tireSize?: string | number;
  eginePower?: string | number;
  vehicleCapacity?: string | number;
  fuelTank?: string | number;
  autoType?: string;
}

export interface TractorForm extends commonForm, Depreciation, Certificate {
  card: string | undefined;
  vin: string | number | undefined;
  model?: string | number;
  saddleBear?: number;
  saddleHeight?: number;
  payload?: number;
  frontRadius?: number;
  driveForm?: string;
  wheelbase?: string;
  tractionHeight?: number;
  curbWeight?: number;
  sprungWeight?: number;
}

export interface ContainerForm extends commonForm, Depreciation {
  trailerCard: string;
  boxCard: string;
  loadVolume: string
}

export interface SanitationForm extends commonForm, Certificate {
  card?: string | undefined;
  sanitationType?: string;
  sanitationTypeCode?: string | undefined;
  vin?: string | undefined;
  powerType?: string;
  fuelCode?: string | number | undefined;
  powerTypeCode?: string | number | undefined;
  enabled?: number;
}

export interface PassengerFrom extends commonForm, Certificate {
  card?: string | undefined;
  vin: string | undefined;
  powerType: string;
  etcCode: string | undefined;
  fuelCode: string | number | undefined;
  powerTypeCode: string | number | undefined;
}

export interface TreeData {
  children?: [];
  name?: string;
  lnglat?: [];
  card?: number;
  lat02?: number;
  lng02?: number;
  id?: number;
  type?: string;
  fuelLevel?: number;
  status: number;
  speed: number;
  gpsTime?: number | undefined;
}

export interface Import {
  title?: string;
  apiFn?: Function | undefined;
  downFn?: Function | undefined;
  import?: boolean;
  downloadType?: string;
}
export interface FormDialog {
  partType: string;
  partTypeCode: string;
  partName: string;
  purAmount: string;
  purNum: string;
  vehicleId?: string
  id?: string
}

export interface UseFormDialog {
  partId?: string | undefined;
  vehicleCard: string;
  useTime: string;
  useNum: string | number;
  usePerson: string;
  notes: string;
  id?: string
}

export interface UseParmes extends PageQuery {
  total: number;
  loading?: boolean;
  detailsData?: string;
  result?: number;
  projectCode?: number | null;
}

export interface DetailRrow {
  partId?: string | number;

}

export interface FormSate {
  labelWidth: number;
}

export interface OrderForm extends PageQuery {
  projectCode: undefined | number;
  customerCode: undefined | number;
  routeCode: undefined | number;
  tractorCode: undefined | number;
  driverCod: undefined | number;
  status: null | number;
  shiftPeriod: string;
  shiftType: string;
  driverType?: string;
  shiftOrder?: string | number | null;
}

export interface TmsDispatchPreOrderForm {
  id: null | number;
  project: string
  projectCode: null | number;
  orderDate: string
  customer: string
  customerCode: null | number;
  route: string
  routeCode: null | number;
  tractor: string
  tractorCode: null | number;
  firstDriver: string
  firstDriverCode: null | number;
  firstDriverPhone: string
  secondDriver: string
  secondDriverCode: null | number;
  secondDriverPhone: string
}