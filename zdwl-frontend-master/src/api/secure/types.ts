export interface jobForm extends PageQuery {
    keywords: string;
    business: string;
    cooperationWay?: string;
    phone?: string;
    driverType?: string;
    startTime?: string;
    endTime?: string;
    firstTimeSort?: string;
    drivingTimes?: any;
    jobTimes?: any;
    drivingTimeStart: string;
    drivingTimeEnd: string;
    jobTimeStart: string;
    jobTimeEnd: string;
}

export interface OnJobForm {
    name: string;
    phone: string;
    card?: string;
    business: string;
    businessCode: number | undefined;
    cooperationWay: string;
    cooperationWayCode: number | undefined;
    driveCardType: string;
    driveCardTypeCode: number | undefined;
    firstTime: string;
    payBank?: string;
    payAccount?: string;
    jobTime: string;
    drivingTime: string;
    commonTractorCard: string;
    commonProject: string;
    commonRoute: string;
    idCardFrontName?: string | undefined;
    idCardFront: string;
    idCardBackName?: string | undefined;
    idCardBack: string;
    workCardName?: string | undefined;
    workCard: string;
    driveCardName?: string | undefined;
    driveCard: string;
    status: number;
    id?: string;
    signStatus?: number;
}

export interface projectForm extends PageQuery {
    keywords: string;
    business: string;
    startTime: string;
    endTime: string;
    picker: string[];
    businessArr?: string[];
    result?: number | null;
    learnDateSort?: string;
    startTimeSort?: string;
    driver?: string;
}

export interface ProjecFormDialog {
    id?: string;
    projectName: string;
    file: any;
    fileName?: string;
    startTime: string;
    endTime: string;
    business?: string;
    businessCodes?: string;
    time?: any,
    businessList?: string[]
}
interface EditProject {
    projectName: string;
    projectCode: number | undefined;
    driver: string;
    phone: string;
    business: string;
    result: number | undefined;
    learnDate: string;
    businessList?: string[];
    id?: number | undefined;
}


export interface Options {
    dialogBorder: boolean;
    fileSrc: string | undefined;
    title: string;
}