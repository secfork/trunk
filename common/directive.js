var app = angular.module("common.common_directive" , []);

//页面
app.directive('dyPage' , function(){
    return {
        "restrict" : 'EA',
        "transclude" : true,
        "templateUrl" : "/syalias/trunk/components/page.html",
        "controller" : "dyPage",
        "scope" : true
    }
});
//页面属性
app.directive('propPage' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propPage.html",
        "controller" : "propPage",
        "scope" : true
    }
});
//panel组件
app.directive('dyPanel' , function(){
    return {
        "restrict" : 'EA',
        "transclude" : true,
        "templateUrl" : "/syalias/trunk/components/panel.html",
        "controller" : "dyPanel",
        "scope" : true
    }
});
//panel组件属性
app.directive('propPanel' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propPanel.html",
        "controller" : "propPanel",
        "scope" : true
    }
});
//text组件
app.directive('dyText' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/text.html",
        "controller" : "dyText",
        "scope" : true
    }
});
//text组件属性
app.directive('propText' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propText.html",
        "controller" : "propText",
        "scope" : true
    }
});
//img组件
app.directive('dyImg' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/img.html",
        "controller" : "dyImg",
        "scope" : true
    }
});
//img组件属性
app.directive('propImg' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propImg.html",
        "controller" : "propImg",
        "scope" : true
    }
});
//chart组件
app.directive('dyChart' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/chart.html",
        "controller" : "dyChart",
        "scope" : true
    }
});
//chart组件属性
app.directive('propChart' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propChart.html",
        "controller" : "propChart",
        "scope" : true
    }
});
//table组件
app.directive('dyTable' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/table.html",
        "controller" : "dyTable",
        "scope" : true

    }
});
//table组件属性
app.directive('propTable' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propTable.html",
        "controller" : "propTable",
        "scope" : true
    }
});
//clock组件
app.directive('dyClock' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/clock.html",
        "controller" : "dyClock",
        "scope" : true

    }
});
//clock组件属性
app.directive('propClock' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propClock.html",
        "controller" : "propClock",
        "scope" : true
    }
});
//alarm table组件
app.directive('dyAlarm' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/alarm.html",
        "controller" : "dyAlarm",
        "scope" : true

    }
});
//alarm table组件属性
app.directive('propAlarm' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propAlarm.html",
        "controller" : "propAlarm",
        "scope" : true
    }
});
// button组件
app.directive('dyButton' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/button.html",
        "controller" : "dyButton",
        "scope" : true
    }
});
// button组件属性
app.directive('propButton' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propButton.html",
        "controller" : "propButton",
        "scope" : true
    }
});
app.directive('dyGenerator' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/components/imagePlayer.html"
	}
});


app.directive('dyNav' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/components/nav.html"
	}
});

app.directive('dyPie' , function(){
	return {
		"restrict" : 'EA',
		"templateUrl" : "/syalias/trunk/components/pie.html"
	}
});

app.directive('dyHistorychart' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/historychart.html"
    }
});

app.directive('dyBulb' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/bulb.html"
    }
});

// app.directive('dyGauge' , function(){
//     return {
//         "restrict" : 'EA',
//         "templateUrl" : "/syalias/trunk/components/gauge.html"
//     }
// });

app.directive('dyInputbox' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/inputbox.html"
    }
});




app.directive('dyMap' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/map.html"
    }
});

app.directive('dyInput' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/input.html"
    }
});

app.directive('dySelect' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/select.html"
    }
});

app.directive('dyTimepicker' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/timepicker.html"
    }
});
// weather组件
app.directive('dyWeather' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/weather.html",
        "controller" : "dyWeather",
        "scope" : true
    }
});
// weather组件属性
app.directive('propWeather' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propWeather.html",
        "controller" : "propWeather",
        "scope" : true
    }
});
// gauge组件
app.directive('dyGauge' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/components/gauge.html",
        "controller" : "dyGauge",
        "scope" : true
    }
});
// weather组件属性
app.directive('propGauge' , function(){
    return {
        "restrict" : 'EA',
        "templateUrl" : "/syalias/trunk/componentsProperty/propGauge.html",
        "controller" : "propGauge",
        "scope" : true
    }
});
