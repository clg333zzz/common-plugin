/**
* @公历、农历触摸插件 CgPicker
* @charset UTF-8
* @Author  clg333zzz@163.com
* @Time    2017-11-18
* @Version 1.0.0
* =========使用方法=========
* var myPick02 = new CgPicker();
* myPick02.init({
*    trigger: "#input02",
*    type: "lunar",
*    needTime: true,
*    fadeClose: true,
* });
* =========参数说明=========
* trigger: input标签ID
* type:    "lunar" (阳历+农历，默认值) "solar"(只有阳历)
* needTime: true (时辰可选，默认值) false (时辰不可选)
* fadeColse: true (点击遮罩层关闭插件，默认值) false （点击遮罩层不可关闭插件）
* defaultDataSolar: "2017-8-9"默认阳历日期
* =========获取结果=========
* 结果存在当前元素属性中，分别为：
* data-solar 阳历 | data-lunar 农历 | data-time 时辰
* =========单独转换接口=========
* 返回的都是对象，根据情况自己选择
* CgPicker.toLunarDate('2017-8-9') 将阳历'2017-8-18'转换为阴历'2017年闰6月27日'
* CgPicker.toSolarDate('2017-l6-27') 将农历'2017年闰6月27日'转换为阳历'2017-8-18'
* CgPicker.toSolarDate('2017-6-27') 将农历'2017年6月27日'转换为阳历'2017-7-20'
*/
window.CgPicker = (function () {
    function randomId() {
        var a = 65, b = 97, c = '', d = '';
        for (var i = 0; i < 8; i++) {
            var ri = Math.floor(Math.random() * 10);
            c = c + String.fromCharCode((ri > 4 ? a : b) + Math.floor(Math.random() * 26));
            if (i < 4) {
                d = d + Math.ceil(Math.random() * 10);
            }
        }
        c = c + "_" + d;
        return c;
    }

    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += ' ' + cls;
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls);
            obj.className = obj.className.replace(reg, '');
        }
    }

    function toggleClass(obj, cls) {
        hasClass(obj, cls) ? removeClass(obj, cls) : addClass(obj, cls);
    }

    //================== 公历与农历互转 start ==================
    // var lunarData = new Array(0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63);
    var lunarData = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
        0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
        0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
        0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
        0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
        0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
        0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
        0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
        0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
        0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
        0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
        0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
        0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
        /**Add By JJonline@JJonline.Cn**/
        0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
        0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
        0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
        0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
        0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
        0x0d520];//2100
    var timeZone = 8;//时区
    var LUNAR_BASE_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    var LUNAR_DAY_PREFIX = ['初', '十', '廿', '三'];
    var LUNAR_MONTH_NAME = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
    var LUNAR_DAY_NAME = (function () {
        var lunarDayName = [];
        for (var j = 1; j <= 30; j++) {
            if (j <= 10) {
                lunarDayName[j - 1] = LUNAR_DAY_PREFIX[0] + LUNAR_BASE_NUM[j - 1];
            } else if (j > 10 && j < 20) {
                lunarDayName[j - 1] = LUNAR_DAY_PREFIX[1] + LUNAR_BASE_NUM[j - 1 * 10 - 1];
            } else if (j == 20) {
                lunarDayName[j - 1] = "廿十";
            } else if (j > 20 && j < 30) {
                lunarDayName[j - 1] = LUNAR_DAY_PREFIX[2] + LUNAR_BASE_NUM[j - 2 * 10 - 1];
            } else if (j == 30) {
                lunarDayName[j - 1] = "三十";
            }
        }
        return lunarDayName;
    })();
    function lunarYearDetail(year) {
        var yearObj = {};
        var baseDays = 0;
        var days = 0;
        for (var i = 0x8000, j = 1; i > 0x8; i >>= 1, j++) {
            var iDays = (lunarData[year - 1900] & i) ? 30 : 29;
            baseDays = baseDays + iDays;
            yearObj[j] = iDays;
            yearObj['monthName' + j] = LUNAR_MONTH_NAME[j - 1];
        }
        days = baseDays + getLeapDays(year);
        yearObj['days'] = days;

        var leapMonth = isLunarLeapMonth(year);
        if (leapMonth > 0) {
            yearObj['leapMonth'] = leapMonth;
            yearObj['l' + leapMonth] = getLeapDays(year);
            // yearObj['leapMonthDays' + leapMonth] = getLeapDays(year);
            yearObj['leapMonthName' + leapMonth] = "闰" + LUNAR_MONTH_NAME[leapMonth - 1];
        }
        return yearObj;
    }

    var LUNAR_YEAR_LIST = (function () {
        var allInfo = {};
        var daysCount = 0;
        for (var i = 1900, iLen = i + lunarData.length; i <= iLen; i++) {
            var curInfo = lunarYearDetail(i);
            daysCount = daysCount + curInfo.days;
            curInfo['prevCountDays'] = daysCount;
            allInfo[i] = curInfo;
        }
        return allInfo;
    })();

    function getLunarYearDays(year) {//获取总天数
        var baseDays = 0;
        var days = 0;
        for (var i = 0x8000; i > 0x8; i >>= 1) {
            var iDays = (lunarData[year - 1900] & i) ? 30 : 29;
            baseDays = baseDays + iDays;
        }
        days = baseDays + getLeapDays(year);
        return days;
    }
    function isLunarLeapMonth(year) {//当年闰月年份
        return lunarData[year - 1900] & 0xF;
    }
    function getLunarMonthDays(year, month) {//当年某个月份的天数
        return (lunarData[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }
    function getLeapDays(year) {//当年是否闰月，大闰30，小闰29，不闰0
        if (isLunarLeapMonth(year)) {
            return (lunarData[year - 1900] & 0x10000) ? 30 : 29;
        } else {
            return 0;
        }
    }
    function isLeapYear(year) {//西历是否闰年
        var a = year % 4;
        var b = year % 100;
        var c = year % 400;
        if (((a == 0) && (b != 0)) || (c == 0)) {
            return true;
        }
        return false;
    }
    function getDateTime(date) {
        var a = date.split("-");
        var b = new Date();
        b.setFullYear(parseInt(a[0]));
        b.setMonth(parseInt(a[1]) - 1);
        b.setDate(parseInt(a[2]));
        b.setHours(timeZone);
        b.setMinutes(0);
        b.setSeconds(0);
        b.setMilliseconds(0);
        return b.getTime();
    }

    function getLunarDaysCount(lunarDate) {
        //用来计算指定农历日期距离农历"1900正月初一"的总天数
        //参数格式一："2017-6-6"  (二零一七年六月初六)
        //参数格式二："2017-l6-6" (二零一七年闰六月初六)
        var a = lunarDate.split("-");
        var y = parseInt(a[0]);

        var mIsLeapMonth = false;
        var mOriginal = a[1];//原始月份，闰年带有前缀'l'
        var m = a[1];
        if (m.indexOf("l") == 0) {
            mIsLeapMonth = true;
            m = parseInt(a[1].substr(1));
        } else {
            m = parseInt(a[1]);
        }

        var d = parseInt(a[2]);
        if(LUNAR_YEAR_LIST[y][mOriginal] < d) {//这里把阳历的月份当做农历来算，要先检测月份天数，比如有的是正月30天，但是阳历1月一定有31天
            d = LUNAR_YEAR_LIST[y][mOriginal];
        }
        var count = 0;

        count = LUNAR_YEAR_LIST[y - 1].prevCountDays;

        var curLeapMonth = isLunarLeapMonth(y);
        for (var j = 1; j <= m; j++) {
            if (mIsLeapMonth) { //表明输入的日期是"2017-l6-6"2017闰六月初六
                if (j == m) {
                    count = count + getLunarMonthDays(y, j) + (getLeapDays(y) < d ? getLeapDays(y) : d);
                } else {
                    count = count + getLunarMonthDays(y, j);
                }
            } else if (m > curLeapMonth) {
                if (j == m) {
                    count = count + getLeapDays(y) + (getLunarMonthDays(y, j) < d ? getLunarMonthDays(y, j) : d);
                } else {
                    count = count + getLunarMonthDays(y, j);
                }
            } else if (m <= curLeapMonth) {
                if (j == m) {
                    count = count + d;
                } else {
                    count = count + getLunarMonthDays(y, j);
                }
            }
        }
        return count;
    }


    function toSolarDate(lunarDate) {
        //农历日期转为阳历日期，通过获取总秒数来算时间，
        //javascript日期从1970-1-1号开始计算，再往前是负数，往后是正数
        var sTime = getDateTime("1900-1-31");//注意这里正月初一是公历1900-1-31
        var eTime = (getLunarDaysCount(lunarDate) - 1) * 24 * 60 * 60 * 1000;//这里获取从农历1900-正月-初一到指定农历日期的总天数
        var sumTime = sTime + eTime;
        var cDate = new Date();
        cDate.setTime(sumTime);
        return {
            year: cDate.getFullYear(),
            month: cDate.getMonth() + 1,
            day: cDate.getDate()
        }
    }


    function lunarDateDistanceDays(solarDate, countDays) {
        //以当前solarDATE对应数值做为阴历日期基准值，往前推countDays，获取最终想要的阴历日期
        var dateArr = solarDate.split("-");
        var y = parseInt(dateArr[0]);
        var m = parseInt(dateArr[1]);
        var d = parseInt(dateArr[2]);

        if(LUNAR_YEAR_LIST[y][m] < d) {//这里把阳历的月份当做农历来算，要先检测月份天数，比如有的是正月30天，但是阳历1月一定有31天
            d = LUNAR_YEAR_LIST[y][m];
        }
        var currMaxLunarDate = y + "-" + m + "-" + d;
        var lunarDistance = getLunarDaysCount(solarDate) - getLunarDaysCount(y + "-1-1");//距离当年正月初一的天数
        var days = 0;
        var leapMonth = isLunarLeapMonth(y);
        var leapMonthDays = getLeapDays(y);
        var lunar_year, lunar_month, lunar_day;
        lunar_year = y;

        if (lunarDistance == countDays) {
            lunar_month = 1;
            lunar_day = 1;
            return {
                lunar_year: lunar_year,
                lunar_month: LUNAR_MONTH_NAME[lunar_month - 1],
                lunar_day: LUNAR_DAY_NAME[lunar_day - 1],
                lunar_m : lunar_month,
                lunar_d: lunar_day
            };
        }
        if (lunarDistance < countDays) {//说明要往前减一年再推算
            lunar_year = y - 1;
            leapMonth = isLunarLeapMonth(lunar_year);
            leapMonthDays = getLeapDays(lunar_year);
            lunarDistance = getLunarDaysCount(lunar_year + "-12-30") - getLunarDaysCount(lunar_year + "-1-1");
            // countDays = countDays - d;
            var dd = 0;
            for(var i = 1; i < m; i++) {//如果是2月份，还要减掉一月份的天数
                dd = dd + LUNAR_YEAR_LIST[lunar_year][i];
            }
            countDays = countDays - dd - d;
        }

        for (var i = 0x8000, j = 1; i > 0x8; i >>= 1, j++) {
            var curMonthDays = (lunarData[lunar_year - 1900] & i) ? 30 : 29;
            lunar_month = j;

            for (var k = 1; k <= curMonthDays; k++) {
                days++;
                if (days == lunarDistance - countDays) {
                    lunar_day = k + 1;
                    if(k == curMonthDays) {//当农历日期到了月底最后一天时，比如正月三十号，如果k=30时，必须往后加一天，变为二月初一
                        lunar_day = 1;
                        if(lunar_month == leapMonth) {//闰年
                            return {
                                lunar_year: lunar_year,
                                lunar_month: '闰' + LUNAR_MONTH_NAME[lunar_month - 1],
                                lunar_day: LUNAR_DAY_NAME[lunar_day - 1],
                                lunar_m : 'l' + lunar_month,
                                lunar_d: lunar_day
                            };
                        } else {//非闰年
                            lunar_month ++;
                        }
                    }
                    return {
                        lunar_year: lunar_year,
                        lunar_month: LUNAR_MONTH_NAME[lunar_month - 1],
                        lunar_day: LUNAR_DAY_NAME[lunar_day - 1],
                        lunar_m : lunar_month,
                        lunar_d: lunar_day
                    };
                }
            }

            if (j == leapMonth) {//闰月
                curMonthDays = leapMonthDays;
                for (var k = 1; k <= curMonthDays; k++) {
                    days++;
                    if (days == lunarDistance - countDays) {
                        lunar_day = k + 1;
                        if(k == curMonthDays) {
                            lunar_month ++;
                            lunar_day = 1;
                            return {
                                lunar_year: lunar_year,
                                lunar_month: LUNAR_MONTH_NAME[lunar_month - 1],
                                lunar_day: LUNAR_DAY_NAME[lunar_day - 1],
                                lunar_m : lunar_month,
                                lunar_d: lunar_day
                            };
                        } else {
                            return {
                                lunar_year: lunar_year,
                                lunar_month: '闰' + LUNAR_MONTH_NAME[lunar_month - 1],
                                lunar_day: LUNAR_DAY_NAME[lunar_day - 1],
                                lunar_m : 'l' + lunar_month,
                                lunar_d: lunar_day
                            };
                        }
                    }
                }
            }
        }
    }

    function toLunarDate(solarDate) {
        //计算当前阳历日期对应的阴历日期
        var dateArr = solarDate.split("-");
        var y = parseInt(dateArr[0]);
        var m = parseInt(dateArr[1]);
        var d = parseInt(dateArr[2]);
        var count = 0;
        for (var i = 1900; i <= y; i++) {
            if (i == y) {
                var st = getDateTime(solarDate);
                var et = getDateTime(y + "-1-1");
                count = count + (st - et) / (24 * 3600 * 1000) + 1;
            } else {
                if (isLeapYear(i)) {
                    count += 366;
                } else {
                    count += 365;
                }
            }
        }
        count = count - 31 + 1;//注意这里距离正月初一是公历1900-1-31的总天数，加上最后一天31号

        var lcount = getLunarDaysCount(solarDate);
        var distanceDays = lcount - count;

        // console.log(distanceDays);
        return lunarDateDistanceDays(solarDate, distanceDays);
    }

    //================== 公历与农历互转 end ==================

    function MobPicker() {
        var opt;
        var dis = 0;//存放最后translate3D Y轴的值
        var calendarType = "solar";
        var cellH;//滚动单元格高度

        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();
        var curTime = -1;
        var y_index, m_index, d_index, t_index;
        var lastSolarDate, lastLunarDate, lastDate;


        //======== 年月检查 start ========
        var monthBig = [1, 3, 5, 7, 8, 10, 12];//大月列表
        var monthSmall = [4, 6, 9, 11];//小月列表
        this.arrayContains = function (array, value) {//检查当前月份是属于大月还是小月
            for (var i = 0, iLen = array.length; i < iLen; i++) {
                if (array[i] == value) {
                    return true;
                }
            }
            return false;
        };
        this.isLeapYear = function (year) {//检查当前年份是否闰年
            var a = year % 4;
            var b = year % 100;
            var c = year % 400;
            if (((a == 0) && (b != 0)) || (c == 0)) {
                return true;
            }
            return false;
        };
        //======== 年月检查 end ========

        this.init = function (obj) {
            opt = obj;
            opt.trigger = document.querySelector(obj.trigger);
            opt.pickerId = randomId();
            var _this = this;
            if (opt.defaultDataSolar) {
                opt.trigger.value = opt.defaultDataSolar;
                opt.trigger.dataset.solar = opt.defaultDataSolar;
            }
            opt.trigger.addEventListener("click", function () {
                if (!document.getElementById(opt.pickerId)) {
                    _this.initialEvent();
                } else {
                    var lastCanlendarType = calendarType;
                    document.getElementById(opt.pickerId + '_solar').click();
                    _this.locationDate(opt.trigger.value);
                    if(lastCanlendarType === 'lunar') { 
                        document.getElementById(opt.pickerId + '_lunar').click();
                    }
                    document.getElementById(opt.pickerId).style.display = "block";
                }
                document.activeElement.blur();//阻止获得焦点
            })

        };
        this.cellSelect = function (type, html) {
            var cell = "" +
                '<div class="cg-scroll">' +
                '<div class="cg-data">' +
                '<div id="' + opt.pickerId + '_' + type + '_select" class="cgddw">' +
                html +
                '</div>' +
                '</div>' +
                '<div class="cg-fade"></div>' +
                '</div>';
            return cell;
        };
        this.timeSelect = function () {
            var tHTML = "";
            for (var i = -1, j = -1; i <= 23; i ++, j++) {
                if(i == -1) {
                    tHTML = tHTML + "<div class='cg-cell' data-type='time' data-index='" + j + "' data-value='" + i + "'>未知</div>";
                } else {
                    tHTML = tHTML + "<div class='cg-cell' data-type='time' data-index='" + j + "' data-value='" + i + "'>" + i + "</div>";
                }
                
            }
            tHTML = this.cellSelect('time', tHTML);
            return tHTML;
        };
        this.yearSelect = function () {
            var yHTML = "";
            for (var i = 1936, index = 0, iLen = 2050; i <= iLen; i++ , index++) {
                yHTML = yHTML + "" +
                    "<div class='cg-cell' data-type='year' data-index='" + i + "' data-value='" + i + "'>" + i + "</div>";
            }
            yHTML = this.cellSelect('year', yHTML);
            return yHTML;
        };
        this.monthSelect = function () {
            var html = "";
            for (var i = 1, index = 0; i <= 12; i++ , index++) {
                html = html + "" +
                    "<div class='cg-cell' data-type='month' data-index='" + i + "' data-value='" + i + "'>" + i + "</div>";
            }
            html = this.cellSelect('month', html);
            return html;
        };
        this.daySelect = function (year, month, maxDay) {
            var html = "";

            if(year == 1936 && month == 1) {
                var startDay = 24;
            } else {
                var startDay = 1;
            }
            for (var i = startDay, index = 0; i <= parseInt(maxDay); i++ , index++) {
                html = html + "" +
                    "<div class='cg-cell' data-type='day' data-index='" + i + "' data-value='" + i + "'>" + i + "</div>";
            }

            if (document.getElementById(opt.pickerId + "_day_select")) {
                // console.log("更换日期");
                document.getElementById(opt.pickerId + "_day_select").innerHTML = html;
            } else {
                // console.log("第一次添加链接");
                html = "" +
                    '<div class="cg-data">' +
                    '<div id="' + opt.pickerId + '_day_select" class="cgddw">' +
                    html +
                    '</div>' +
                    '</div>' +
                    '<div class="cg-fade"></div>';

                var newDiv = document.createElement("div");
                newDiv.className = "cg-scroll";
                newDiv.innerHTML = html;

                document.querySelectorAll("#" + opt.pickerId + " .cg-list")[0].appendChild(newDiv);
            }
        };
        this.getDay = function (year, month) {
            if (this.arrayContains(monthBig, month)) {//如果只带月份过来，判断是否为大月
                this.daySelect(year, month, 31);
            } else if (this.arrayContains(monthSmall, month)) {//如果只带月份过来，判断是否为小月
                this.daySelect(year, month, 30);
            } else {//如果只带了年份过来，只需要判断是否闰年即可判断2月份数
                if (this.isLeapYear(year)) {
                    this.daySelect(year, month, 29);
                } else {
                    this.daySelect(year, month, 28);
                }
            }
        };
        this.createHTML = function () {
            var yearHTML = this.yearSelect();
            var monthHTML = this.monthSelect();
            var timeHTML = this.timeSelect();

            var newHTML = "" +
                '<div class="cg-main">' +
                '<div id="' + opt.pickerId + '_cdTopTitle" class="cdTopTitle"></div>' +
                '<div class="cg-cal-type clearfix">' +
                '<a id="' + opt.pickerId + '_solar" class="active" href="javascript:;">公历</a>' +
                '<a id="' + opt.pickerId + '_lunar" href="javascript:;">农历</a>' +
                '</div>' +
                '<div class="cg-title clearfix"><span>年</span><span>月</span><span>日</span><span>时辰</span></div>' +
                '<div class="clearfix">' + 
                    '<div class="cg-list cg-list-a clearfix">' +
                    yearHTML +
                    monthHTML +
                    '</div>' +
                    '<div class="cg-list cg-list-b clearfix">' + timeHTML + '</div>' +
                "</div>" +
                '<div class="cg-btn"><a href="javascript:;" id="' + opt.pickerId + '_cgOk">确定</a><a href="javascript:;" id="' + opt.pickerId + '_cgCancel">取消</a></div>' +
                '</div>' +
                '<div id="'+ opt.pickerId +'_cgShadow" class="cg-shadow"></div>';
            return newHTML;
        };
        this.getIndex = function(val) {
            return (val / cellH) < 0 ? (Math.abs(val / cellH) + 2) : (2 - (val / cellH));
        },
        this.getItemValue = function(type) {
            var currEle = document.querySelector('#' + opt.pickerId + '_' + type + '_select');
            var currTransform = currEle.style.transform;
            var reg = /,\s?(-?\d+)/;
            reg.test(currTransform);
            var index = this.getIndex(RegExp.$1);
            var item_index = document.querySelectorAll('#' + opt.pickerId + ' div[data-type='+ type +']')[index].getAttribute("data-index");
            var item_value = document.querySelectorAll('#' + opt.pickerId + ' div[data-type='+ type +']')[index].getAttribute("data-value");
            return {
                index: item_index,
                value: item_value
            };
        },
        this.lastResult = function () {
            var myYear = this.getItemValue('year');
            var myMonth = this.getItemValue('month');
            var myDay = this.getItemValue('day');
            var myTime = this.getItemValue('time');
            var myTimeValue = '';

            if (opt.needTime) {
                curTime = (myTime.value == -1) ? '' : myTime.value;
                var myTimeValue = (curTime === '') ? '' : (curTime + '时');
            }

            if(calendarType == "solar") {
                lastSolarDate = {
                    year: parseInt(myYear.index),
                    month: parseInt(myMonth.index),
                    day: parseInt(myDay.index)
                };
                lastLunarDate = toLunarDate(myYear.index + "-" + myMonth.index + "-" + myDay.index);
                document.getElementById(opt.pickerId + "_cdTopTitle").innerText = myYear.value + '-' + myMonth.value + '-' + myDay.value + ' ' + myTimeValue;
            } else if(calendarType == "lunar") {
                lastSolarDate = toSolarDate(myYear.index + "-" + myMonth.index + "-" + myDay.index);
                lastLunarDate = toLunarDate(lastSolarDate.year + "-" + lastSolarDate.month + "-" + lastSolarDate.day);
                document.getElementById(opt.pickerId + "_cdTopTitle").innerText = myYear.value + "年" + myMonth.value + myDay.value + ' ' + myTimeValue;
            }
            
            curYear = lastSolarDate.year;
            curMonth = lastSolarDate.month;
            curDay = lastSolarDate.day;
            curYear_index = myYear.index;
            curMonth_index = myMonth.index;
            curDay_index = myDay.index;

            lastDate = LUNAR_YEAR_LIST[lastLunarDate.lunar_year];
            lastDate.lunarDate = lastLunarDate;
            lastDate.solarDate = lastSolarDate;
            lastDate.selectTime = myTime
            // console.log(lastDate);
        }
        this.locationDate = function() {
            if(opt.trigger.value) {
                var curDate = opt.trigger.dataset.solar.split("-");
                curYear = parseInt(curDate[0]);
                curMonth = parseInt(curDate[1]);
                curDay = parseInt(curDate[2]);
                curTime = parseInt(opt.trigger.dataset.time) || -1;
            }
            var y_index = 0;
            var m_index = 0;
            var d_index = 0;
            var t_index = 0;
            //值从1936开始
            y_index = (curYear - 1936 <= 2) ? (2 - (curYear - 1936)) : -(curYear - 1936 - 2);
            //值从1开始
            m_index = (curMonth - 0 <= 3) ? (3 - curMonth) : - (curMonth - 3);
            d_index = (curDay - 0 <= 3) ? (3 - curDay) : - (curDay - 3);
            //值从0开始
            t_index = (curTime - 0 <= 1) ? (1 - curTime) : - (curTime - 1);
            document.getElementById(opt.pickerId + "_year_select").style.transform = "translate3D(0," + y_index * cellH + "px, 0)";
            document.getElementById(opt.pickerId + "_month_select").style.transform = "translate3D(0," + m_index * cellH + "px, 0)";
            document.getElementById(opt.pickerId + "_day_select").style.transform = "translate3D(0," + d_index * cellH + "px, 0)";
            document.getElementById(opt.pickerId + "_time_select").style.transform = "translate3D(0," + t_index * cellH + "px, 0)";
            this.lastResult();//插件初始化获取初始值
        };
        this.initalCss = function() {
            // solar 不显示农历 needTime: false 不显示时辰
            var newStyle = document.createElement("style");
            var pickerId = '#' + opt.pickerId;
            var newCss = '';
            if(opt.type === "solar") {
                document.querySelectorAll(pickerId + " .cg-main")[0].classList.add("only-solar")
                newCss = newCss + pickerId + ' .only-solar .cg-cal-type {display: none;}';  
            }
            if(opt.needTime === false) {       
                document.querySelectorAll(pickerId + " .cg-main")[0].classList.add("no-time");    
                newCss = newCss +
                pickerId + ' .no-time .cg-title span {width: 33.333333%}' + 
                pickerId + ' .no-time .cg-title span:last-child {display:none;}' + 
                pickerId + ' .no-time .cg-list-a {width: 100%;}' +
                pickerId + ' .no-time .cg-list-b {display: none;}';
            }
            newStyle.innerText = newCss;
            document.querySelectorAll('head')[0].appendChild(newStyle);
        };
        this.initialEvent = function () {
            var _this = this;
            var cgPickerHTML = this.createHTML();
            var newDiv = document.createElement("div");
            newDiv.id = opt.pickerId;
            newDiv.className = "cg-picker";
            newDiv.innerHTML = cgPickerHTML;
            document.body.appendChild(newDiv);
            this.getDay(curYear, curMonth); // 插入之后，立即把Day选择添加进去

            this.initalCss();

            var startX, startY, endX, endY;
            var cgPicker = document.getElementById(opt.pickerId);
            var parentH = 0;
            var curDis = 0;//touchmove 动态获取的Y轴值
            var target, parentEle;
            var mousedown = false;
            var moved = false;
            var index = 2;//当前触摸的序号，用来获取当前的值
            cellH = document.querySelectorAll("#" + opt.pickerId + " .cg-cell")[0].offsetHeight;//单元格高度，判断选择最重要的因素（很重要的参数）
            this.locationDate();

            var scrollArea = document.querySelectorAll("#" + opt.pickerId + " .cgddw");
            for (var i = 0, iLen = scrollArea.length; i < iLen; i++) {
                (function (index) {
                    scrollArea[index].addEventListener("touchstart", dataTouchStart);
                    scrollArea[index].addEventListener("touchmove", dataTouchMove);
                    scrollArea[index].addEventListener("touchend", dataTouchEnd);
                    scrollArea[index].addEventListener("mousedown", dataTouchStart);
                    scrollArea[index].addEventListener("mousemove", dataTouchMove);
                    scrollArea[index].addEventListener("mouseup", dataTouchEnd);
                    scrollArea[index].addEventListener("mouseleave", dataTouchEnd);
                })(i);
            }


            cgPicker.addEventListener("mousewheel", function (event) {
                return false;
            });
            cgPicker.addEventListener("touchmove", function (event) {
                event.preventDefault();
            });

            var cgOk = document.getElementById(opt.pickerId + "_cgOk");
            var cgCancel = document.getElementById(opt.pickerId + "_cgCancel");
            cgOk.addEventListener("click", function () {
                // var myTimeValue = (curTime === '') ? '' : (curTime + '时');
                // opt.trigger.value = lastSolarDate.year + "-" + lastSolarDate.month + "-" + lastSolarDate.day + ' ' + myTimeValue;
                opt.trigger.value = document.getElementById(opt.pickerId + "_cdTopTitle").innerText;
                opt.trigger.dataset.solar = lastSolarDate.year + '-' + lastSolarDate.month + '-' + lastSolarDate.day;
                if(opt.needTime) {
                    opt.trigger.dataset.time = curTime;
                }
                if(opt.type === 'lunar') {
                    opt.trigger.dataset.lunar = lastLunarDate.lunar_year + '-' + lastLunarDate.lunar_month + '-' + lastLunarDate.lunar_day;
                }
                cgPicker.style.display = "none";
            });
            cgCancel.addEventListener("click", function () {
                cgPicker.style.display = "none";
            });
            if(opt.fadeClose) {
                var cgFade = document.getElementById(opt.pickerId + "_cgShadow");
                cgFade.addEventListener("click", function() {
                    cgPicker.style.display = "none";
                });
            }
            

            var startTime, endTime;
            var tsTimeout;
            function dataTouchStart(event) {
                startX = event.clientX || event.touches[0].clientX;
                startY = event.clientY || event.touches[0].clientY;

                target = event.target;
                parentEle = target.parentNode;
                parentH = parentEle.offsetHeight;

                startTime = (new Date()).getTime();

                index = 0; //开始触摸时，将序号重置为0

                var tf = parentEle.style.transform;//如果当前已经移动过那么取出当前的滚动值，方便后续在此基础上滑动
                if (tf) {
                    var reg = /,\s?(-?\d+)/;
                    reg.test(tf);
                    dis = parseInt(RegExp.$1); //获取当前滚动的值
                } else {
                    dis = 0;
                }

                mousedown = true;

                parentEle.style.transition = "none";
                clearTimeout(tsTimeout);
            }
            function dataTouchMove(event) {
                if(mousedown) {
                    endX = event.clientX || event.touches[0].clientX;
                    endY = event.clientY || event.touches[0].clientY;
    
                    curDis = dis + endY - startY;
                    parentEle.style.transform = "translate3D(0," + curDis + "px, 0)";
    
                    moved = true;
                }
                
            }
            function dataTouchEnd(event) {
                endTime = (new Date()).getTime();
                var endDis = Math.abs(endY - startY);
                var timeInterval = endTime - startTime;

                // document.getElementById("div01").innerHTML = "" + parseInt(endY - startY) + "&nbsp;" + timeInterval + "&nbsp;" +
                //     endDis / timeInterval;

                var lastRoll = 0;
                var timeOut = 0.15;

                if (endDis / timeInterval > 0.1) {
                    lastRoll = (endY - startY) * Math.exp(endDis / timeInterval);
                    timeOut = timeOut + (endDis / timeInterval) / 10;
                }

                if (moved) { // 只有移动了才触发
                    var dir = {};
                    if (endY - startY < 0) {
                        dir.swipeUp = true;
                        dir.swipeDown = false;
                    } else if (endY - startY > 0) {
                        dir.swipeDown = true;
                        dir.swipeUp = false;
                    }

                    dis = dis + endY - startY;
                    dis = dis + lastRoll;

                    if (dir.swipeUp && (parentH - Math.abs(dis) < (3 * cellH))) {//向上
                        dis = - (parentH - 3 * cellH);
                    } else if (dir.swipeDown && dis > 2 * cellH) {//向下，且移动距离大于两个cellH长度
                        dis = 2 * cellH;
                    } else {
                        dis = Math.round(dis / cellH) * cellH;
                    }

                    parentEle.style.transition = "transform " + timeOut + "s linear";
                    parentEle.style.transform = "translate3D(0," + dis + "px, 0)";
                    tsTimeout = setTimeout(function () {
                        parentEle.style.transition = "none";
                    }, timeOut * 1000);

                    if (dis > 0) {
                        index = 2 - (dis / cellH);
                    } else {
                        index = 2 + Math.abs(dis / cellH);
                    }

                    //农历年份变动，月日都可能会改变
                    var type = target.getAttribute("data-type");//当前触摸的类型
                if (calendarType == "solar") {
                    if (type === "year") {
                        var tempYear = document.querySelectorAll("#" + opt.pickerId + " div[data-type='year']")[index].getAttribute("data-value");

                        var y_a = _this.isLeapYear(tempYear);
                        var y_b = _this.isLeapYear(curYear);
                        if(tempYear == 1936) {
                            resetDaySelect(tempYear, curMonth);
                        }
                        else if ((y_a != y_b) && curMonth == 2) { // 判断两个年份是否都是闰年，当结果不同且当前月份是2月时，更新日期
                            // console.log(tempYear, tempMonth);
                            resetDaySelect(tempYear, curMonth);
                        }
                    }
                    if (type === "month") {

                        var tempMonth = document.querySelectorAll("#" + opt.pickerId + " div[data-type='month']")[index].getAttribute("data-value");

                        var m_a = _this.arrayContains(monthBig, tempMonth);
                        var m_b = _this.arrayContains(monthBig, curMonth);

                        if(curYear == 1936) {//限定日期，阳历为1936-1-24
                            resetDaySelect(curYear, tempMonth);
                        }
                        else if ((curMonth != tempMonth) && //前提是两次选择的月份, (两次的是否属于同属于大月或小月，不同才更新日期 || 当前选择的是2月 || 之前选择的是2月)
                            (
                                (m_a !== m_b) ||
                                tempMonth == 2 ||
                                curMonth == 2
                            )
                        ) {
                            // console.log(tempYear, tempMonth);
                            resetDaySelect(curYear, tempMonth);
                        }
                    }
                } else if (calendarType == "lunar") {
                    if (type === "year") {
                        var selectItem = document.querySelectorAll("#" + opt.pickerId + " div[data-type='year']")[index];
                        var selectItemYear = selectItem.getAttribute("data-value");
                        // console.log(selectItemYear);
                        resetLunarSelect(selectItemYear);
                    }
                    if (type === "month") {
                        var selectItem = document.querySelectorAll("#" + opt.pickerId + " div[data-type='month']")[index];
                        resetLunarSelect(curYear_index);
                    }
                }
                    //=============
                    _this.lastResult();//获取最终结果
                    //=============

                    startX = 0;
                    startY = 0;
                    endX = 0;
                    endY = 0;
                    moved = false;
                    mousedown = false;
                }

            }

            function getTranslateVal(id) {
                var transformStyle = document.querySelector("#" + id).style.transform;
                var reg = /,\s?(-?\d+)/;
                reg.test(transformStyle);
                var transVal = RegExp.$1;
                return transVal;
            }
            function resetLunarSelect(year) {
                //农历状态下，滚动年份月份时，自动调整月份及日天数
                info = LUNAR_YEAR_LIST[year];
                var m_html = "";
                var monthSelect = document.getElementById(opt.pickerId + "_month_select");
                var daySelect = document.getElementById(opt.pickerId + "_day_select");

                var mh_before = monthSelect.offsetHeight;
                var maxMonth = 12;
                if(year == 2050) {//2050年十一月十八
                    maxMonth = 11;
                }
                for(var i = 1; i <= maxMonth; i++) {
                    m_html += "<div class='cg-cell' data-type='month' data-index='" + i + "' data-value='" + info["monthName" + i] + "'>" + info["monthName" + i] + "</div>";
                    if(info['leapMonth'] == i) {
                        m_html += "<div class='cg-cell' data-type='month' data-index='l" + i + "' data-value='" + info["leapMonthName" + i] + "'>" + info["leapMonthName" + i] + "</div>";
                    }
                }
                monthSelect.innerHTML = m_html;
                var monthTransVal = getTranslateVal(opt.pickerId + "_month_select");
                var mh_after = monthSelect.offsetHeight;

                
                if(mh_before > mh_after && (mh_before - 3 * cellH == Math.abs(monthTransVal))) {
                    var lastMonthTransVal = parseInt(monthTransVal) + (mh_before - mh_after);
                    monthSelect.style.transform = "translate3D(0," + lastMonthTransVal + "px, 0)";
                }


                var curTransVal = parseInt(monthTransVal) + (mh_before - mh_after);
                var monthSelectIndex = Math.abs((curTransVal - 3 * cellH) / cellH);
                var aa = document.querySelectorAll("#" + opt.pickerId + " div[data-type='month']");
                var aai = aa[monthSelectIndex - 1];
                var aac = aai.getAttribute("data-index");
                var monthSelectVal = document.querySelectorAll("#" + opt.pickerId + " div[data-type='month']")[monthSelectIndex - 1].getAttribute("data-index");

                //重置农历日期
                var dCount = info[monthSelectVal];
                if(year == 2050 && monthSelectVal == 11) {//2050年十一月十八对应公历2050-12-31
                    dCount = 18;
                }

                var d_html = "";
                var dh_before = daySelect.offsetHeight;
                for(var i = 1; i <= dCount; i++) {
                    d_html += "<div class='cg-cell' data-type='day' data-index='" + i + "' data-value='" + LUNAR_DAY_NAME[i - 1] + "'>" + LUNAR_DAY_NAME[i - 1] + "</div>";
                }
                daySelect.innerHTML = d_html;
                var dayTransVal = getTranslateVal(opt.pickerId + "_day_select");
                var dh_after = daySelect.offsetHeight;
                // console.log((- dh_after + 2 * cellH));
                if(dh_before > dh_after && (dh_before - 3 * cellH == Math.abs(dayTransVal))) {
                    var lastDayTransVal = parseInt(dayTransVal) + (dh_before - dh_after);
                    daySelect.style.transform = "translate3D(0," + lastDayTransVal + "px, 0)";
                }

                if( dh_after - 3 * cellH < Math.abs(dayTransVal)) {
                    daySelect.style.transform = "translate3D(0," + ( - dh_after + 3 * cellH) + "px, 0)";
                }

                
            }

            function resetDaySelect(year, month) {
                //先获取最初日期选择条的高度
                // var c_before = document.querySelector("#" + opt.pickerId + "_day_select").offsetHeight;
                // var m_before = - (c_before - 3 * cellH);
                // console.log(year,month);
                var dEle= document.querySelector("#" + opt.pickerId + "_day_select");
                var dayEle_before = document.querySelectorAll("#" + opt.pickerId + " div[data-type='day']");
                var dct = dEle.style.transform;
                var reg = /,\s?(-?\d+)/;
                reg.test(dct);
                var dcd = RegExp.$1;
                function getIndex(val) {
                    return (val / cellH) < 0 ? (Math.abs(val / cellH) + 2) : (2 - (val / cellH));
                }
                var da = getIndex(dcd);
                var dv = dayEle_before[da].getAttribute("data-value");

                _this.getDay(year, month);
                var dayEle_after = document.querySelectorAll("#" + opt.pickerId + " div[data-type='day']");
                var dv_first = dayEle_after[0].getAttribute("data-value");
                var dds = dv - dv_first + 1;
                if(dds < 0) {
                    document.querySelector("#" + opt.pickerId + "_day_select").style.transform = "translate3D(0," + 2 * cellH + "px, 0)";
                } else {
                    var resetDayIndex = (dds - 0 <= 3) ? (3 - dds) : - (dds - 3);
                    var c_after = document.querySelector("#" + opt.pickerId + "_day_select").offsetHeight;
                    var m_after = - (c_after - 3 * cellH);

                    if(Math.abs(resetDayIndex * cellH) > Math.abs(m_after)) {
                        document.querySelector("#" + opt.pickerId + "_day_select").style.transform = "translate3D(0," + m_after + "px, 0)";
                    } else {
                        document.querySelector("#" + opt.pickerId + "_day_select").style.transform = "translate3D(0," + resetDayIndex * cellH + "px, 0)";
                    }
                }

            }

            //============ 公历阴历 ============
            var lunarYearInfo;
            var solarBtn = document.getElementById(opt.pickerId + "_solar");
            var lunarBtn = document.getElementById(opt.pickerId + "_lunar");
            solarBtn.addEventListener("click", solarCalendar);
            lunarBtn.addEventListener("click", lunarCalendar);

            function solarCalendar() {
                if(!hasClass(solarBtn, "active")) {
                    removeClass(lunarBtn, "active");
                    addClass(solarBtn, "active");
                    calendarType = "solar";
                    _this.solarYearSelect(lastDate.solarDate.year + "-" + lastDate.solarDate.month + "-" + lastDate.solarDate.day);
                    _this.lastResult();
                } else {
                    return;
                }
            }

            function lunarCalendar() {//初始化农历数据
                if(!hasClass(lunarBtn, "active")) {
                    removeClass(solarBtn, "active");
                    addClass(lunarBtn, "active");
                    calendarType = "lunar";

                    _this.lunarYearSelect(lastDate);
                    _this.lunarMonthSelect(lastDate);
                    _this.lunarDaySelect(lastDate);
                    _this.lastResult();
                    // console.log(curYear_index, curMonth_index, curDay_index, curYear, curMonth, curDay);
                } else {
                    return;
                }
            }

        }

        //=================
        this.solarYearSelect = function(solarDate) {
            var dateArr = solarDate.split("-");
            var solar_year = parseInt(dateArr[0]);
            var solar_month = parseInt(dateArr[1]);
            var solar_day = parseInt(dateArr[2]);

            y_index = (solar_year - 1936 <= 2) ? (2 - (solar_year - 1936)) : -(solar_year - 1936 - 2);
            m_index = (solar_month - 0 <= 3) ? (3 - solar_month) : - (solar_month - 3);

            var monthHTML = "";
            for (var i = 1, index = 0; i <= 12; i++ , index++) {
                monthHTML = monthHTML + "" +
                    "<div class='cg-cell' data-type='month' data-index='" + i + "' data-value='" + i + "'>" + i + "</div>";
            }
            document.getElementById(opt.pickerId + "_month_select").innerHTML = monthHTML;
            document.getElementById(opt.pickerId + "_year_select").style.transform = "translate3D(0," + y_index * cellH + "px, 0)";
            document.getElementById(opt.pickerId + "_month_select").style.transform = "translate3D(0," + m_index * cellH + "px, 0)";

            //确定好年月，得到月份
            this.getDay(solar_year, solar_month);
            d_index = (solar_day - 0 <= 3) ? (3 - solar_day) : - (solar_day - 3);
            if(solar_year == 1936 && solar_month == 1) {//1936正月初一
                d_index = d_index + 23;
            }
            document.getElementById(opt.pickerId + "_day_select").style.transform = "translate3D(0," + d_index * cellH + "px, 0)";
            // this.lastResult();//插件初始化获取初始值
        }

        // 下面要重写，后期考虑如何与resetrLunarSelect合并就更好
        this.lunarYearSelect = function(info) {
            var ly = info.lunarDate.lunar_year;
            if(ly != curYear) {
                var yi = document.querySelectorAll("#" + opt.pickerId + " div[data-type='year'][data-value='"+ ly +"']")[0].getAttribute("data-index");
                yi = parseInt(yi) - 1936 + 1;
                y_index = (yi - 0 <= 3) ? (3 - yi) : - (yi - 3);
                // console.log(y_index);
                document.getElementById(opt.pickerId + "_year_select").style.transform = "translate3D(0," + y_index * cellH + "px, 0)";
            }

        }
        this.lunarMonthSelect = function (info) {
            var html = "";
            var count = 1;
            var mi = 0;//这里计数从0开始

            var lm = info.lunarDate.lunar_m; //'l9'
            var lm_a = info.leapMonth;
            if(info.leapMonth) {
                if (lm.toString().indexOf("l") == 0) {
                    mi = parseInt(lm.substr(1)) + 1;
                } else if (parseInt(lm) <= lm_a) {
                    mi = parseInt(lm);
                } else if (lm > lm_a) {
                    mi = parseInt(lm) + 1;
                }
            } else {
                mi = parseInt(lm);
            }

            // console.log("sss", info);
            var maxMonth = 12;
            if(info.solarDate.year == 2050) {//2050年十一月十八
                maxMonth = 11;
            }
            for(var i = 1; i <= maxMonth; i++) {
                html += "<div class='cg-cell' data-type='month' data-index='" + i + "' data-value='" + info["monthName" + i] + "'>" + info["monthName" + i] + "</div>";
                if(info['leapMonth'] == i) {
                    html += "<div class='cg-cell' data-type='month' data-index='l" + i + "' data-value='" + info["leapMonthName" + i] + "'>" + info["leapMonthName" + i] + "</div>";
                    // console.log(info["leapMonthName" + i]);
                }
            }
            document.getElementById(opt.pickerId + "_month_select").innerHTML = html;
            m_index = (mi - 0 <= 3) ? (3 - mi) : - (mi - 3);
            document.getElementById(opt.pickerId + "_month_select").style.transform = "translate3D(0," + m_index * cellH + "px, 0)";
        };
        this.lunarDaySelect = function (info) {
            var html = "";
            var di = info.lunarDate.lunar_d;

            var maxDays = info[info.lunarDate.lunar_m];
            if(info.solarDate.year == 2050 && info.solarDate.month == 12) {//2050年十一月十八
                maxDays = 18;
            }

            for(var i = 1; i <= maxDays; i++) {
                html += "<div class='cg-cell' data-type='day' data-index='" + i + "' data-value='" + LUNAR_DAY_NAME[i - 1] + "'>" + LUNAR_DAY_NAME[i - 1] + "</div>";
            }
            document.getElementById(opt.pickerId + "_day_select").innerHTML = html;
            d_index = (di - 0 <= 3) ? (3 - di) : - (di - 3);
            document.getElementById(opt.pickerId + "_day_select").style.transform = "translate3D(0," + d_index * cellH + "px, 0)";
        };

    }

    //单独暴露阳历阴历转换接口
    MobPicker.toSolarDate = toSolarDate;
    MobPicker.toLunarDate = toLunarDate;

    return MobPicker;
})();