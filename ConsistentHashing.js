'use strict';

const crypto = require('crypto');

function HashRing(serverWeight = 50, servers = null) {
  if (serverWeight <= 0) throw new Error('Negativ servers weight!');
  this.serverWeight = serverWeight;
  this.serverCount = 0;
  this.hashes = [];
  this.algorithm = 'md5';
  this.ring = {};
  if (servers !== null) {
    for (let i = 0; i < servers.length; i++) {
      this.addServer(i.toString(), servers[i]);
    }
  }
}

HashRing.prototype.createHash = function(key) {
  return crypto.createHash(this.algorithm).update(key).digest('hex');
};

HashRing.prototype.addServer = function(id, server) {
  if (this.hasServer(id)) {
    throw new Error('Server with such key already exists');
  }
  this.serverCount++;
  server.id = id;
  for (let i = 0; i < this.serverWeight; i++) {
    const hash = this.createHash(id + i.toString());
    this.ring[hash] = server;
    this.hashes.push(hash);
  }
  this.hashes.sort();
  if (this.serverCount === 1) return;
  for (let i = 0; i < this.serverWeight; i++) {
    const hash = this.createHash(id + i.toString());
    let serverToGetData = null;
    for (let i = this.hashes.indexOf(hash) + 1; ; i++) {
      if (i === this.hashes.length) i = 0;
      if (this.ring[this.hashes[i]] === this.ring[hash]) {
        break;
      }
      if (this.ring[this.hashes[i]] !== undefined) {
        serverToGetData = this.ring[this.hashes[i]];
        break;
      }
    }
    if (serverToGetData === null) continue;
    for (const key of serverToGetData) {
      if (this.getClosestServer(this.createHash(key)) !== serverToGetData) {
        server.push(key, serverToGetData.getData(key));
        serverToGetData.remove(key);
      }
    }
  }
};

HashRing.prototype.removeServer = function(id) {
  if (this.serverCount < 1) throw new Error('Too few servers!');
  if (!this.hasServer(id)) throw new Error('No such server!');
  this.serverCount--;
  let hash = this.createHash(id + '0');
  const serverToRemove = this.ring[hash];
  for (let i = 0; i < this.serverWeight; i++) {
    hash = this.createHash(id + i.toString());
    delete this.ring[hash];
    this.hashes.splice(this.hashes.indexOf(hash), 1);
  }
  for (const key of serverToRemove) {
    const dataToPut = serverToRemove.getData(key);
    hash = this.createHash(key);
    const closestServer = this.getClosestServer(hash);
    closestServer.push(key, dataToPut);
  }
};

HashRing.prototype.addData = function(key, data) { //add checking if has
  const hash = this.createHash(key);
  this.hashes.push(hash);
  this.hashes.sort();
  const closestServer = this.getClosestServer(hash);
  closestServer.push(key, data);
};

HashRing.prototype.getData = function(key) {
  const hash = this.createHash(key);
  const closestServer = this.getClosestServer(hash);
  if (closestServer.has(key)) return closestServer.getData(key);
  else return null;
};

HashRing.prototype.hasData = function(key) {
  const hash = this.createHash(key);
  const closestServer = this.getClosestServer(hash);
  if (closestServer.has(key)) return true;
  else return false;
};

HashRing.prototype.hasServer = function(id) {
  if (this.serverCount === 0) return false;
  for (let i = 0; i < this.serverWeight; i++) {
    const hash = this.createHash(id + i.toString());
    const closestServer = this.getClosestServer(hash);
    if (closestServer.id !== id) return false;
  }
  return true;
};

HashRing.prototype.removeData = function(key) {
  if (!this.hasData(key)) return;
  const hash = this.createHash(key);
  const closestServer = this.getClosestServer(hash);
  this.hashes.splice(this.hashes.indexOf(hash), 1);
  closestServer.remove(key);
};

HashRing.prototype.getServerId = function(key) {
  const hash = this.createHash(key);
  const closestServer = this.getClosestServer(hash);
  if (closestServer.has(key)) return closestServer.id;
  else return null;
};

HashRing.prototype.getClosestServer = function(hash) {
  if (this.serverCount === 0) {
    throw new Error('Ring is empty!');
  }
  for (let i = this.hashes.indexOf(hash); ; i++) {
    if (i === this.hashes.length) i = 0;
    const current = this.ring[this.hashes[i]];
    if (current) return current;
  }
};

module.exports = HashRing;
