/*************************************
 *description:参数类型规则定义，check模块使用
 *author:yingf
 *email:guangfei.me@gmail.com
 *************************************/
 //公用函数
function string(value,maxLen){
     return typeof value == "string" && value.length<=maxLen;
}
function integer(value)
{
    var integer = /^(?:-?(?:0|[1-9][0-9]*))$/;
    return integer.test(value) && value % 1 == 0 && value>=-2147483648 && value <=4294967295;
}
function smallint(value)
{
    return integer(value) && value>=-32768 && value<=65535;
}
function number(value)
{
    return typeof value == "number" ;   
}
function bool(value)
{
    var bool = /true|false$/;
    return bool.test(value);
}
function ip(value,version)
{
    if(value==='localhost')
        value="127.0.0.1";
     var ipv4Maybe = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/
      , ipv6 = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;
        if (!version) {
            return false;
        } else if (version === 4) {
            if (!ipv4Maybe.test(value)) {
                return false;
            }
            var parts = value.split('.').sort(function (a, b) {
                return a - b;
            });
            return parts[3] <= 255;
        }
        return version === 6 && ipv6.test(value);
}
//基本类型
var baseCheck={
    "boolean": function(value)
    {
        return typeof value == "boolean";
    },
    "number": function(value)
    {
        //var regexp = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
        return typeof value == "number" ;
    },
    "integer": function(value)
    {
        return integer(value);
    },
    "float":function(value)
    {
        var float = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;
        return value !== '' && float.test(value);
    },
    "null":function(value)
    {
        return value.length === 0;
    },
    //note:use JSON.parse();
    "json":function(value)
    {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
    },
    "date":function(value)
    {
         return !isNaN(Date.parse(value));
    },
    "array":function(value)
    {
        return value instanceof Array;
    },
    "tinyint": function(value)
    {
        return integer(value) && value>=-128 && value<=255;
    },
    "unsignedtinyint": function(value)
    {
        return integer(value) && value>=0 && value<=255; 
    },
    "signedtinyint": function(value)
    {
        return integer(value) && value>=-128 && value<0;
    },
    "signednumber": function(value){
        var numeric = /^-?[0-9]+$/;
        return numeric.test(value) && value<0; 
    },
    "unsignednumber": function(value)
    {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(value) && value>=0; 
    },
    "unsignedint": function(value)
    {
        return integer(value) && value>=0;
    },
    "unsignedsmallint": function(value)
    {
        return smallint(value) && value>=0;
    },
    "signedint": function(value){
        return integer(value) && value<0;
    },
    "unsignedsmallint": function(value)
    {
        return integer(value) && value>=0 && value<=65535;
    } ,
    "signedsmallint": function(value)
    {
        return integer(value) && value<0 && value>=-32768;
    },
    "text": function(value)
    {
        return string(value,65535);
    },
    "notnull": function(value)
    {
        return (typeof value!='undefined') && value!=null && value!='';
    }
}

