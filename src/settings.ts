"use strict";

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
  public general: dataPointSettings = new dataPointSettings();
}

export class dataPointSettings {
  public push: boolean = true
}

