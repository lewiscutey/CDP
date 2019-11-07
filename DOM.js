const CDP = require('chrome-remote-interface');

CDP(client => {

  const { DOM } = client

  Promise.all([
    DOM.enable()
  ]).then(() => {
    DOM.getDocument((error, params) => {
      if (error) {
        console.error(params);
        return;
      }
  
      console.log(`param`, params)
      DOM.childNodeInserted({
        parentNodeId: params.root.nodeId,
        previousNodeId: params.root.nodeId + 1,
        node: {
          attributes: ["ref", "5", "type", "button", "class", "btn", "value", "跳转"],
          childNodeCount: 0,
          children: [],
          localName: "input",
          nodeId: 7,
          nodeName: "input",
          nodeType: 1,
          nodeValue: "",
        }
      })
    })

  })

}).on('error', err => {
  console.log(`Cannot connect to browser`, err)
})