"use strict";
import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private events: IVisualEventService;
    private target: HTMLElement;
    private settings: VisualSettings;
    private ipAddress: string = 'default value'
    private isEventUpdate: boolean = true
    private error: string
    private options: VisualUpdateOptions

    private dateConstructor: Date
    private dateUpdateInitial: Date

    private new_em: HTMLElement
    private em_dateConstructor: HTMLElement
    private em_dateUpdateInitial: HTMLElement

    constructor(options: VisualConstructorOptions) {
        this.dateConstructor = new Date()
        this.events = options.host.eventService;
        this.target = options.element;
        
        if (document) {
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("IP address:"));
            this.new_em = document.createElement("em");
            new_p.appendChild(this.new_em);
            

            const p_dateConstructor: HTMLElement = document.createElement('p')
            this.em_dateConstructor = p_dateConstructor.appendChild(document.createElement('em'))

            const p_dateUpdateInitial: HTMLElement = document.createElement('p')
            this.em_dateUpdateInitial = p_dateUpdateInitial.appendChild(document.createElement('em'))

            this.target.appendChild(new_p);
            this.target.appendChild(p_dateConstructor);
            this.target.appendChild(p_dateUpdateInitial);
           
            
            this.em_dateConstructor.innerText = this.dateConstructor.toString() + ' ' + this.dateConstructor.getMilliseconds()
            console.log('this.dateConstructor', this.dateConstructor);
            console.log(this.em_dateConstructor.innerText);
        }
    }

    public update(options: VisualUpdateOptions) {
        this.events.renderingStarted(options);
        this.options = options
        
        if(this.isEventUpdate){
            this.dateUpdateInitial = new Date()
            this.em_dateUpdateInitial.innerText = this.dateUpdateInitial.toString() + ' ' + this.dateUpdateInitial.getMilliseconds()
            console.log('this.dateUpdateInitial', this.dateUpdateInitial);
            console.log(this.em_dateUpdateInitial.innerText);
            this.getIpAddressFromApi()
            this.isEventUpdate = false
        }
       
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0])
        this.render()
    }

    private render() {
        if (this.settings.general.push) {
            this.new_em.innerText = this.ipAddress || this.error
        }
        else {
            this.new_em.innerText = ''
        }
    }

    private getIpAddressFromApi() {
        return fetch('https://api.ipify.org/?format=json')
            .then(results => results.json())
            .then(data => {
                this.ipAddress = data ? data.ip : this.ipAddress
                console.log(this.ipAddress);
                this.render()
                this.events.renderingFinished(this.options);
            })
            .catch(error => {
                this.error = error
                console.log(this.error);
                this.render()
                this.events.renderingFinished(this.options);
            })
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}