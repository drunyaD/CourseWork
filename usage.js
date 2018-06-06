'use strict';

const HashRing = require('./ConsistentHashing');
const LinkedList = require('./LinkedList');
const nodes = [];
for (let i = 0; i < 10; i++) {
  nodes[i] = new LinkedList();
}
const hashRing = new HashRing(50, nodes);

for (let i = 0; i < 1000; i++) {
  hashRing.addData('key' + i.toString(), 'data' + i.toString());
}

hashRing.removeServer('5');
hashRing.addServer('66', new LinkedList());
console.dir(hashRing);
