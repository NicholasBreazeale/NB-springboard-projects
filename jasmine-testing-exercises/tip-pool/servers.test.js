describe("Servers test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
  });

  it('should add a new server to allServers on submitServerInfo()', function () {
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');
  });

  it('should update serverTbody to match the content of allServers', function () {
    let serverTbodyLength = serverTbody.children.length;
    submitServerInfo();

    expect(serverTbody.children.length).toEqual(serverTbodyLength+1);
    expect(document.querySelector('#server' + serverId).children[0].innerText).toEqual('Alice');
  });

  afterEach(function() {
    // teardown logic
    delete allServers['server' + serverId];
    --serverId;
    updateServerTable();
  });
});
