import { defineStore } from "pinia";
import { reactive } from "vue";
import { State } from "@/api/vehicleInfo/types";
export const dictionary = defineStore("dictionary", () => {
    const state = reactive<State>({
        business: [],
        ownership: [],
        gpsSource: [],
        sanitationType: [],
        powerType: [],
        partVehicle: [],
        cooperationWay: [],
        driveCardType: [],
        tranType: [],
        cooperateOptions: [],
        projectOption: [],
        driverOptions: [],
        licenseOptions: [],
        tractorOptions: []
    })
    function setDictionaryList(key: string,val: { value: number; label: string; }[]){
        state[key]=val
    }
    return { state ,setDictionaryList}
})