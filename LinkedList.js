'use strict';

class Node {
  constructor(list, key, data) {
    this.list = list;
    this.key = key;
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  isEmpty() {
    return (!this.length);
  }

  isValid(index) {
    return (!(index < 0 || index > this.length));
  }

  [Symbol.iterator]() {
    let current = this.first;
    return {
      next() {
        if (!current) return {
          done: true,
          value: null
        };
        const value = current.key;
        current = current.next;
        return {
          done: false,
          value
        };
      }
    };
  }

  push(key, data) {
    const node = new Node(this, key, data);
    node.prev = this.last;
    if (this.isEmpty()) this.first = node;
    else this.last.next = node;
    this.last = node;
    this.length++;
    return node;
  }

  pop() {
    if (this.length > 0) {
      const node = this.last;
      this.last = node.prev;
      node.prev.next = null;
      node.list = null;
      node.prev = null;
      node.next = null;
      node.key = null;
      this.length--;
      return node.data;
    }

  }

  unshift(key, data) {
    const node = new Node(this, key, data);
    node.next = this.first;
    if (this.isEmpty()) this.last = node;
    else this.first.prev = node;
    this.first = node;
    this.length++;
    return node;
  }

  shift() {
    if (this.length > 0) {
      const node = this.first;
      this.first = node.next;
      node.next.prev = null;
      node.list = null;
      node.prev = null;
      node.next = null;
      node.key = null;
      this.length--;
      return node.data;
    }
  }

  remove(key) {
    if (this.isEmpty()) return;
    if (this.first.key === key) return this.shift();
    if (this.last.key === key) return this.pop();
    let selectedNode = this.first;
    while (selectedNode.key !== key) {
      if (selectedNode.next === null) return;
      selectedNode = selectedNode.next;
    }
    selectedNode.prev.next = selectedNode.next;
    selectedNode.next.prev = selectedNode.prev;
    selectedNode.prev = null;
    selectedNode.next = null;
    selectedNode.list = null;
    selectedNode.key = null;
    this.length--;
    return selectedNode.data;
  }

  has(key) {
    if (this.isEmpty()) return false;
    if (this.first.key === key) return true;
    let selectedNode = this.first;
    while (selectedNode.key !== key) {
      if (selectedNode.next === null) return false;
      selectedNode = selectedNode.next;
    }
    return true;
  }

  getData(key) {
    if (this.isEmpty()) return null;
    if (this.first.key === key) return this.first.data;
    let selectedNode = this.first;
    while (selectedNode.key !== key) {
      if (selectedNode.next === null) return null;
      selectedNode = selectedNode.next;
    }
    return selectedNode.data;
  }
}

module.exports = LinkedList;