//字段类型，命名规则：按照字段数据类型命名
module.exports.paramsCheck={
    "string64_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&string(value,64)):(typeof value==='undefined' || string(value,64));
    },
    // 目前密码校验比较简单，后期将修改为可进行密码强度检查
    "password_type":function(value,notnull){
        return notnull ? (baseCheck.notnull(value)&&string(value,64)):(typeof value==='undefined' || string(value,64));
    },
    "unsignednumber_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&baseCheck.unsignednumber(value)):(typeof value==='undefined' || baseCheck.unsignednumber(value));
    },
    "string256_type": function(value,notnull)
    {

        return notnull ? (baseCheck.notnull(value)&&string(value,256)):(typeof value==='undefined' || string(value,256));
    },
    "string65535_type": function(value,notnull){
        return notnull ? (baseCheck.notnull(value)&&baseCheck.text(value)):(typeof value==='undefined' || baseCheck.text(value));
    },
    "string36_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&string(value,36)):(typeof value==='undefined' || string(value,36));
    },
    "date_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&baseCheck.date(value)):(typeof value==='undefined' || baseCheck.date(value));
    },
    "unsignedint_type": function(value,notnull){
        return notnull ? (baseCheck.notnull(value)&&baseCheck.unsignedint(value)):(typeof value==='undefined' || baseCheck.unsignedint(value));
    },
    // standard: RegExp对象或者正则表达试
    "regexp": function(value, standard)
    {
        var regexp = standard instanceof RegExp ? standard : new RegExp(standard);
        return regexp.test(value);
      
    },
    "uuid_type": function(value,notnull)
    {
        var uuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
        return notnull ? (baseCheck.notnull(value)&&uuid.test(value)):(typeof value==='undefined' || uuid.test(value));
    },
    "string16_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&string(value,16)):(typeof value==='undefined' || string(value,16));
    },
    "string1024_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&string(value,1024)):(typeof value==='undefined' || string(value,1024));
    },
    "float_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&& baseCheck.float(value)):(typeof value==='undefined' || baseCheck.float(value));
    },
    "tinyint_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&baseCheck.tinyint(value)):(typeof value==='undefined' || baseCheck.tinyint(value));
    },
    "log_type": function(value,notnull)
    {
        var enu = /raw|delta$/;
        return notnull ? (baseCheck.notnull(value)&&enu.test(value)):(typeof value==='undefined' ||enu.test(value));
    },
    "unsignedsmallint_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&baseCheck.unsignedsmallint(value)):(typeof value==='undefined' || baseCheck.unsignedsmallint(value));
    },
    "integer_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&& integer(value)):(typeof value==='undefined' || integer(value));
    },
    "ip_type": function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&(ip(value,4)|| ip(value,6))):(typeof value==='undefined') || (ip(value,4)|| ip(value,6));
    },
    "bool_type":function(value,notnull)
    {
        var bool = /true|false$/;
        return notnull ? (baseCheck.notnull(value)&&bool.test(value)):(typeof value==='undefined' || bool.test(value));
    },
    "trigger_type":function(value,notnull)
    {
        var trigger = /live|timer|status$/;
        return notnull ? baseCheck.notnull(value)&&trigger.test(value):typeof value==='undefined' || trigger.test(value);
    },
    "json_type":function(value,notnull)
    {
        return notnull ? (baseCheck.notnull(value)&&baseCheck.text(value) &&baseCheck.json(value)):(typeof value==='undefined' || (baseCheck.text(value) &&baseCheck.json(value)));
    },
    "actions_type":function(value,notnull)
    {
        var actions = /alarm|event|task$/;
        return notnull ? baseCheck.notnull(value)&&actions.test(value):typeof value==='undefined' || actions.test(value);
    },
    "state_type":function(value,notnull)
    {
        var stata =/unactive|active|suspend$/;
        return notnull ? baseCheck.notnull(value)&&stata.test(value):typeof value==='undefined' || stata.test(value);
    },
    "accessKey_type":function(value,notnull){
        var hexadecimal = /^[0-9A-F]+$/i;
        return notnull ? baseCheck.notnull(value)&&hexadecimal.test(value):typeof value==='undefined' || hexadecimal.test(value);
    },
    "id_type":function(value,notnull){
        var id = /^\d+(\.\d+)$/;
        return notnull ? baseCheck.notnull(value)&&id.test(value):typeof value==='undefined' || id.test(value);
    },
    "hisOp_type":function(value,notnull){
        var op=/readraw|readinterval|readattime|readprocess$/;
        return notnull ? baseCheck.notnull(value)&&op.test(value):typeof value==='undefined' || op.test(value);
    },
    "mode_type":function(value,notnull){
        var mode=/last_value|next_value|linear$/;
        return notnull ? baseCheck.notnull(value)&&mode.test(value):typeof value==='undefined' || mode.test(value);
    },
    "stats_type":function(value,notnull){
        var stats=/sum|avg|max|min|count$/;
        return notnull ? baseCheck.notnull(value)&&stats.test(value):typeof value==='undefined' || stats.test(value);
    },
    "alarm_type":function(value,notnull){
        var alarm_num = integer(value) && value>=0 && value<=11;
         return notnull ? baseCheck.notnull(value)&&alarm_num:typeof value==='undefined' || alarm_num;
    },
    "severity_type":function(value,notnull){
        return true;
    },
    "classid_type":function(value,notnull){
        return true;
    },
    "quality_type":function(value,notnull){
      return true;
    }
}