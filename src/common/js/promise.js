// 顺序执行Promise
// 需要注意的一点是，和 Promise.all 等不同，这个函数接收的参数是一个函数的数组。
exports.sequenceTasks = function (tasks) {
  function recordValue(results, value) {
      results.push(value);
      return results;
  }
  var pushValue = recordValue.bind(null, []);
  return tasks.reduce(function (promise, task) {
      return promise.then(task).then(pushValue);
  }, Promise.resolve());
}