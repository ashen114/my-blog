---
title: 区块链结构
description: 用PHP梳理了一下简易的结构
date: '2018-09-04T10:26:41.000Z'
---

# PHP 区块链

一个区块的结构:

```javascript
block = {
  index: 1,
  timestamp: 1506057125.900785,
  transactions: [
    {
      sender: "8527147fe1f5426f9dd545de4b27ee00",
      recipient: "a77f5cdfa2934df3954a5c7c7da5df1f",
      amount: 5
    }
  ],
  proof: 324984774000,
  previous_hash:
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
};
```

> 这里面每个区块包含属性：索引（index），Unix 时间戳（timestamp），交易列表（transactions），工作量证明以及前一个区块的 Hash 值。每个新的区块都包含上一个区块的 Hash，这是关键的一点，它保障了区块链不可变性。如果攻击者破坏了前面的某个区块，那么后面所有区块的 Hash 都会变得不正确。

## 区块属性

* 索引（index）
* Unix 时间戳（timestamp）
* 交易列表（transactions）
* 工作量证明
* 前一个区块的 Hash 值。

_XMind: ZEN - Trial Version_

