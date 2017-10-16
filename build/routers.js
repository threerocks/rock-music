'use strict';

const pinyin = require('pinyin');
exports.router = function (app) {
  app.get('/api/pingyin', getPinyin);
};

function getPinyin(req, res) {
  const item = req.query.item;
  res.json(pinyin(item, {
    style: pinyin.STYLE_NORMAL, // 设置拼音风格
    heteronym: true,
  }));
}
