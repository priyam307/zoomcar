class HttpService {
    constructor() {
    }
    setURL(url) {
        this.url = url;
    }
    constructQueryParams(params) {
        var qParams = "?";
        Object.keys(params).forEach((val)=>{
            if(qParams.length <= 2) {
                qParams = qParams + val + '=' + params[val];
            } else {
                qParams = qParams + '&&' + val + '=' + params[val];
            }
        });
        return qParams;
    }
    getRequest(requestObject) {
        // Get a user
        let url  = this.url, xhr = new XMLHttpRequest(), qParams = "", endPoint = "";
        if(requestObject.qParams) {
            qParams = this.constructQueryParams(requestObject.qParams);
        }
        if(requestObject.endPoint) {
            endPoint = requestObject.endPoint;
        }
        xhr.open('GET', url + endPoint + qParams, true);
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                if(requestObject.callback) {
                    requestObject.callback(response);
                }
            } else {
                console.error(response);
            }
        }
        xhr.send(null);
    }
}
let httpService = new HttpService();
export default httpService;