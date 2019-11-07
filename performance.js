const wrapper = require('./wrapperEntry');

const performanceParser = (perforceTiming) => {
  let timingGather = {};
  perforceTiming = perforceTiming || {};
  timingGather.redirect = perforceTiming.redirectEnd - perforceTiming.redirectEnd - perforceTiming.redirectStart;
  timingGather.dns = perforceTiming.domainLookupEnd - perforceTiming.domainLookupStart;
  timingGather.tcp = perforceTiming.connectEnd - perforceTiming.connectStart;
  timingGather.request = perforceTiming.responseStart - perforceTiming.requestStart;
  timingGather.response = perforceTiming.responseEnd - perforceTiming.responseStart;
  timingGather.domReady = perforceTiming.domContentLoadedEventStart - perforceTiming.navigationStart;
  timingGather.load = perforceTiming.loadEventStart - perforceTiming.navigationStart;
  return timingGather;
};

const showPerformanceInfo = (performanceInfo) => {
  performanceInfo = performanceInfo || {};
  console.log(`页面重定向耗时:${performanceInfo.redirect}`);
  console.log(`DNS查找耗时:${performanceInfo.dns}`);
  console.log(`TCP连接耗时:${performanceInfo.tcp}`);
  console.log(`请求发送耗时:${performanceInfo.request}`);
  console.log(`响应接收耗时:${performanceInfo.response}`);
  console.log(`DOMReady耗时:${performanceInfo.domReady}`);
  console.log(`页面加载耗时:${performanceInfo.load}`);
};

wrapper.prepareAPI().then(([chromeInstance, remoteInterface]) => {
  const {
    Runtime,
    Page
  } = remoteInterface;

  Page.loadEventFired(() => {
    Runtime.evaluate({
      expression: 'window.performance.timing.toJSON()',
      returnByValue: true //不加这个参数，拿到的是一个对象的meta信息,还需要getProperties
    }).then((resultObj) => {
      let {
        result,
        exceptionDetails
      } = resultObj;
      if (!exceptionDetails) {
        showPerformanceInfo(performanceParser(result.value))
      } else {
        throw exceptionDetails;
      }
    });
  });

  Page.enable().then(() => {
    Page.navigate({
      url: 'https://www.baidu.com'
    })
  });
}).catch(err => {
  console.error(err)
});