/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type OHLCSeriesOptions from './OHLCSeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import OHLCPoint from './OHLCPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        hlc: HLCSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
import HLCPoint from '../HLC/HLCPoint';
import LineSeriesOptions from '../Line/LineSeriesOptions';

const {
    addEvent,
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The ohlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ohlc
 *
 * @augments Highcharts.Series
 */

class OHLCSeries extends HLCSeries {
    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * An OHLC chart is a style of financial chart used to describe price
     * movements over time. It displays open, high, low and close values per
     * data point.
     *
     * @sample stock/demo/ohlc/
     *         OHLC chart
     *
     * @extends      plotOptions.column
     * @excluding    borderColor, borderRadius, borderWidth, crisp, stacking,
     *               stack
     * @product      highstock
     * @optionparent plotOptions.ohlc
     */
    public static defaultOptions: OHLCSeriesOptions = merge(HLCSeries.defaultOptions, {
        tooltip: {
            pointFormat:
                '<span style="color:{point.color}">\u25CF</span> ' +
                '<b> {series.name}</b><br/>' +
                'Open: {point.open}<br/>' +
                'High: {point.high}<br/>' +
                'Low: {point.low}<br/>' +
                'Close: {point.close}<br/>'
        }

        /**
         * Determines which one of `open`, `high`, `low`, `close` values should
         * be represented as `point.y`, which is later used to set dataLabel
         * position and [compare](#plotOptions.series.compare).
         *
         * @sample {highstock} stock/plotoptions/ohlc-pointvalkey/
         *         Possible values
         *
         * @type       {string}
         * @default    close
         * @validvalue ["open", "high", "low", "close"]
         * @product    highstock
         * @apioption  plotOptions.ohlc.pointValKey
         */

        /**
         * @default   close
         * @apioption plotOptions.ohlc.colorKey
         */

        /**
         * Line color for up points.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highstock
         * @apioption plotOptions.ohlc.upColor
         */
    } as OHLCSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<HLCPoint> = void 0 as any;

    public options: OHLCSeriesOptions = void 0 as any;

    public points: Array<OHLCPoint> = void 0 as any;

    public yData: Array<Array<number>> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getPointPath(point: OHLCPoint, graphic: SVGElement): SVGPath {
        const path = super.getPointPath(point, graphic),
            strokeWidth = graphic.strokeWidth(),
            crispCorr = (strokeWidth % 2) / 2,
            crispX = Math.round(point.plotX as any) - crispCorr,
            halfWidth = Math.round((point.shapeArgs as any).width / 2);

        let plotOpen = point.plotOpen;
        // crisp vector coordinates

        if (point.open !== null) {
            plotOpen = Math.round(point.plotOpen) + crispCorr;
            path.push(
                ['M', crispX, plotOpen],
                ['L', crispX - halfWidth, plotOpen]
            );

            super.extendStem(path, strokeWidth / 2, plotOpen);
        }
        return path;
    }


    /* eslint-disable valid-jsdoc */

    /**
     * Postprocess mapping between options and SVG attributes
     * @private
     */
    public pointAttribs(
        point: OHLCPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const attribs = super.pointAttribs.call(this, point, state),
            options = this.options;

        delete attribs.fill;

        if (
            !point.options.color &&
            options.upColor &&
            point.open < point.close
        ) {
            attribs.stroke = options.upColor;
        }

        return attribs;
    }

    public toYData(point: OHLCPoint): Array<number> {
        // return a plain array for speedy calculation
        return [point.open, point.high, point.low, point.close];
    }

}

/* *
 *
 *  Prototype Properties
 *
 *
 * */

interface OHLCSeries {
    pointAttrToOptions: Record<string, string>;
    pointClass: typeof OHLCPoint;
    init(): void;
    toYData(point: OHLCPoint): Array<number>;
}
extend(OHLCSeries.prototype, {
    animate: null as any, // Disable animation
    directTouch: false,
    pointArrayMap: ['open', 'high', 'low', 'close'],
    pointAttrToOptions: {
        stroke: 'color',
        'stroke-width': 'lineWidth'
    },
    pointValKey: 'close'
});

OHLCSeries.prototype.pointClass = OHLCPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        ohlc: typeof OHLCSeries;
    }
}
SeriesRegistry.registerSeriesType('ohlc', OHLCSeries);

/* *
 *
 *  Default Export
 *
 * */

export default OHLCSeries;

// Add useOhlcData option
addEvent(Series, 'init', function (
    eventOptions: { options: OHLCSeriesOptions }
): void {
    // eslint-disable-next-line no-invalid-this
    const series = this,
        options = eventOptions.options;

    if (
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {
        extend(series, {
            pointValKey: OHLCSeries.prototype.pointValKey,
            // keys: ohlcProto.keys, // @todo potentially nonsense
            pointArrayMap: OHLCSeries.prototype.pointArrayMap,
            toYData: OHLCSeries.prototype.toYData
        });
    }
});

addEvent(Series, 'afterSetOptions', function (
    e: { options: LineSeriesOptions }
): void {
    const options = e.options,
        dataGrouping = options.dataGrouping;

    if (
        dataGrouping &&
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {
        dataGrouping.approximation = 'ohlc';
    }
});


/* *
 *
 *  API Options
 *
 * */

/**
 * A `ohlc` series. If the [type](#series.ohlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ohlc
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.ohlc
 */

/**
 * An array of data points for the series. For the `ohlc` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4\.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 6, 5, 6, 7],
 *        [1, 9, 4, 8, 2],
 *        [2, 6, 3, 4, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.ohlc.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 3,
 *        high: 4,
 *        low: 5,
 *        close: 2,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 4,
 *        high: 3,
 *        low: 6,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.arearange.data
 * @excluding y, marker
 * @product   highstock
 * @apioption series.ohlc.data
 */

/**
 * The closing value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.ohlc.data.close
 */

/**
 * The opening value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.ohlc.data.open
 */

''; // adds doclets above to transpilat
